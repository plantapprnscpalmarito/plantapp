'use client'

import React, { useState } from 'react'
import { ClipboardList, Droplets, Save, User, Package, Hash } from 'lucide-react'
import { db } from '@/lib/db'

export function ApplicationForm() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    tree_id: '',
    parcel_id: '',
    product_name: '',
    product_type: 'Fertilizer',
    dosage: '',
    application_method: 'Soil',
    treated_tree_count: 1,
    responsible_person: '',
    notes: '',
  })

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await db.applications.add({
        ...formData,
        application_date: new Date().toISOString(),
        status: 'pending',
        createdAt: Date.now()
      })
      alert('Registro de aplicación guardado')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-purple-50 p-3 rounded-2xl">
          <ClipboardList className="h-6 w-6 text-purple-600" />
        </div>
        <h3 className="text-xl font-black text-slate-800">Registrar Aplicación</h3>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
           <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Parcela</label>
              <select 
                className="w-full h-14 rounded-2xl border border-slate-100 px-5 font-bold text-sm bg-slate-50 outline-none"
                value={formData.parcel_id}
                onChange={(e) => setFormData({...formData, parcel_id: e.target.value})}
              >
                <option value="">Seleccione...</option>
                <option value="p1">Parcela A1</option>
                <option value="p2">Parcela B2</option>
              </select>
           </div>
           <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Árbol (Opcional)</label>
              <input 
                type="text" 
                placeholder="ID Árbol" 
                className="w-full h-14 rounded-2xl border border-slate-100 px-5 font-bold text-sm bg-slate-50 outline-none"
                value={formData.tree_id}
                onChange={(e) => setFormData({...formData, tree_id: e.target.value})}
              />
           </div>
        </div>

        <div>
           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Producto</label>
           <div className="relative">
              <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input 
                type="text" 
                placeholder="Nombre del producto" 
                className="w-full h-14 rounded-2xl border border-slate-100 pl-10 pr-4 font-bold text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all" 
                value={formData.product_name}
                onChange={(e) => setFormData({...formData, product_name: e.target.value})}
                required
              />
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Dosis</label>
              <input 
                type="text" 
                placeholder="Ej: 50g / árbol" 
                className="w-full h-14 rounded-2xl border border-slate-100 px-5 font-bold text-sm bg-slate-50 outline-none" 
                value={formData.dosage}
                onChange={(e) => setFormData({...formData, dosage: e.target.value})}
              />
           </div>
           <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Total Árboles</label>
              <div className="relative">
                 <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                 <input 
                   type="number" 
                   placeholder="1" 
                   className="w-full h-14 rounded-2xl border border-slate-100 pl-10 pr-4 font-bold text-sm bg-slate-50 outline-none" 
                   value={formData.treated_tree_count}
                   onChange={(e) => setFormData({...formData, treated_tree_count: parseInt(e.target.value)})}
                 />
              </div>
           </div>
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
      </div>

      <button 
        type="submit"
        className="w-full flex items-center justify-center h-16 rounded-[2rem] bg-purple-600 text-white font-black uppercase tracking-[0.2em] text-sm hover:bg-purple-700 transition-all shadow-xl shadow-purple-100 active:scale-95"
      >
        <Save className="mr-3 h-6 w-6" />
        Guardar Aplicación
      </button>
    </form>
  )
}
