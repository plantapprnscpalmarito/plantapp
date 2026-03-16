'use client'

import React, { useState, useEffect } from 'react'
import { Geovisor } from '@/components/map'
import { Filter, Layers, List, Search, Map as MapIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function MapViewerPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [trees, setTrees] = useState<any[]>([])
  const [parcels, setParcels] = useState<any[]>([])

  useEffect(() => {
    async function fetchData() {
      const { data: treeData } = await supabase.from('trees').select('*')
      const { data: parcelData } = await supabase.from('parcels').select('*')
      setTrees(treeData || [])
      setParcels(parcelData || [])
    }
    fetchData()
  }, [])

  return (
    <div className="relative flex h-full flex-col animate-in fade-in duration-700">
      {/* Top Header / Toolbar */}
      <div className="flex h-16 items-center justify-between border-b border-slate-100 bg-white px-8">
        <div className="flex items-center">
            <div className="bg-emerald-50 p-2 rounded-xl mr-4">
                <MapIcon className="h-5 w-5 text-emerald-600" />
            </div>
            <h2 className="text-sm font-black text-slate-800 tracking-tight uppercase tracking-[0.2em]">Visor de Mapas Pro</h2>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar coordenadas o IDs..." 
              className="h-10 w-72 rounded-2xl border border-slate-100 pl-11 pr-4 text-[10px] font-black uppercase tracking-widest focus:border-emerald-500 focus:outline-none bg-slate-50/50"
            />
          </div>
          <button className="flex h-10 items-center rounded-2xl border border-slate-100 bg-white px-5 text-[10px] font-black uppercase tracking-widest text-slate-700 hover:bg-slate-50 hover:shadow-lg transition-all active:scale-95">
            <Filter className="mr-2 h-4 w-4 text-emerald-500" />
            Capas
          </button>
        </div>
      </div>

      <div className="relative flex flex-1 overflow-hidden">
        {/* Map Area */}
        <div className="relative flex-1 bg-slate-50 overflow-hidden">
          <Geovisor trees={trees} parcels={parcels} />
        </div>

        {/* Legend Panel */}
        {isSidebarOpen && (
            <div className="w-80 border-l border-slate-100 bg-white p-8 overflow-y-auto animate-in slide-in-from-right duration-500 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">Herramientas SIG</h3>
                    <button onClick={() => setIsSidebarOpen(false)} className="text-slate-300 hover:text-slate-600 transition-colors">
                        <List className="h-4 w-4" />
                    </button>
                </div>

                <div className="space-y-10 flex-1">
                    <section>
                        <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Información Espacial</h4>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Individuos</span>
                                <span className="text-xs font-black text-slate-800">{trees.length}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Área Manejo</span>
                                <span className="text-xs font-black text-slate-800">452 ha</span>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Análisis Avanzado</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 text-center group hover:bg-emerald-600 transition-all duration-500">
                                <Layers className="h-6 w-6 text-emerald-600 mx-auto mb-3 group-hover:text-white group-hover:scale-110 transition-all" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-800 group-hover:text-white">NDVI</span>
                            </button>
                            <button className="p-6 bg-blue-50 rounded-3xl border border-blue-100 text-center group hover:bg-blue-600 transition-all duration-500">
                                <TrendingUpIcon className="h-6 w-6 text-blue-600 mx-auto mb-3 group-hover:text-white group-hover:scale-110 transition-all" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-blue-800 group-hover:text-white">Topo</span>
                            </button>
                        </div>
                    </section>

                    <section className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-4">Modo Profesional</p>
                            <p className="text-[11px] text-slate-400 leading-loose font-bold">
                                Las herramientas de medición y dibujo están activas. Use el panel lateral izquierdo del mapa para digitalizar.
                            </p>
                        </div>
                        <div className="absolute -top-10 -right-10 opacity-5 scale-150 group-hover:scale-[1.7] transition-transform duration-1000">
                           <MapIcon className="w-48 h-48" />
                        </div>
                    </section>
                </div>
            </div>
        )}
      </div>
    </div>
  )
}

function TrendingUpIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  )
}
