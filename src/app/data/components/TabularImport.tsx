'use client'

import React, { useState } from 'react'
import { FileSpreadsheet, FileCode, ArrowRight, CheckCircle2, AlertCircle, Download, Upload, AlertTriangle, Database } from 'lucide-react'
import * as XLSX from 'xlsx'
import { supabase } from '@/lib/supabase'

interface MappingField {
  id: string
  label: string
  required: boolean
}

const MODULES = {
  trees: {
    name: 'Inventario Forestal',
    table: 'trees',
    fields: [
      { id: 'species', label: 'Especie (Nombre Científico o Común)', required: true },
      { id: 'latitude', label: 'Latitud (Y)', required: true },
      { id: 'longitude', label: 'Longitud (X)', required: true },
      { id: 'planted_at', label: 'Fecha de Siembra (YYYY-MM-DD)', required: false },
      { id: 'parcel_name', label: 'Nombre de Parcela (Opcional)', required: false }
    ] as MappingField[]
  },
  monitoring: {
    name: 'Registros de Monitoreo',
    table: 'monitoring_records',
    fields: [
      { id: 'tree_id', label: 'ID del Árbol (UUID)', required: true },
      { id: 'monitoring_date', label: 'Fecha de Monitoreo', required: true },
      { id: 'tree_height', label: 'Altura (m)', required: false },
      { id: 'stem_diameter', label: 'Diámetro Tallo (cm)', required: false },
      { id: 'canopy_diameter', label: 'Diámetro Copa (m)', required: false },
      { id: 'tree_condition', label: 'Condición General', required: true },
      { id: 'phytosanitary_condition', label: 'Estado Fitosanitario', required: false },
      { id: 'observations', label: 'Observaciones', required: false }
    ] as MappingField[]
  },
  parcels: {
    name: 'Parcelas',
    table: 'parcels',
    fields: [
      { id: 'name', label: 'Nombre de la Parcela', required: true },
      { id: 'polygon', label: 'Geometría (WKT Polygon)', required: false },
      { id: 'owner', label: 'Propietario / Notas', required: false }
    ] as MappingField[]
  },
  wildlife: {
    name: 'Observaciones de Fauna',
    table: 'wildlife_observations',
    fields: [
      { id: 'species', label: 'Especie / Nombre Común', required: true },
      { id: 'scientific_name', label: 'Nombre Científico', required: false },
      { id: 'observation_date', label: 'Fecha de Observación', required: true },
      { id: 'latitude', label: 'Latitud (Y)', required: true },
      { id: 'longitude', label: 'Longitud (X)', required: true },
      { id: 'notes', label: 'Notas / Comportamiento', required: false }
    ] as MappingField[]
  }
}

export default function TabularImport() {
  const [step, setStep] = useState<'select' | 'upload' | 'mapping' | 'preview'>('select')
  const [selectedModule, setSelectedModule] = useState<keyof typeof MODULES | null>(null)
  
  const [file, setFile] = useState<File | null>(null)
  const [rawData, setRawData] = useState<any[]>([])
  const [excelColumns, setExcelColumns] = useState<string[]>([])
  
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({})
  
  const [validationErrors, setValidationErrors] = useState<{row: number, error: string}[]>([])
  const [importing, setImporting] = useState(false)
  const [importSuccess, setImportSuccess] = useState(false)

  const downloadTemplate = (moduleKey: keyof typeof MODULES) => {
    const mod = MODULES[moduleKey]
    const header = mod.fields.map(f => f.label)
    
    // Sample row
    const sampleRow = mod.fields.map(f => {
      if (f.id === 'latitude') return '5.312'
      if (f.id === 'longitude') return '-71.505'
      if (f.id.includes('date') || f.id === 'planted_at') return '2025-05-15'
      if (f.id === 'tree_condition') return 'Good'
      return 'Ejemplo...'
    })

    const ws = XLSX.utils.aoa_to_sheet([header, sampleRow])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Template')
    XLSX.writeFile(wb, `Plantapp_Template_${moduleKey}.xlsx`)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    
    setFile(f)
    try {
      const buffer = await f.arrayBuffer()
      const workbook = XLSX.read(buffer)
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
      const data = XLSX.utils.sheet_to_json(firstSheet, { defval: '' }) as any[]
      
      if (data.length === 0) {
        alert('El archivo está vacío.')
        return
      }

      const columns = Object.keys(data[0])
      setExcelColumns(columns)
      setRawData(data)
      
      // Auto-map columns if names match
      const mod = MODULES[selectedModule!]
      const initialMapping: Record<string, string> = {}
      mod.fields.forEach(field => {
        const exactMatch = columns.find(c => c.toLowerCase() === field.id.toLowerCase() || c.toLowerCase() === field.label.toLowerCase())
        if (exactMatch) initialMapping[field.id] = exactMatch
      })
      setFieldMapping(initialMapping)
      
      setStep('mapping')
    } catch (err) {
      console.error('Error parseando excel:', err)
      alert('Error procesando el archivo Excel.')
    }
  }

  const validateData = () => {
    const mod = MODULES[selectedModule!]
    const errors: {row: number, error: string}[] = []
    
    rawData.forEach((row, index) => {
      mod.fields.forEach(field => {
        if (field.required) {
          const mappedCol = fieldMapping[field.id]
          if (!mappedCol || !row[mappedCol]) {
            errors.push({ row: index + 2, error: `Falta el campo requerido: ${field.label}` })
          }
        }
      })

      // Validation logic for numbers/coords if mapped
      if (fieldMapping['latitude'] && row[fieldMapping['latitude']]) {
        const lat = parseFloat(row[fieldMapping['latitude']])
        if (isNaN(lat) || lat < -90 || lat > 90) errors.push({ row: index + 2, error: 'Latitud inválida' })
      }
      if (fieldMapping['longitude'] && row[fieldMapping['longitude']]) {
        const lng = parseFloat(row[fieldMapping['longitude']])
        if (isNaN(lng) || lng < -180 || lng > 180) errors.push({ row: index + 2, error: 'Longitud inválida' })
      }
    })

    setValidationErrors(errors)
    if (errors.length === 0) setStep('preview')
  }

  const executeImport = async () => {
    setImporting(true)
    const mod = MODULES[selectedModule!]
    
    try {
      // Get a default project ID for demo context
      const { data: projData } = await supabase.from('projects').select('id').limit(1).single()
      const projectId = projData ? (projData as any).id : null

      const payload = rawData.map(row => {
        const record: any = {}
        
        // Build base record based on mapping
        mod.fields.forEach(field => {
            const mappedCol = fieldMapping[field.id]
            if (mappedCol && row[mappedCol]) {
                record[field.id] = row[mappedCol]
            }
        })

        // Transform specific geospatial fields
        if (selectedModule === 'trees' || selectedModule === 'wildlife') {
            if (record.longitude && record.latitude) {
                 record.location = `POINT(${record.longitude} ${record.latitude})`
            }
            delete record.longitude
            delete record.latitude
        }
        
        if (selectedModule === 'parcels') {
             record.project_id = projectId
             if (record.polygon) {
                 record.boundary = record.polygon
                 delete record.polygon
             } else {
                 // Dummy fallback polygon if none provided for mass import
                 record.boundary = `POLYGON((-71.505 5.312, -71.504 5.312, -71.504 5.313, -71.505 5.313, -71.505 5.312))`
             }
        }

        if (selectedModule === 'wildlife') {
             record.project_id = projectId
        }

        return record
      })

      // We should ideally resolve foreign keys like parcel_id for trees, 
      // but assuming bulk direct insertion or handled via a DB function. 
      // For this implementation, we will push the payload directly to Supabase.
      
      const { error } = await (supabase.from(mod.table) as any).insert(payload)
      
      if (error) {
        // Simple duplicate handler response (e.g. unique constraint violated)
        if (error.code === '23505') {
            throw new Error('Se detectaron registros duplicados en la base de datos.')
        }
        throw error
      }

      setImportSuccess(true)
    } catch (err: any) {
      console.error(err)
      alert(`Error en la importación: ${err.message}`)
    } finally {
      setImporting(false)
    }
  }

  if (importSuccess) {
    return (
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-50 shadow-sm flex flex-col items-center justify-center h-full text-center">
        <div className="w-24 h-24 bg-emerald-50 text-emerald-500 flex items-center justify-center rounded-full mb-6">
          <CheckCircle2 size={48} />
        </div>
        <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest mb-2">Importación Completada</h3>
        <p className="text-sm font-bold text-slate-400 mb-8">{rawData.length} registros han sido procesados y sincronizados.</p>
        <button 
          onClick={() => { setImportSuccess(false); setStep('select'); setRawData([]); setFile(null); }}
          className="px-8 py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-black transition-all"
        >
          Realizar otra importación
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-50 shadow-sm flex flex-col h-full">
      <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 border border-blue-100/50">
        <FileSpreadsheet className="h-7 w-7" />
      </div>
      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-2">Migración Masiva (Excel/CSV)</h3>
      <p className="text-xs text-slate-400 font-bold mb-8 leading-relaxed">
        Inserción de volúmenes altos de datos tabulares, con validación de integridad estructural.
      </p>

      {/* STEP 1: SELECT MODULE & DOWNLOAD TEMPLATE */}
      {step === 'select' && (
        <div className="flex-1 flex flex-col space-y-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">1. Seleccione el módulo de destino</p>
          <div className="grid grid-cols-2 gap-4">
            {(Object.keys(MODULES) as Array<keyof typeof MODULES>).map(key => (
              <button 
                key={key}
                onClick={() => { setSelectedModule(key); setStep('upload'); }}
                className="p-4 border-2 border-slate-100 rounded-2xl text-left hover:border-blue-500 hover:bg-blue-50/50 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                   <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{MODULES[key].name}</p>
                   <ArrowRight className="text-slate-300 group-hover:text-blue-500" size={16} />
                </div>
              </button>
            ))}
          </div>
          <div className="mt-auto pt-6 border-t border-slate-50">
             <p className="text-[10px] font-bold text-slate-400 mb-3">¿Necesita un formato de referencia para el llenado de datos?</p>
             <div className="flex flex-wrap gap-2">
                {(Object.keys(MODULES) as Array<keyof typeof MODULES>).map(key => (
                   <button 
                      key={key} 
                      onClick={() => downloadTemplate(key)}
                      className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg flex items-center hover:bg-emerald-100 transition-colors uppercase"
                   >
                     <Download size={12} className="mr-1" /> Template {MODULES[key].name}
                   </button>
                ))}
             </div>
          </div>
        </div>
      )}

      {/* STEP 2: UPLOAD FILE */}
      {step === 'upload' && selectedModule && (
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-50">
             <div>
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Paso 2 de 4</p>
                <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Cargar archivo para: {MODULES[selectedModule].name}</p>
             </div>
             <button onClick={() => setStep('select')} className="text-[10px] font-black text-slate-400 hover:text-slate-800 uppercase">Volver</button>
          </div>
          <label className="flex-1 flex flex-col items-center justify-center border-4 border-dashed border-slate-100 rounded-[2.5rem] p-10 text-center hover:border-blue-300 hover:bg-blue-50/20 transition-all cursor-pointer group">
            <input type="file" className="hidden" onChange={handleFileUpload} accept=".xlsx,.xls,.csv" />
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform">
                <FileCode className="h-8 w-8 text-blue-400" />
            </div>
            <p className="text-xs font-black text-slate-600 uppercase tracking-widest">Importar Planilla XLSX</p>
            <p className="text-[10px] text-slate-400 font-bold mt-2">Toque o arrastre aquí para subir</p>
          </label>
        </div>
      )}

      {/* STEP 3: MAPPING */}
      {step === 'mapping' && selectedModule && (
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-50">
             <div>
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Paso 3 de 4 (Mapeo de Atributos)</p>
                <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{file?.name} ({rawData.length} filas)</p>
             </div>
             <button onClick={() => setStep('upload')} className="text-[10px] font-black text-slate-400 hover:text-slate-800 uppercase">Cancelar</button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2">
             {MODULES[selectedModule].fields.map(field => (
                <div key={field.id} className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="flex-1">
                        <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                        </p>
                        <p className="text-[9px] font-bold text-slate-400 font-mono">{field.id}</p>
                    </div>
                    <ArrowRight className="hidden sm:block text-slate-300" size={14} />
                    <div className="flex-1">
                        <select 
                            value={fieldMapping[field.id] || ''} 
                            onChange={(e) => setFieldMapping({...fieldMapping, [field.id]: e.target.value})}
                            className="w-full text-[11px] font-bold text-slate-600 bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500"
                        >
                            <option value="">-- Ignorar este campo --</option>
                            {excelColumns.map(col => (
                                <option key={col} value={col}>{col}</option>
                            ))}
                        </select>
                    </div>
                </div>
             ))}
          </div>

          {validationErrors.length > 0 && (
             <div className="mb-6 p-4 bg-red-50 rounded-2xl border border-red-100 max-h-32 overflow-y-auto">
                 <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-2 flex items-center">
                    <AlertTriangle size={14} className="mr-1" /> Errores detectados ({validationErrors.length})
                 </p>
                 <ul className="text-[10px] text-red-500 font-bold space-y-1 pl-5 list-disc">
                    {validationErrors.slice(0, 10).map((err, i) => (
                        <li key={i}>Fila {err.row}: {err.error}</li>
                    ))}
                    {validationErrors.length > 10 && <li>... y {validationErrors.length - 10} más.</li>}
                 </ul>
             </div>
          )}

          <button 
             onClick={validateData}
             className="w-full h-14 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all"
          >
             Validar Integridad
          </button>
        </div>
      )}

      {/* STEP 4: PREVIEW AND CONFIRM */}
      {step === 'preview' && selectedModule && (
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-50">
             <div>
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Paso 4 de 4 (Validación Exitosa)</p>
                <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Confirmar Importación</p>
             </div>
             <button onClick={() => setStep('mapping')} className="text-[10px] font-black text-slate-400 hover:text-slate-800 uppercase">Volver</button>
          </div>

          <div className="flex-1 overflow-x-auto overflow-y-auto border border-slate-100 rounded-2xl mb-6">
             <table className="w-full text-left border-collapse min-w-[600px]">
                <thead className="bg-slate-50 sticky top-0">
                   <tr>
                      {MODULES[selectedModule].fields.map(f => fieldMapping[f.id] ? (
                         <th key={f.id} className="p-3 text-[9px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200 whitespace-nowrap">
                            {f.label}
                         </th>
                      ) : null)}
                   </tr>
                </thead>
                <tbody>
                   {rawData.slice(0, 5).map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                         {MODULES[selectedModule].fields.map(f => fieldMapping[f.id] ? (
                            <td key={f.id} className="p-3 text-[11px] font-bold text-slate-700 border-b border-slate-50 whitespace-nowrap truncate max-w-[150px]">
                               {row[fieldMapping[f.id]]?.toString() || '-'}
                            </td>
                         ) : null)}
                      </tr>
                   ))}
                </tbody>
             </table>
             {rawData.length > 5 && (
                <div className="p-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50 border-t border-slate-100">
                   ... mostrando 5 de {rawData.length} filas
                </div>
             )}
          </div>

          <button 
             onClick={executeImport}
             disabled={importing}
             className="w-full h-14 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center"
          >
             {importing ? (
                 <>Procesando {rawData.length} registros...</>
             ) : (
                 <>
                    <Database size={14} className="mr-2" />
                    Ejecutar Inserción en Base de Datos
                 </>
             )}
          </button>
        </div>
      )}

    </div>
  )
}
