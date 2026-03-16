'use client'

import React, { useState } from 'react'
import { Bug, Camera, Save, AlertTriangle, ShieldCheck, Thermometer } from 'lucide-react'
import { db } from '@/lib/db'

export function PestsForm() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    tree_id: '',
    agent_name: '',
    severity: 'Medium',
    observations: '',
    action_taken: '',
  })

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await db.pests.add({
        ...formData,
        event_date: new Date().toISOString(),
        photo: null,
        status: 'pending',
        createdAt: Date.now()
      })
      alert('Reporte de plaga guardado')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-red-50 p-3 rounded-2xl">
          <Bug className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-xl font-black text-slate-800">Plagas y Sanidad</h3>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Árbol Afectado (ID)</label>
          <input 
            type="text" 
            placeholder="Ej: PLM-042" 
            className="w-full h-14 rounded-2xl border border-slate-100 px-5 font-bold text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" 
            value={formData.tree_id}
            onChange={(e) => setFormData({...formData, tree_id: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Agente / Enfermedad</label>
          <input 
            type="text" 
            placeholder="Nombre del patógeno o plaga" 
            className="w-full h-14 rounded-2xl border border-slate-100 px-5 font-bold text-sm bg-slate-50 outline-none" 
            value={formData.agent_name}
            onChange={(e) => setFormData({...formData, agent_name: e.target.value})}
          />
        </div>

        <div>
           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Severidad del Ataque</label>
           <div className="grid grid-cols-3 gap-2">
              {['Low', 'Medium', 'High'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFormData({...formData, severity: s})}
                  className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-tight border transition-all ${formData.severity === s ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-100' : 'bg-white border-slate-100 text-slate-400'}`}
                >
                  {s}
                </button>
              ))}
           </div>
        </div>

        <div>
           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Acción Tomada</label>
           <input 
             type="text" 
             placeholder="Ej: Poda sanitaria, aplicación..." 
             className="w-full h-14 rounded-2xl border border-slate-100 px-5 font-bold text-sm bg-slate-50 outline-none" 
             value={formData.action_taken}
             onChange={(e) => setFormData({...formData, action_taken: e.target.value})}
           />
        </div>

        <button type="button" className="w-full h-14 flex items-center justify-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-red-500 transition-colors">
           <Camera size={20} className="mr-2" />
           <span className="text-[10px] font-black uppercase">Prueba Fotográfica</span>
        </button>
      </div>

      <button 
        type="submit"
        className="w-full flex items-center justify-center h-16 rounded-[2rem] bg-red-600 text-white font-black uppercase tracking-[0.2em] text-sm hover:bg-red-700 transition-all shadow-xl shadow-red-100 active:scale-95"
      >
        <AlertTriangle className="mr-3 h-6 w-6" />
        Reportar Hallazgo
      </button>
    </form>
  )
}
