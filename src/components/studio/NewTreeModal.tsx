'use client'

import React, { useState } from 'react'
import { X, MapPin, Camera, Save, TreeDeciduous } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface NewTreeModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  parcels: any[]
}

export function NewTreeModal({ isOpen, onClose, onSuccess, parcels }: NewTreeModalProps) {
  const [loading, setLoading] = useState(false)
  const [gps, setGps] = useState<{lat: number, lng: number, alt: number} | null>(null)
  const [photo, setPhoto] = useState<File | null>(null)

  if (!isOpen) return null

  const handleCaptureGps = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude, alt: pos.coords.altitude || 0 }),
      (err) => alert('No se pudo obtener la ubicación: ' + err.message)
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.target as HTMLFormElement)
      const lat = parseFloat(formData.get('lat') as string)
      const lng = parseFloat(formData.get('lng') as string)
      
      if (isNaN(lat) || isNaN(lng)) throw new Error('Coordenadas inválidas')

      const parcelId = formData.get('parcelId') as string
      if (!parcelId) throw new Error('Seleccione una parcela')

      // 1. Crear el Árbol
      const { data: treeData, error: treeError } = await (supabase.from('trees') as any).insert({
        parcel_id: parcelId,
        location: `POINT(${lng} ${lat})`,
        planted_at: formData.get('plantedAt') as string,
        // Hack para demo: Guardaremos el nombre científico en observations del monitoreo o si tenemos un campo extendido.
      }).select().single()

      if (treeError) throw treeError

      // 2. Crear el Registro de Monitoreo Inicial
      let photoUrl = ''
      if (photo) {
        // En un entorno real se subiría a Supabase Storage:
        // const { data: fileData } = await supabase.storage.from('photos').upload(...)
        photoUrl = photo.name // Simulado
      }

      const { error: monError } = await (supabase.from('monitoring_records') as any).insert({
        tree_id: treeData.id,
        monitoring_date: new Date().toISOString(),
        observations: `Nombre Científico: ${formData.get('scientificName')}\n\nObservaciones: ${formData.get('observations')}`,
        photos: photoUrl ? [photoUrl] : [],
        tree_condition: 'Good'
      })

      if (monError) throw monError

      alert('Registro guardado exitosamente.')
      onSuccess()
      onClose()
    } catch (err: any) {
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white/80 backdrop-blur-md px-8 py-6 border-b border-slate-50 flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-50 p-2.5 rounded-xl">
              <TreeDeciduous className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Nuevo Registro</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Inventario Forestal</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <X className="h-6 w-6 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Parcela</label>
              <select required name="parcelId" className="w-full h-12 bg-slate-50 rounded-xl px-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20">
                <option value="">Seleccione una Parcela</option>
                {parcels.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nombre Científico</label>
              <input required type="text" name="scientificName" placeholder="Ej: Vochysia lehmannii" className="w-full h-12 bg-slate-50 rounded-xl px-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20" />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Fecha de Siembra</label>
              <input required type="date" name="plantedAt" defaultValue={new Date().toISOString().split('T')[0]} className="w-full h-12 bg-slate-50 rounded-xl px-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20" />
            </div>

            <div className="col-span-2 bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Localización GPS</label>
                <button type="button" onClick={handleCaptureGps} className="flex items-center space-x-2 text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                  <MapPin size={14} /> <span>Capturar Actual</span>
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Latitud</label>
                  <input required name="lat" type="number" step="any" value={gps?.lat || ''} onChange={e => setGps(g => ({...g!, lat: parseFloat(e.target.value)}))} placeholder="0.0000" className="w-full h-10 bg-white rounded-xl px-3 text-xs font-bold text-slate-700 outline-none border border-slate-100" />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Longitud</label>
                  <input required name="lng" type="number" step="any" value={gps?.lng || ''} onChange={e => setGps(g => ({...g!, lng: parseFloat(e.target.value)}))} placeholder="0.0000" className="w-full h-10 bg-white rounded-xl px-3 text-xs font-bold text-slate-700 outline-none border border-slate-100" />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Elevación (m)</label>
                  <input name="elevation" type="number" step="any" value={gps?.alt || ''} onChange={e => setGps(g => ({...g!, alt: parseFloat(e.target.value)}))} placeholder="0m" className="w-full h-10 bg-white rounded-xl px-3 text-xs font-bold text-slate-700 outline-none border border-slate-100" />
                </div>
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Evidencia Fotográfica</label>
              <div className="w-full relative">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-full h-14 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center space-x-2 font-black text-xs uppercase tracking-widest">
                  <Camera size={16} /> 
                  <span>{photo ? photo.name : 'Subir Fotografía'}</span>
                </div>
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Observaciones Iniciales</label>
              <textarea name="observations" rows={3} placeholder="Condición del suelo, clima, etc..." className="w-full bg-slate-50 rounded-xl p-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20"></textarea>
            </div>
          </div>

          <button disabled={loading} type="submit" className="w-full h-14 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl hover:bg-black hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center">
            {loading ? 'Guardando...' : (
              <><Save className="mr-2 h-5 w-5" /> Confirmar Registro</>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
