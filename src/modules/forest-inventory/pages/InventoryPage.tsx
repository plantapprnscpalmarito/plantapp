'use client'

import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Search,
  Filter,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  AlertCircle,
  Loader2,
  ArrowUpRight,
  TreeDeciduous,
  Leaf
} from 'lucide-react'
import { treeService } from '../services/treeService'
import { NewTreeModal } from '../components/NewTreeModal'
import { Tree, Parcel, Species, InventoryFilters } from '../types'

export function InventoryPage() {
  const [trees, setTrees] = useState<Tree[]>([])
  const [parcels, setParcels] = useState<Parcel[]>([])
  const [species, setSpecies] = useState<Species[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Pagination & Filtering
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 10
  
  const [filters, setFilters] = useState<InventoryFilters>({
    searchQuery: '',
    parcelId: 'all',
    speciesId: 'all',
    condition: 'all',
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    fetchInitialData()
  }, [])

  useEffect(() => {
    fetchTrees()
  }, [page, filters])

  const fetchInitialData = async () => {
    const [pData, sData] = await Promise.all([
      treeService.getParcels(),
      treeService.getSpecies()
    ])
    setParcels(pData.data || [])
    setSpecies(sData.data || [])
  }

  const fetchTrees = async () => {
    setLoading(true)
    const { data, count, error } = await treeService.getTrees(page, pageSize, filters)
    if (!error) {
      setTrees(data || [])
      setTotalCount(count || 0)
    }
    setLoading(false)
  }

  const handleSoftDelete = async (id: string) => {
    if (!confirm('¿Está seguro de eliminar este registro? (Se realizará un borrado lógico)')) return
    const { error } = await treeService.softDeleteTree(id)
    if (error) alert('Error al eliminar: ' + error.message)
    else fetchTrees()
  }

  const getConditionStyle = (condition: string) => {
    switch (condition) {
      case 'healthy': return 'bg-emerald-50 text-emerald-700 border-emerald-100'
      case 'stressed': return 'bg-amber-50 text-amber-700 border-amber-100'
      case 'dead': return 'bg-rose-50 text-rose-700 border-rose-100'
      default: return 'bg-slate-50 text-slate-700 border-slate-100'
    }
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center space-x-5">
          <div className="bg-slate-900 p-4 rounded-[1.5rem] shadow-xl shadow-slate-200">
            <TreeDeciduous className="text-emerald-400 h-8 w-8" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-slate-800 tracking-tight">Inventario Forestal</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 ml-1">RNSC Palmarito • Gestión de Individuos</p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="h-14 px-8 bg-emerald-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-600 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center space-x-3"
        >
          <Plus size={18} />
          <span>Nuevo Individuo</span>
        </button>
      </header>

      {/* Filters & Search Card */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50 mb-8 border-b-4 border-b-emerald-500/10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text"
              placeholder="Buscar por ID del árbol..."
              className="w-full h-14 bg-slate-50 rounded-2xl pl-12 pr-4 text-sm font-bold text-slate-700 outline-none border border-transparent focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5 transition-all"
              value={filters.searchQuery}
              onChange={(e) => setFilters({...filters, searchQuery: e.target.value})}
            />
          </div>
          
          <div className="relative">
             <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
             <select 
               className="w-full h-14 bg-slate-50 rounded-2xl pl-12 pr-4 text-[10px] font-black uppercase tracking-widest text-slate-500 outline-none appearance-none"
               value={filters.parcelId}
               onChange={(e) => setFilters({...filters, parcelId: e.target.value})}
             >
               <option value="all">Todas las Parcelas</option>
               {parcels.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
             </select>
          </div>

          <div className="relative">
             <Leaf className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
             <select 
               className="w-full h-14 bg-slate-50 rounded-2xl pl-12 pr-4 text-[10px] font-black uppercase tracking-widest text-slate-500 outline-none appearance-none"
               value={filters.speciesId}
               onChange={(e) => setFilters({...filters, speciesId: e.target.value})}
             >
               <option value="all">Todas las Especies</option>
               {species.map(s => <option key={s.id} value={s.id}>{s.common_name}</option>)}
             </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-slate-50">
           <div className="flex items-center space-x-4">
              <Calendar className="text-slate-300" size={16} />
              <input 
                type="date" 
                className="bg-transparent text-[10px] font-black uppercase text-slate-500 outline-none"
                value={filters.startDate}
                onChange={(e) => setFilters({...filters, startDate: e.target.value})}
              />
              <span className="text-slate-200">/</span>
              <input 
                type="date" 
                className="bg-transparent text-[10px] font-black uppercase text-slate-500 outline-none"
                value={filters.endDate}
                onChange={(e) => setFilters({...filters, endDate: e.target.value})}
              />
           </div>

           <div>
              <select 
                className="w-full h-10 bg-transparent text-[10px] font-black uppercase tracking-widest text-slate-500 outline-none"
                value={filters.condition}
                onChange={(e) => setFilters({...filters, condition: e.target.value})}
              >
                <option value="all">Cualquier Condición</option>
                <option value="healthy">Saludable</option>
                <option value="stressed">Estresado</option>
                <option value="dead">Muerto</option>
              </select>
           </div>
        </div>
      </div>

      {/* Main Table Layer */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-slate-50 overflow-hidden relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center">
            <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID / Código</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Especie / Taxón</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Parcela</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha Siembra</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Condición</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {trees.map((tree) => (
                <tr key={tree.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <span className="text-xs font-black text-slate-800 font-mono tracking-tighter">#{tree.id.substring(0, 8)}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-700">{tree.species?.common_name}</span>
                      <span className="text-[10px] italic font-bold text-slate-400">{tree.species?.scientific_name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100/50">{tree.parcels?.name}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold text-slate-500 uppercase">{tree.planted_at ? new Date(tree.planted_at as string).toLocaleDateString() : 'N/A'}</span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getConditionStyle(tree.condition as string)}`}>
                      {tree.condition}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                     <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => window.location.href = `/inventory/details?id=${tree.id}`}
                          className="p-2.5 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                        >
                           <ArrowUpRight size={16} />
                        </button>
                        <button 
                          onClick={() => handleSoftDelete(tree.id)}
                          className="p-2.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        >
                           <Trash2 size={16} />
                        </button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && trees.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <AlertCircle className="h-12 w-12 text-slate-200 mb-4" />
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No se encontraron individuos con los filtros actuales</p>
          </div>
        )}

        {/* Pagination Layer */}
        <div className="bg-slate-50/30 px-8 py-6 flex items-center justify-between border-t border-slate-50">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
             Mostrando {trees.length} de {totalCount} individuos
           </p>
           <div className="flex items-center space-x-2">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="p-2 text-slate-400 hover:text-slate-800 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-xs font-black text-slate-800 bg-white w-8 h-8 rounded-lg flex items-center justify-center shadow-sm border border-slate-100">{page}</span>
              <button 
                disabled={page * pageSize >= totalCount}
                onClick={() => setPage(p => p + 1)}
                className="p-2 text-slate-400 hover:text-slate-800 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
           </div>
        </div>
      </div>

      <NewTreeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false)
          fetchTrees()
        }}
        parcels={parcels}
      />
    </div>
  )
}
