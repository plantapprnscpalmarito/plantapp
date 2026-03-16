'use client'

import React, { useState } from 'react'
import { Activity, Calendar, Save, User, Settings, Droplets } from 'lucide-react'
import { db } from '@/lib/db'

export function ActivityForm() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    parcel_id: '',
    activity_type: 'Weeding',
    responsible_person: '',
    inputs_used: '',
    observations: '',
  })

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await db.activities.add({
        ...formData,
        activity_date: new Date().toISOString(),
        status: 'pending',
        createdAt: Date.now()
      })
      alert('Actividad de campo guardada')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-amber-50 p-3 rounded-2xl">
          <Activity className="h-6 w-6 text-amber-600" />
        </div>
        <h3 className="text-xl font-black text-slate-800">Actividades de Campo</h3>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Parcela Intervenida</label>
          <select 
            className="w-full h-14 rounded-2xl border border-slate-100 px-5 font-bold text-sm bg-slate-50 outline-none"
            value={formData.parcel_id}
            onChange={(e) => setFormData({...formData, parcel_id: e.target.value})}
          >
            <option value="">Seleccione Parcela...</option>
            <option value="p1">Parcela A1</option>
            <option value="p2">Parcela B2</option>
          </select>
        </div>

        <div>
           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Tipo de Actividad</label>
           <select 
             className="w-full h-14 rounded-2xl border border-slate-100 px-5 font-bold text-sm bg-slate-50 outline-none"
             value={formData.activity_type}
             onChange={(e) => setFormData({...formData, activity_type: e.target.value})}
           >
             <option>Control de Malezas (Deshierbe)</option>
             <option>Fertilización</option>
             <option>Riego</option>
             <option>Poda</option>
             <option>Resiembra</option>
             <option>Protección contra herbívoros</option>
           </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Responsable</label>
              <input 
                type="text" 
                placeholder="Nombre" 
                className="w-full h-14 rounded-2xl border border-slate-100 px-5 font-bold text-sm bg-slate-50 outline-none" 
                value={formData.responsible_person}
                onChange={(e) => setFormData({...formData, responsible_person: e.target.value})}
              />
           </div>
           <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Insumos Usados</label>
              <input 
                type="text" 
                placeholder="Ej: Fertilizante X" 
                className="w-full h-14 rounded-2xl border border-slate-100 px-5 font-bold text-sm bg-slate-50 outline-none" 
                value={formData.inputs_used}
                onChange={(e) => setFormData({...formData, inputs_used: e.target.value})}
              />
           </div>
        </div>

        <div>
           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Observaciones</label>
           <textarea 
             placeholder="Notas adicionales..." 
             className="w-full h-24 rounded-2xl border border-slate-100 p-5 font-bold text-sm bg-slate-50 outline-none resize-none" 
             value={formData.observations}
             onChange={(e) => setFormData({...formData, observations: e.target.value})}
           />
        </div>
      </div>

      <button 
        type="submit"
        className="w-full flex items-center justify-center h-16 rounded-[2rem] bg-amber-600 text-white font-black uppercase tracking-[0.2em] text-sm hover:bg-amber-700 transition-all shadow-xl shadow-amber-100 active:scale-95"
      >
        <Save className="mr-3 h-6 w-6" />
        Guardar Actividad
      </button>
    </form>
  )
}
