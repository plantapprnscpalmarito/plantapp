'use client'

import React, { useState } from 'react'
import { Microscope, Camera, Save, Thermometer, User, Ruler, Activity } from 'lucide-react'
import { db } from '@/lib/db'

export function MonitoringForm() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    tree_id: '',
    height: 0,
    stem_diameter: 0,
    canopy_diameter: 0,
    condition: 'Excellent' as const,
    phytosanitary: '',
    responsible_person: '',
    observations: '',
  })

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await db.monitoring.add({
        ...formData,
        date: new Date().toISOString(),
        photos: [],
        status: 'pending',
        createdAt: Date.now()
      })
      alert('Monitoreo guardado localmente')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-blue-50 p-3 rounded-2xl">
          <Microscope className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-xl font-black text-slate-800">Monitoreo de Árbol</h3>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Seleccionar Árbol ID</label>
          <input 
            type="text" 
            placeholder="Ej: PLM-001" 
            className="w-full h-14 rounded-2xl border border-slate-100 px-5 font-bold text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
            value={formData.tree_id}
            onChange={(e) => setFormData({...formData, tree_id: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Altura (m)</label>
              <div className="relative">
                 <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                 <input 
                   type="number" 
                   step="0.1" 
                   placeholder="0.0" 
                   className="w-full h-14 rounded-2xl border border-slate-100 pl-10 pr-4 font-bold text-sm bg-slate-50 outline-none" 
                   onChange={(e) => setFormData({...formData, height: parseFloat(e.target.value)})}
                 />
              </div>
           </div>
           <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">DAP (cm)</label>
              <input 
                type="number" 
                step="0.1" 
                placeholder="0.0" 
                className="w-full h-14 rounded-2xl border border-slate-100 px-5 font-bold text-sm bg-slate-50 outline-none" 
                onChange={(e) => setFormData({...formData, stem_diameter: parseFloat(e.target.value)})}
              />
           </div>
        </div>

        <div>
           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Estado General</label>
           <div className="grid grid-cols-3 gap-2">
              {['Excellent', 'Good', 'Fair', 'Poor', 'Dead'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFormData({...formData, condition: c as any})}
                  className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-tight border transition-all ${formData.condition === c ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white border-slate-100 text-slate-400'}`}
                >
                  {c}
                </button>
              ))}
           </div>
        </div>

        <div>
           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Sanidad Forestal</label>
           <input 
             type="text" 
             placeholder="Hongos, manchas, insectos..." 
             className="w-full h-14 rounded-2xl border border-slate-100 px-5 font-bold text-sm bg-slate-50 outline-none" 
             value={formData.phytosanitary}
             onChange={(e) => setFormData({...formData, phytosanitary: e.target.value})}
           />
        </div>

        <div>
           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Responsable</label>
           <input 
             type="text" 
             placeholder="Nombre del técnico" 
             className="w-full h-14 rounded-2xl border border-slate-100 px-5 font-bold text-sm bg-slate-50 outline-none" 
             value={formData.responsible_person}
             onChange={(e) => setFormData({...formData, responsible_person: e.target.value})}
           />
        </div>

        <button type="button" className="w-full h-14 flex items-center justify-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-blue-500 transition-colors">
           <Camera size={20} className="mr-2" />
           <span className="text-[10px] font-black uppercase">Capturar Fotos</span>
        </button>
      </div>

      <button 
        type="submit"
        className="w-full flex items-center justify-center h-16 rounded-[2rem] bg-blue-600 text-white font-black uppercase tracking-[0.2em] text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95"
      >
        <Save className="mr-3 h-6 w-6" />
        Guardar Monitoreo
      </button>
    </form>
  )
}
