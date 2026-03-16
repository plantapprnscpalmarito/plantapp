'use client'

import React, { useEffect, useState } from 'react'
import { SurvivalChart, GrowthChart } from '@/components/analytics/Charts'
import { NewTreeModal } from '@/components/studio/NewTreeModal'
import { 
  TreeDeciduous, 
  Layers, 
  ArrowUpRight,
  TrendingUp,
  Table as TableIcon,
  Search,
  Filter
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function InventoryPage() {
  const [trees, setTrees] = useState<any[]>([])
  const [parcels, setParcels] = useState<any[]>([])
  const [filter, setFilter] = useState({ parcelId: '', speciesId: '' })
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchData = async () => {
    const { data: treeData } = await supabase.from('trees').select('*')
    const { data: parcelData } = await supabase.from('parcels').select('*')
    setTrees(treeData || [])
    setParcels(parcelData || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredTrees = trees.filter(t => 
    (!filter.parcelId || t.parcel_id === filter.parcelId) &&
    (!filter.speciesId || t.species_id === filter.speciesId)
  )

  return (
    <div className="p-8 animate-in fade-in duration-700">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Inventario Forestal</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Gestión Selectiva de la Biomasa • RNSC Palmarito</p>
        </div>
        <div className="flex space-x-3">
          <div className="relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
             <input type="text" placeholder="Buscar ID de Árbol..." className="h-12 pl-12 pr-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold shadow-sm focus:ring-2 focus:ring-emerald-500/20 outline-none w-64" />
          </div>
          <button onClick={() => setIsModalOpen(true)} className="h-12 px-6 bg-emerald-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all active:scale-95">
            + Nuevo Registro
          </button>
        </div>
      </header>

      {/* Control Panel */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm mb-8 flex items-center space-x-6">
         <div className="flex items-center space-x-3">
            <Filter size={16} className="text-slate-400" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filtros:</span>
         </div>
         <select 
           value={filter.parcelId}
           onChange={(e) => setFilter({...filter, parcelId: e.target.value})}
           className="h-10 bg-slate-50 border-none rounded-xl px-4 text-xs font-bold text-slate-600 outline-none"
         >
            <option value="">Todas las Parcelas</option>
            {parcels.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
         </select>
         <select 
           value={filter.speciesId}
           onChange={(e) => setFilter({...filter, speciesId: e.target.value})}
           className="h-10 bg-slate-50 border-none rounded-xl px-4 text-xs font-bold text-slate-600 outline-none"
         >
            <option value="">Todas las Especies</option>
            <option value="Saladillo">Saladillo</option>
            <option value="Alcornoque">Alcornoque</option>
         </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-blue-500" />
              Tasas de Crecimiento (MAI)
            </h3>
          </div>
          <GrowthChart />
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
             <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Densidad Regional</span>
                <Layers className="h-5 w-5 text-slate-600" />
             </div>
             <p className="text-5xl font-black mb-2">{filteredTrees.length}</p>
             <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Árboles Identificados</p>
             <div className="mt-8 pt-8 border-t border-slate-800 flex items-center justify-between">
                <div>
                   <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Área Basal</p>
                   <p className="text-xl font-black text-white">12.4 m²/ha</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1 text-right">Biomasa Est.</p>
                   <p className="text-xl font-black text-emerald-400">45.2 t/ha</p>
                </div>
             </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 mb-6 uppercase tracking-[0.2em]">Métricas de Dosel</h3>
            <div className="space-y-6">
               <div className="group">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                     <span className="text-slate-400">Cobertura de Copas</span>
                     <span className="text-emerald-600">65%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500 w-[65%] group-hover:bg-emerald-400 transition-colors" />
                  </div>
               </div>
               <div className="group">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                     <span className="text-slate-400">Estructura Vertical</span>
                     <span className="text-blue-600">82%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-500 w-[82%] group-hover:bg-blue-400 transition-colors" />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
         <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
            <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">Registros en Tiempo Real</h3>
            <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline flex items-center">
               <TableIcon size={12} className="mr-1.5" /> Descargar CSV
            </button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-slate-50">
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-tight">ID Árbol</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-tight">Especie</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-tight">Parcela</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-tight text-right">F. Plantación</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-tight text-right">Evasión (m)</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-tight text-right">Acción</th>
                  </tr>
               </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredTrees.length > 0 ? filteredTrees.map((tree) => (
                     <tr key={tree.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-5">
                           <span className="text-[11px] font-black text-slate-800 group-hover:text-emerald-600 transition-colors uppercase">{tree.id.substring(0, 8)}</span>
                        </td>
                        <td className="px-8 py-5 text-xs font-bold text-slate-600">{tree.species_id || 'N/A'}</td>
                        <td className="px-8 py-5 text-xs font-bold text-slate-500">
                           {parcels.find(p => p.id === tree.parcel_id)?.name || 'Sin Parcela'}
                        </td>
                        <td className="px-8 py-5 text-xs font-medium text-slate-400 text-right">{new Date(tree.planted_at).toLocaleDateString()}</td>
                        <td className="px-8 py-5 text-xs font-black text-slate-800 text-right">{tree.elevation || 0}m</td>
                        <td className="px-8 py-5 text-right">
                           <button className="text-slate-200 hover:text-emerald-600 transition-all transform hover:scale-110">
                              <ArrowUpRight className="h-5 w-5" />
                           </button>
                        </td>
                     </tr>
                  )) : (
                     <tr>
                        <td colSpan={6} className="px-8 py-20 text-center">
                           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No se encontraron registros en el inventario.</p>
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      <NewTreeModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData}
        parcels={parcels}
      />
    </div>
  )
}
