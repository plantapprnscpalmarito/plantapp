'use client'

import React, { useState } from 'react'
import { Bird, Camera, MapPin, Save, User, BookOpen, Fingerprint } from 'lucide-react'
import { db } from '@/lib/db'

export function WildlifeForm() {
  const [loading, setLoading] = useState(false)
  const [gps, setGps] = useState<{lat: number, lng: number} | null>(null)
  const [formData, setFormData] = useState({
    parcel_id: '',
    project_id: 'default',
    species: '',
    scientific_name: '',
    taxonomic_group: 'Mammals',
    behavior: '',
    habitat_type: '',
    responsible_person: '',
    notes: '',
  })

  const captureGPS = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude })
    })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!gps) return alert('Capture GPS first')
    setLoading(true)
    try {
      await db.wildlife.add({
        ...formData,
        observation_date: new Date().toISOString(),
        latitude: gps.lat,
        longitude: gps.lng,
        photo_record: null,
        status: 'pending',
        createdAt: Date.now()
      })
      alert('Observación de fauna guardada')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-teal-50 p-3 rounded-2xl">
          <Bird className="h-6 w-6 text-teal-600" />
        </div>
        <h3 className="text-xl font-black text-slate-800">Vida Silvestre</h3>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Especie Observada</label>
          <input 
            type="text" 
            placeholder="Nombre común (ej: Venado, Jaguar)" 
            className="w-full h-14 rounded-2xl border border-slate-100 px-5 font-bold text-sm bg-slate-50 outline-none" 
            value={formData.species}
            onChange={(e) => setFormData({...formData, species: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Grupo Taxonómico</label>
              <select 
                className="w-full h-14 rounded-2xl border border-slate-100 px-5 font-bold text-[10px] bg-slate-50 outline-none"
                value={formData.taxonomic_group}
                onChange={(e) => setFormData({...formData, taxonomic_group: e.target.value})}
              >
                <option>Mamíferos</option>
                <option>Aves</option>
                <option>Reptiles</option>
                <option>Anfibios</option>
                <option>Insectos</option>
              </select>
           </div>
           <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Estado de Hábitat</label>
              <input 
                type="text" 
                placeholder="Ej: Bosque Denso" 
                className="w-full h-14 rounded-2xl border border-slate-100 px-5 font-bold text-sm bg-slate-50 outline-none" 
                value={formData.habitat_type}
                onChange={(e) => setFormData({...formData, habitat_type: e.target.value})}
              />
           </div>
        </div>

        <div>
           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Comportamiento / Notas</label>
           <textarea 
             placeholder="Describa lo observado..." 
             className="w-full h-24 rounded-2xl border border-slate-100 p-5 font-bold text-sm bg-slate-50 outline-none resize-none" 
             value={formData.notes}
             onChange={(e) => setFormData({...formData, notes: e.target.value})}
           />
        </div>

        <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
           <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Punto de Avistamiento</span>
              <button 
                type="button" 
                onClick={captureGPS}
                className="bg-white px-4 py-2 rounded-xl text-[10px] font-black text-teal-600 uppercase border border-teal-100 shadow-sm transition-all active:scale-95"
              >
                 <MapPin size={12} className="inline mr-1" /> {gps ? 'Actualizar' : 'Capturar GPS'}
              </button>
           </div>
           
           {gps && (
             <div className="flex gap-2">
                <div className="flex-1 bg-white p-3 rounded-2xl border border-slate-100">
                   <p className="text-[8px] font-black text-slate-300 uppercase mb-1">Latitud</p>
                   <p className="text-xs font-black text-slate-600 truncate">{gps.lat.toFixed(6)}</p>
                </div>
                <div className="flex-1 bg-white p-3 rounded-2xl border border-slate-100">
                   <p className="text-[8px] font-black text-slate-300 uppercase mb-1">Longitud</p>
                   <p className="text-xs font-black text-slate-600 truncate">{gps.lng.toFixed(6)}</p>
                </div>
             </div>
           )}

           <button type="button" className="w-full h-12 flex items-center justify-center bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-teal-600 transition-colors">
              <Fingerprint size={20} className="mr-2" />
              <span className="text-[10px] font-black uppercase">Evidencia Fotográfica</span>
           </button>
        </div>
      </div>

      <button 
        type="submit"
        className="w-full flex items-center justify-center h-16 rounded-[2rem] bg-teal-600 text-white font-black uppercase tracking-[0.2em] text-sm hover:bg-teal-700 transition-all shadow-xl shadow-teal-100 active:scale-95"
      >
        <Save className="mr-3 h-6 w-6" />
        Guardar Registro
      </button>
    </form>
  )
}
