'use client'

import React, { useState } from 'react'
import { 
  Upload, 
  Download, 
  FileSpreadsheet, 
  Globe, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  FileCode,
  ArrowRight,
  Database as DBIcon
} from 'lucide-react'
import * as XLSX from 'xlsx'
import shp from 'shpjs'
import dynamic from 'next/dynamic'
import { supabase } from '@/lib/supabase'
import TabularImport from './components/TabularImport'

import { SimpleMap } from '@/components/map'

export default function DataPage() {
  const [activeTab, setActiveTab] = useState<'import' | 'export' | 'docs'>('import')
  const [spatialData, setSpatialData] = useState<any>(null)
  const [importing, setImporting] = useState(false)

  const kmlToGeoJson = (kmlText: string) => {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(kmlText, 'text/xml')
    const placemarks = xmlDoc.getElementsByTagName('Placemark')
    const features = []

    for (let i = 0; i < placemarks.length; i++) {
      const pm = placemarks[i]
      const name = pm.getElementsByTagName('name')[0]?.textContent || 'Sin Nombre'
      const coordsText = pm.getElementsByTagName('coordinates')[0]?.textContent?.trim()
      
      if (coordsText) {
        const coords = coordsText.split(/\s+/).map(c => {
          const [lng, lat] = c.split(',').map(Number)
          return [lng, lat]
        })

        if (coords.length === 1) {
          features.push({
            type: 'Feature',
            properties: { name },
            geometry: { type: 'Point', coordinates: coords[0] }
          })
        } else if (coords.length > 3) {
          features.push({
            type: 'Feature',
            properties: { name },
            geometry: { type: 'Polygon', coordinates: [coords] }
          })
        }
      }
    }

    return { type: 'FeatureCollection', features }
  }

  const handleSpatialUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const extension = file.name.split('.').pop()?.toLowerCase()
    
    try {
      const buffer = await file.arrayBuffer()
      let geojson: any = null

      if (extension === 'zip') {
        geojson = await shp(buffer)
      } else if (extension === 'kml') {
        const text = new TextDecoder().decode(buffer)
        geojson = kmlToGeoJson(text)
      } else if (extension === 'geojson' || extension === 'json') {
        const text = new TextDecoder().decode(buffer)
        geojson = JSON.parse(text)
      }

      setSpatialData({ name: file.name, data: geojson })
    } catch (err) {
      console.error('Error parsing spatial file:', err)
      alert('Error al procesar el archivo. Si es SHP, use un .zip con todos sus archivos.')
    }
  }

  const handleSaveSpatial = async () => {
    if (!spatialData) return
    setImporting(true)

    try {
      const features = spatialData.data.features || [spatialData.data]
      
      // Get a default project and parcel for the demo
      const { data: projData } = await supabase.from('projects').select('id').limit(1).single()
      const { data: parcData } = await supabase.from('parcels').select('id').limit(1).single()

      if (!projData) throw new Error('No se encontró un proyecto activo. Cree uno primero.')

      for (const feature of features) {
        const geomType = feature.geometry.type
        if (geomType === 'Polygon' || geomType === 'MultiPolygon') {
          await (supabase.from('parcels') as any).insert({
            name: feature.properties?.name || `Capa ${spatialData.name}`,
            project_id: (projData as any).id,
            boundary: feature.geometry
          })
        } else if (geomType === 'Point') {
          await (supabase.from('trees') as any).insert({
            parcel_id: parcData ? (parcData as any).id : null,
            location: feature.geometry,
            species_id: null
          })
        }
      }
      
      alert('Datos espaciales vinculados exitosamente.')
      setSpatialData(null)
    } catch (err: any) {
      console.error('Save error:', err)
      alert('Error al vincular: ' + err.message)
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="p-8 animate-in fade-in duration-700">
      <header className="mb-10">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Centro de Datos & SIG</h2>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Intercambio de Información • RNSC Palmarito</p>
      </header>

      <div className="flex space-x-2 mb-10 overflow-x-auto pb-2">
        {[
          { id: 'import', label: 'Importación Inteligente', icon: Upload },
          { id: 'export', label: 'Exportación de Capas', icon: Download },
          { id: 'docs', label: 'Gestor Documental', icon: FileText },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id 
                ? 'bg-emerald-900 text-white shadow-xl shadow-emerald-100 z-10' 
                : 'bg-white text-slate-400 hover:bg-slate-50'
            }`}
          >
            <tab.icon className="mr-2 h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'import' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Spatial Import */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-50 shadow-sm flex flex-col h-full">
            <div className="h-14 w-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 border border-emerald-100/50">
              <Globe className="h-7 w-7" />
            </div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-2">Ingesta de Capas SIG</h3>
            <p className="text-xs text-slate-400 font-bold mb-8 leading-relaxed">
              Integre polígonos de parcelas, trazados de corredores o inventarios georreferenciados (.SHP, .KML, .GeoJSON).
            </p>
            
            {!spatialData ? (
              <label className="flex-1 flex flex-col items-center justify-center border-4 border-dashed border-slate-50 rounded-[2.5rem] p-10 text-center hover:border-emerald-200 hover:bg-emerald-50/20 transition-all cursor-pointer group">
                <input type="file" className="hidden" onChange={handleSpatialUpload} accept=".zip,.kml,.geojson" />
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform">
                   <Upload className="h-8 w-8 text-slate-300" />
                </div>
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Arrastra o Selecciona</p>
                <p className="text-[10px] text-slate-300 font-bold mt-2 italic">Formatos: SHP (zip), KML, GeoJSON</p>
              </label>
            ) : (
              <div className="flex-1 flex flex-col">
                 <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100 mb-4">
                    <div className="flex items-center">
                       <CheckCircle2 className="text-emerald-500 mr-2" size={16} />
                       <span className="text-[11px] font-black text-emerald-900 uppercase">{spatialData.name}</span>
                    </div>
                    <button onClick={() => setSpatialData(null)} className="text-[10px] font-black text-emerald-600 uppercase hover:underline">Cambiar</button>
                 </div>
                 <div className="flex-1 min-h-[300px] rounded-3xl overflow-hidden border border-slate-50 shadow-inner">
                    <SimpleMap shapes={spatialData.data.features ? [spatialData.data] : []} zoom={15} center={[5.312, -71.505]} height="100%" />
                 </div>
                 <button 
                    onClick={handleSaveSpatial}
                    disabled={importing}
                    className="w-full h-14 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] mt-6 shadow-2xl hover:bg-black transition-all disabled:opacity-50"
                 >
                    {importing ? 'Vinculando...' : 'Vincular Capa al Proyecto'}
                 </button>
              </div>
            )}
          </div>

          {/* Tabular Import */}
          <TabularImport />
        </div>
      )}

      {activeTab === 'export' && (
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-50 shadow-sm animate-in fade-in slide-in-from-bottom-2">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Exportación de Activos</h3>
              <div className="h-1 w-20 bg-emerald-500 rounded-full"></div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: 'Dataset de Árboles', format: 'GeoJSON', color: 'bg-emerald-50 text-emerald-600' },
                { label: 'Polígonos Parcelas', format: 'KML', color: 'bg-blue-50 text-blue-600' },
                { label: 'Inventario Completo', format: 'Excel (XLSX)', color: 'bg-amber-50 text-amber-600' },
                { label: 'Protocolos de Campo', format: 'PDF', color: 'bg-rose-50 text-rose-600' },
                { label: 'Shapefile Completo', format: 'ZIP', color: 'bg-slate-50 text-slate-600' },
              ].map((item, i) => (
                <div key={i} className="p-6 border border-slate-50 rounded-3xl bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all group cursor-pointer">
                   <div className={`text-[10px] font-black uppercase px-2 py-1 rounded-md inline-block mb-4 ${item.color}`}>
                      {item.format}
                   </div>
                   <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">{item.label}</h4>
                   <button className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-emerald-500 transition-colors">
                      <Download size={14} className="mr-2" /> Descargar Archivo
                   </button>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'docs' && (
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-50 shadow-sm animate-in fade-in slide-in-from-bottom-2">
           <div className="flex justify-between items-start mb-10">
              <div>
                 <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-2">Repositorio Técnico RNSC</h3>
                 <p className="text-xs text-slate-400 font-bold">Gestión de licencias ambientales y planes de manejo.</p>
              </div>
              <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                 Subir Documento
              </button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                 { name: 'Licencia Ambiental #42', type: 'PDF', date: '10 Dic 2023' },
                 { name: 'Plan de Restauración B1', type: 'PDF', date: '05 Ene 2024' },
                 { name: 'Protocolo de Seguridad', type: 'DOCX', date: '20 Feb 2024' },
              ].map((doc, i) => (
                 <div key={i} className="p-6 border border-slate-50 rounded-3xl bg-white hover:shadow-xl transition-all flex items-center">
                    <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 mr-4">
                       <FileText size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                       <h4 className="text-[11px] font-black text-slate-800 uppercase truncate mb-1">{doc.name}</h4>
                       <p className="text-[10px] text-slate-400 font-bold">{doc.date} • {doc.type}</p>
                    </div>
                    <Download size={16} className="text-slate-300 hover:text-emerald-500 cursor-pointer ml-3" />
                 </div>
              ))}
           </div>
        </div>
      )}
    </div>
  )
}
