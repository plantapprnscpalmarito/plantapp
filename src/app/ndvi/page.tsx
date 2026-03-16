'use client'

import React, { useEffect, useState } from 'react'
import { 
  TrendingUp, 
  Leaf, 
  Map, 
  BarChart3, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Network
} from 'lucide-react'
import { SurvivalChart } from '@/components/analytics/Charts'
import dynamic from 'next/dynamic'
import { supabase } from '@/lib/supabase'

const Geovisor = dynamic(() => import('@/components/map/Geovisor'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-400 text-xs font-bold uppercase tracking-widest">Cargando Satélite...</div>
})

export default function ModelingPage() {
  const [trees, setTrees] = useState<any[]>([])
  const [parcels, setParcels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const { data: treeData } = await supabase.from('trees').select('*')
      const { data: parcelData } = await supabase.from('parcels').select('*')
      setTrees(treeData || [])
      setParcels(parcelData || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <div className="p-8 animate-in fade-in duration-700">
      <header className="mb-10">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Inteligencia Satelital (NDVI)</h2>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Análisis Multi-espectral • Sentinel-2 Integration</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Geovisor with NDVI */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-slate-50 overflow-hidden flex flex-col min-h-[600px]">
           <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></div>
                 Vigor Vegetativo (NDVI)
              </h3>
              <div className="flex space-x-2">
                 <button className="px-3 py-1 bg-emerald-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">Normalizado</button>
                 <button className="px-3 py-1 bg-slate-100 text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest">Infrarrojo</button>
              </div>
           </div>
           <div className="flex-1">
              <Geovisor trees={trees} parcels={parcels} viewMode="ndvi" />
           </div>
        </div>

        {/* Analytics Side Panel */}
        <div className="space-y-8">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm relative overflow-hidden group">
              <div className="relative z-10">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Score de Salud del Paisaje</h3>
                 <div className="flex justify-center items-baseline mb-4">
                    <span className="text-7xl font-black text-slate-800">0.82</span>
                    <span className="text-xl font-black text-emerald-500 ml-1">NDVI</span>
                 </div>
                 <div className="text-center">
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 py-1.5 px-4 rounded-full uppercase tracking-widest">Trayectoria Alta</span>
                 </div>
                 
                 <div className="mt-10 space-y-5">
                    {[
                      { label: 'Densidad Copas', p: '92%', color: 'bg-emerald-500' },
                      { label: 'Índice de Clorofila', p: '76%', color: 'bg-green-500' },
                      { label: 'Retención Hídrica', p: '88%', color: 'bg-blue-500' },
                      { label: 'Erosión Mitigada', p: '64%', color: 'bg-amber-500' },
                    ].map(item => (
                      <div key={item.label}>
                         <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                            <span className="text-slate-400">{item.label}</span>
                            <span className="text-slate-800">{item.p}</span>
                         </div>
                         <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                            <div className={`h-full ${item.color} rounded-full transition-all duration-1000 group-hover:opacity-80`} style={{ width: item.p }} />
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="absolute -bottom-10 -right-10 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-1000">
                 <ShieldCheck className="w-64 h-64 text-emerald-900" />
              </div>
           </div>

           <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl">
              <h3 className="text-[10px] font-black flex items-center mb-6 uppercase tracking-widest text-emerald-400">
                 <Network className="mr-2 h-4 w-4" />
                 Métricas de Conectividad
              </h3>
              <div className="space-y-6">
                 <div className="p-5 bg-slate-800/50 rounded-2xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Prox. Corredor Biológico</p>
                    <p className="text-3xl font-black text-white">124m</p>
                 </div>
                 <p className="text-[11px] text-slate-400 font-bold italic leading-relaxed">
                    "La fragmentación ha disminuido un **12%** gracias al corredor consolidado en la Parcela B2."
                 </p>
              </div>
           </div>
        </div>
      </div>

      {/* Trajectory Predictor Section */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white p-10 rounded-[2.5rem] border border-slate-50 shadow-sm">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center">
                  <TrendingUp className="mr-3 h-6 w-6 text-emerald-500" />
                  Sucesión Ecológica Proyectada
               </h3>
            </div>
            <SurvivalChart />
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm hover:shadow-xl transition-all group cursor-pointer border-l-4 border-l-amber-500">
               <div className="flex items-center justify-between mb-4">
                  <Zap className="h-6 w-6 text-amber-500" />
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
               </div>
               <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-2">Estrés Térmico</h4>
               <p className="text-[11px] text-slate-400 font-medium leading-relaxed">Probabilidad de supervivencia ante ola de calor 2026.</p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm hover:shadow-xl transition-all group cursor-pointer border-l-4 border-l-blue-500">
               <div className="flex items-center justify-between mb-4">
                  <Leaf className="h-6 w-6 text-blue-500" />
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
               </div>
               <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-2">Stock de Carbono</h4>
               <p className="text-[11px] text-slate-400 font-medium leading-relaxed">Cálculo de toneladas de CO2 eq capturadas por biomasa.</p>
            </div>
         </div>
      </div>
    </div>
  )
}
