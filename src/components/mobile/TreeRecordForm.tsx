'use client'

import React, { useState, useEffect } from 'react'
import { MapPin, Camera, Save, TreeDeciduous, User, HardDrive, Map as MapIcon } from 'lucide-react'
import { db } from '@/lib/db'
import Link from 'next/link'
import { SimpleMap } from '@/components/map'

export function TreeRecordForm() {
  const [gps, setGps] = useState<{lat: number, lng: number, alt: number} | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('picked_coords')
    if (saved) {
      const parsed = JSON.parse(saved)
      setGps({ lat: parsed.lat, lng: parsed.lng, alt: 0 })
      localStorage.removeItem('picked_coords')
    }
  }, [])

  const captureGps = () => {
    setLoading(true)
    navigator.geolocation.getCurrentPosition((pos) => {
      setGps({ 
        lat: pos.coords.latitude, 
        lng: pos.coords.longitude,
        alt: pos.coords.altitude || 0
      })
      setLoading(false)
    }, () => setLoading(false))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!gps) return alert('Capture GPS first')
    
    const formData = new FormData(e.target as HTMLFormElement)
    
    await db.trees.add({
      parcel_id: formData.get('parcel') as string,
      species_id: formData.get('species') as string,
      latitude: gps.lat,
      longitude: gps.lng,
      elevation: gps.alt,
      seedling_source: formData.get('source') as string,
      responsible_person: formData.get('responsible') as string,
      planted_at: new Date().toISOString(),
      status: 'pending',
      createdAt: Date.now()
    })

    alert('Registro guardado localmente (Offline)')
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-emerald-50 p-3 rounded-2xl">
          <TreeDeciduous className="h-6 w-6 text-emerald-600" />
        </div>
        <h3 className="text-xl font-black text-slate-800">Registro de Árbol</h3>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Parcela de Destino</label>
          <select name="parcel" className="w-full h-14 rounded-2xl border border-slate-100 px-5 font-bold text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none bg-slate-50 transition-all">
            <option>Parcela A1 (Rastrojo)</option>
            <option>Parcela B2 (Bosque Galeria)</option>
          </select>
        </div>

        <div>
           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Especie Forestal</label>
           <select name="species" className="w-full h-14 rounded-2xl border border-slate-100 px-5 font-bold text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none bg-slate-50 transition-all">
             <option>Saladillo (Vochysia lehmannii)</option>
             <option>Alcornoque (Curatella americana)</option>
             <option>Guaímaro (Brosimum alicastrum)</option>
           </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Origen (Suministro)</label>
              <input name="source" type="text" placeholder="Vivero / Rescate" className="w-full h-14 rounded-2xl border border-slate-100 px-5 font-bold text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none bg-slate-50 transition-all" />
           </div>
           <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Responsable</label>
              <input name="responsible" type="text" placeholder="Nombre" className="w-full h-14 rounded-2xl border border-slate-100 px-5 font-bold text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none bg-slate-50 transition-all" />
           </div>
        </div>

        <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
            <div className="flex justify-between items-center">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Localización Espacial</span>
               <div className="flex space-x-2">
                  <Link 
                    href="/field/map"
                    className="bg-white px-4 py-2 rounded-xl text-[10px] font-black text-blue-600 uppercase border border-blue-100 shadow-sm active:scale-95 transition-all flex items-center"
                  >
                     <MapIcon size={12} className="mr-1" /> Mapa
                  </Link>
                  <button 
                    type="button" 
                    onClick={captureGps}
                    className="bg-white px-4 py-2 rounded-xl text-[10px] font-black text-emerald-600 uppercase border border-emerald-100 shadow-sm active:scale-95 transition-all flex items-center"
                  >
                     <MapPin size={12} className="mr-1" /> {gps ? 'Refresh' : 'GPS'}
                  </button>
               </div>
            </div>
           
           <div className="grid grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-2xl border border-slate-100">
                 <p className="text-[8px] font-black text-slate-300 uppercase mb-1">Lat</p>
                 <p className="text-xs font-black text-slate-600 truncate">{gps?.lat.toFixed(6) || '0.00'}</p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-slate-100">
                 <p className="text-[8px] font-black text-slate-300 uppercase mb-1">Lng</p>
                 <p className="text-xs font-black text-slate-600 truncate">{gps?.lng.toFixed(6) || '0.00'}</p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-slate-100">
                 <p className="text-[8px] font-black text-slate-300 uppercase mb-1">Alt</p>
                 <p className="text-xs font-black text-slate-600 truncate">{gps?.alt || 0}m</p>
              </div>
           </div>

           {gps && (
              <div className="rounded-[1.5rem] overflow-hidden border border-slate-100 shadow-inner animate-in zoom-in duration-500">
                 <SimpleMap 
                    points={[{ lat: gps.lat, lng: gps.lng, label: 'Ubicación' }]}
                    center={[gps.lat, gps.lng]}
                    zoom={18}
                    height="120px"
                    interactive={false}
                 />
              </div>
           )}

           <button type="button" className="w-full h-12 flex items-center justify-center bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-emerald-500 transition-colors">
              <Camera size={20} className="mr-2" />
              <span className="text-[10px] font-black uppercase">Foto de Referencia</span>
           </button>
        </div>
      </div>

      <button 
        type="submit"
        className="w-full flex items-center justify-center h-16 rounded-[2rem] bg-emerald-600 text-white font-black uppercase tracking-[0.2em] text-sm hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 active:scale-95"
      >
        <Save className="mr-3 h-6 w-6" />
        Guardar Registro
      </button>
    </form>
  )
}
