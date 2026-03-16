'use client'

import React, { useEffect, useState } from 'react'
import { SurvivalChart } from '@/components/analytics/Charts'
import { 
  Heart, 
  AlertTriangle, 
  Calendar, 
  TrendingDown,
  Activity,
  Plus,
  ArrowUpRight,
  Database as DBIcon
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { calculateSurvivalRate, detectAnomalies } from '@/lib/science'

export default function MonitoringPage() {
  const [records, setRecords] = useState<any[]>([])
  const [stats, setStats] = useState([
    { label: 'Tasa Supervivencia', value: '...', icon: Heart, color: 'text-emerald-500', trend: '', up: true },
    { label: 'Árboles con Alerta', value: '...', icon: AlertTriangle, color: 'text-amber-500', trend: '', up: false },
    { label: 'Último Monitoreo', value: '...', icon: Calendar, color: 'text-blue-500', trend: '', up: true },
    { label: 'Tasa Mortalidad', value: '...', icon: TrendingDown, color: 'text-rose-500', trend: '', up: false },
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from('monitoring_records').select('*, trees!inner(species_id)')
      if (data) {
        setRecords(data)
        const survival = calculateSurvivalRate(data)
        const anomalies = detectAnomalies(data)
        const lastDate = data.length > 0 ? new Date(Math.max(...data.map((r: any) => new Date(r.monitoring_date).getTime()))).toLocaleDateString() : 'N/A'

        setStats([
          { label: 'Tasa Supervivencia', value: `${survival.toFixed(1)}%`, icon: Heart, color: 'text-emerald-500', trend: '+1.2%', up: true },
          { label: 'Árboles con Alerta', value: anomalies.length.toString(), icon: AlertTriangle, color: 'text-amber-500', trend: '', up: false },
          { label: 'Último Monitoreo', value: lastDate, icon: Calendar, color: 'text-blue-500', trend: '', up: true },
          { label: 'Tasa Mortalidad', value: `${(100 - survival).toFixed(1)}%`, icon: TrendingDown, color: 'text-rose-500', trend: '', up: false },
        ])
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <div className="p-8 animate-in fade-in duration-700">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Análisis de Supervivencia</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Monitoreo Científico de Mortalidad • RNSC Palmarito</p>
        </div>
        <button className="h-12 px-6 bg-emerald-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all active:scale-95 flex items-center">
          <Plus className="mr-2 h-5 w-5" />
          Registrar Monitoreo
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-slate-50 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              {stat.trend && (
                <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.up ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                  {stat.trend}
                </span>
              )}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-slate-800">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-50 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-10">
             <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center">
                <Activity className="mr-2 h-5 w-5 text-emerald-500" />
                Regresión de Supervivencia (Cohortes)
             </h3>
             <div className="flex space-x-2">
                <button className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">General</button>
                <button className="px-4 py-1.5 hover:bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest">Por Especie</button>
             </div>
          </div>
          <div className="h-[300px]">
            <SurvivalChart />
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -mr-32 -mt-32 opacity-20 -z-10 group-hover:scale-110 transition-transform duration-1000" />
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-50 shadow-sm">
          <h3 className="text-sm font-black text-slate-800 mb-8 uppercase tracking-widest">Matriz de Mortalidad</h3>
          <div className="space-y-8">
            {[
              { type: 'Peste/Enfermedad', n: 42, color: 'bg-rose-500', p: '26%' },
              { type: 'Estrés Hídrico', n: 88, color: 'bg-blue-500', p: '55%' },
              { type: 'Herbivoría', n: 31, color: 'bg-amber-500', p: '19%' },
            ].map((cause, i) => (
              <div key={i}>
                <div className="flex justify-between items-end mb-3">
                   <p className="text-xs font-black text-slate-700 uppercase tracking-tight">{cause.type}</p>
                   <p className="text-[10px] font-black text-slate-400 uppercase">{cause.p}</p>
                </div>
                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                   <div className={`h-full ${cause.color} rounded-full flex items-center justify-end px-1`} style={{ width: cause.p }}>
                      <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                   </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 p-6 border border-emerald-50 rounded-[2rem] bg-emerald-50/30">
             <div className="flex items-center mb-3">
                <AlertTriangle size={14} className="text-emerald-600 mr-2" />
                <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Recomendación Técnica</p>
             </div>
             <p className="text-[11px] text-emerald-900/70 italic font-medium leading-relaxed">
               "El incremento en estrés hídrico en la zona norte sugiere la necesidad de implementar micro-zanjas de infiltración antes del próximo periodo seco."
             </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
         <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
            <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">Bitácora de Monitoreo</h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total: {records.length} Registros</span>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-slate-50">
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-tight">Fecha</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-tight">ID Árbol</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-tight">Especie</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-tight text-right">Altura (m)</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-tight text-right">Estado</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-tight text-right">Acción</th>
                  </tr>
               </thead>
                <tbody className="divide-y divide-slate-50">
                  {records.length > 0 ? records.map((r: any) => (
                     <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-5 text-xs font-bold text-slate-800">{new Date(r.monitoring_date).toLocaleDateString()}</td>
                        <td className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase">{r.tree_id.substring(0, 8)}</td>
                        <td className="px-8 py-5 text-xs font-bold text-slate-600">{r.trees?.species_id || 'N/A'}</td>
                        <td className="px-8 py-5 text-xs font-black text-slate-800 text-right">{r.tree_height}m</td>
                        <td className="px-8 py-5 text-right">
                           <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${
                              r.tree_condition === 'Excellent' || r.tree_condition === 'Good' ? 'bg-emerald-50 text-emerald-600' :
                              r.tree_condition === 'Fair' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                           }`}>
                              {r.tree_condition}
                           </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                           <button className="text-slate-200 hover:text-emerald-600 transition-all transform hover:scale-110">
                              <ArrowUpRight className="h-5 w-5" />
                           </button>
                        </td>
                     </tr>
                  )) : (
                     <tr>
                        <td colSpan={6} className="px-8 py-20 text-center">
                           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No hay registros de monitoreo disponibles.</p>
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  )
}
