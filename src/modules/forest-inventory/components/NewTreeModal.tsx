'use client'

import React, { useState, useEffect } from 'react'
import { X, MapPin, Camera, Save, TreeDeciduous, Loader2 } from 'lucide-react'
import { treeService } from '../services/treeService'
import { Parcel, Species } from '../types'

interface NewTreeModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  parcels: Parcel[]
}

export function NewTreeModal({ isOpen, onClose, onSuccess, parcels }: NewTreeModalProps) {
  const [loading, setLoading] = useState(false)
  const [species, setSpecies] = useState<Species[]>([])
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null)
  const [gps, setGps] = useState<{lat: number, lng: number, alt: number} | null>(null)
  const [photos, setPhotos] = useState<File[]>([])

  useEffect(() => {
    if (isOpen) {
      fetchSpecies()
    }
  }, [isOpen])

  const fetchSpecies = async () => {
    const { data } = await treeService.getSpecies()
    setSpecies(data || [])
  }

  if (!isOpen) return null

  const handleCaptureGps = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude, alt: pos.coords.altitude || 0 }),
      (err) => alert('No se pudo obtener la ubicación: ' + err.message)
    )
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.target as HTMLFormElement)
      const lat = parseFloat(formData.get('lat') as string)
      const lng = parseFloat(formData.get('lng') as string)
      
      if (isNaN(lat) || isNaN(lng)) throw new Error('Coordenadas de localización son obligatorias')

      const parcelId = formData.get('parcelId') as string
      if (!parcelId) throw new Error('Seleccione una parcela')

      const speciesId = formData.get('speciesId') as string
      if (!speciesId) throw new Error('Seleccione una especie')

      const treeData = {
        parcel_id: parcelId,
        species_id: speciesId,
        location: `POINT(${lng} ${lat})`,
        elevation: gps?.alt || null,
        planted_at: formData.get('plantedAt') as string,
        initial_height: parseFloat(formData.get('initialHeight') as string) || null,
        initial_diameter: parseFloat(formData.get('initialDiameter') as string) || null,
        condition: formData.get('condition') as string,
        planting_method: formData.get('plantingMethod') as string,
        soil_condition: formData.get('soilCondition') as string,
        notes: formData.get('notes') as string,
      }

      // Placeholder for photo upload logic (simulated in service)
      const photoUrls = photos.map(p => `https://storage.placeholder.com/${p.name}`)

      const { error } = await treeService.createTree(treeData, photoUrls)

      if (error) throw error

      alert('Registro de árbol completado con éxito.')
      onSuccess()
      onClose()
    } catch (err: any) {
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-100">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-white/50 backdrop-blur-sm z-10">
          <div className="flex items-center space-x-4">
            <div className="bg-emerald-500 p-3 rounded-2xl shadow-lg shadow-emerald-100">
              <TreeDeciduous className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Registro de Individuo</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Forest Inventory Module</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-slate-50 rounded-full transition-colors group">
            <X className="h-6 w-6 text-slate-300 group-hover:text-slate-600" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
          {/* Classification */}
          <section className="space-y-6">
            <div className="flex items-center space-x-3 mb-1">
               <div className="h-1 w-1 bg-emerald-500 rounded-full" />
               <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Identificación y Parcela</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Parcela / Sitio</label>
                <select required name="parcelId" className="w-full h-12 bg-slate-50 rounded-xl px-4 text-sm font-bold text-slate-700 outline-none border border-transparent focus:border-emerald-500/20 focus:ring-2 focus:ring-emerald-500/10 transition-all">
                  <option value="">Seleccione parcerla...</option>
                  {parcels.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Especie</label>
                <select 
                  required 
                  name="speciesId" 
                  onChange={(e) => setSelectedSpecies(species.find(s => s.id === e.target.value) || null)}
                  className="w-full h-12 bg-slate-50 rounded-xl px-4 text-sm font-bold text-slate-700 outline-none border border-transparent focus:border-emerald-500/20 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                >
                  <option value="">Seleccione especie...</option>
                  {species.map(s => <option key={s.id} value={s.id}>{s.common_name}</option>)}
                </select>
              </div>

              <div className="col-span-1 md:col-span-2 bg-emerald-50/30 p-4 rounded-xl border border-emerald-100/50">
                 <div className="flex items-center justify-between">
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre Científico</p>
                       <p className="text-sm font-black text-emerald-900 italic">{selectedSpecies?.scientific_name || 'Pendiente'}</p>
                    </div>
                    <div className="text-right space-y-1">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Familia</p>
                       <p className="text-xs font-bold text-slate-600">{selectedSpecies?.family || 'N/A'}</p>
                    </div>
                 </div>
              </div>
            </div>
          </section>

          {/* Localization */}
          <section className="space-y-6">
            <div className="flex items-center justify-between mb-1">
               <div className="flex items-center space-x-3">
                  <div className="h-1 w-1 bg-blue-500 rounded-full" />
                  <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Georreferenciación</h4>
               </div>
               <button type="button" onClick={handleCaptureGps} className="flex items-center space-x-2 text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100">
                  <MapPin size={12} /> <span>Capturar Coordenadas</span>
               </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Latitud (Y)</label>
                <input required name="lat" type="number" step="any" value={gps?.lat || ''} onChange={e => setGps(g => ({...g!, lat: parseFloat(e.target.value)}))} placeholder="0.0000" className="w-full h-11 bg-slate-50 rounded-xl px-4 text-xs font-bold text-slate-700 outline-none border border-transparent focus:border-blue-500/20" />
              </div>
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Longitud (X)</label>
                <input required name="lng" type="number" step="any" value={gps?.lng || ''} onChange={e => setGps(g => ({...g!, lng: parseFloat(e.target.value)}))} placeholder="0.0000" className="w-full h-11 bg-slate-50 rounded-xl px-4 text-xs font-bold text-slate-700 outline-none border border-transparent focus:border-blue-500/20" />
              </div>
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Elevación (m)</label>
                <input name="elevation" type="number" value={gps?.alt || ''} onChange={e => setGps(g => ({...g!, alt: parseFloat(e.target.value)}))} className="w-full h-11 bg-slate-50 rounded-xl px-4 text-xs font-bold text-slate-700 outline-none border border-transparent" />
              </div>
            </div>
          </section>

          {/* Technical Specs */}
          <section className="space-y-6">
            <div className="flex items-center space-x-3 mb-1">
               <div className="h-1 w-1 bg-amber-500 rounded-full" />
               <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Datos de Siembra y Estado</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Fecha de Siembra</label>
                  <input required type="date" name="plantedAt" defaultValue={new Date().toISOString().split('T')[0]} className="w-full h-12 bg-slate-50 rounded-xl px-4 text-sm font-bold text-slate-700 outline-none" />
               </div>

               <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Método de Siembra</label>
                <select name="plantingMethod" className="w-full h-12 bg-slate-50 rounded-xl px-4 text-sm font-bold text-slate-700 outline-none">
                  <option value="manual">Manual</option>
                  <option value="assisted">Natural asistida</option>
                  <option value="direct_seeding">Siembra directa</option>
                  <option value="other">Otro</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Altura Inicial (cm)</label>
                    <input name="initialHeight" type="number" step="0.1" placeholder="0.0" className="w-full h-12 bg-slate-50 rounded-xl px-4 text-sm font-bold text-slate-700 outline-none" />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">DAP Inicial (mm)</label>
                    <input name="initialDiameter" type="number" step="0.1" placeholder="0.0" className="w-full h-12 bg-slate-50 rounded-xl px-4 text-sm font-bold text-slate-700 outline-none" />
                 </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Condición Inicial</label>
                <select required name="condition" className="w-full h-12 bg-slate-50 rounded-xl px-4 text-sm font-bold text-slate-700 outline-none">
                  <option value="healthy">Saludable (Vigoroso)</option>
                  <option value="stressed">Estresado (Decaimiento)</option>
                  <option value="dead">Muerto</option>
                </select>
              </div>
            </div>
          </section>

          {/* multimedia */}
          <section className="space-y-6">
            <div className="flex items-center space-x-3 mb-1">
               <div className="h-1 w-1 bg-purple-500 rounded-full" />
               <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Observaciones y Fotos</h4>
            </div>

            <div className="space-y-4">
              <div className="w-full relative group">
                <input 
                  type="file" 
                  multiple
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="w-full h-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center space-y-1 transition-all group-hover:bg-emerald-50 group-hover:border-emerald-200">
                  <Camera size={24} className="text-slate-300 group-hover:text-emerald-500" /> 
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-emerald-700">
                    {photos.length > 0 ? `${photos.length} fotos seleccionadas` : 'Subir fotos del terreno'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Calidad del Suelo / Notas</label>
                <textarea name="notes" rows={3} placeholder="Detallar microclima, tipo de suelo o riesgos detectados..." className="w-full bg-slate-50 rounded-xl p-4 text-sm font-bold text-slate-700 outline-none border border-transparent focus:border-emerald-500/20"></textarea>
              </div>
            </div>
          </section>

          <div className="pt-4">
             <button 
               disabled={loading} 
               type="submit" 
               className="w-full h-16 bg-slate-900 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-slate-200 hover:bg-black hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center overflow-hidden relative"
             >
               {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
               ) : (
                  <div className="flex items-center space-x-3">
                     <Save size={18} />
                     <span>Finalizar Registro</span>
                  </div>
               )}
             </button>
          </div>
        </form>
      </div>
    </div>
  )
}
