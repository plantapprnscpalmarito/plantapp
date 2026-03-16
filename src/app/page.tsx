'use client'

import React, { useEffect, useState } from 'react'
import { 
  TreeDeciduous, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign,
  MapPin,
  Calendar
} from 'lucide-react'
import { SimpleMap } from '@/components/map'
import { supabase } from '@/lib/supabase'
import { calculateSurvivalRate, detectAnomalies } from '@/lib/science'

export default function Dashboard() {
  const [stats, setStats] = useState([
    { name: 'Árboles Plantados', value: '...', icon: TreeDeciduous, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: 'Tasa de Supervivencia', value: '...', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Alertas Sanitarias', value: '...', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
    { name: 'Inversión Total', value: '$45.2M', icon: DollarSign, color: 'text-slate-600', bg: 'bg-slate-50' },
  ])
  const [trees, setTrees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showMap, setShowMap] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const { count: treeCount, data: treeData } = await supabase.from('trees').select('*', { count: 'exact' })
        const { data: monitoringData } = await supabase.from('monitoring_records').select('*')
        const { count: appsCount } = await supabase.from('applications').select('*', { count: 'exact' })

        const survival = calculateSurvivalRate(monitoringData || [])
        const anomalies = detectAnomalies(monitoringData || [])

        setTrees(treeData || [])
        setStats([
          { name: 'Árboles Plantados', value: (treeCount || 0).toLocaleString(), icon: TreeDeciduous, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { name: 'Tasa de Supervivencia', value: `${survival.toFixed(1)}%`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
          { name: 'Alertas Sanitarias', value: anomalies.length.toString(), icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
          { name: 'Actividades Realizadas', value: (appsCount || 0).toString(), icon: Calendar, color: 'text-slate-600', bg: 'bg-slate-50' },
        ])
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="p-8 animate-in fade-in duration-700">
      <header className="mb-8">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Status del Ecosistema</h2>
        <div className="flex items-center space-x-2 text-slate-400 mt-1">
           <MapPin size={14} className="text-emerald-500" />
           <p className="text-xs font-bold uppercase tracking-widest leading-none">RNSC Palmarito • Colombia</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-50 flex items-center hover:shadow-xl hover:shadow-slate-100 transition-all cursor-default group">
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} mr-5 group-hover:scale-110 transition-transform`}>
              <stat.icon className="h-7 w-7" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.name}</p>
              <p className="text-3xl font-black text-slate-800 leading-none">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-slate-50 overflow-hidden min-h-[500px] flex flex-col">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></div>
              Geovisor en Tiempo Real
            </h3>
            <div className="flex items-center space-x-2">
               <span className="w-3 h-3 rounded-full bg-red-500"></span>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest uppercase">Live Feed</span>
            </div>
          </div>
          <div className="flex-1 relative group bg-slate-50/50">
            {!showMap ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 rounded-[2rem] bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <MapPin className="h-10 w-10 text-emerald-600" />
                </div>
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em] mb-2">Vista Satelital Optimizada</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest max-w-[200px] leading-relaxed mb-8">
                  Haz clic para cargar la visualización espacial ligera del inventario.
                </p>
                <button 
                  onClick={() => setShowMap(true)}
                  className="bg-slate-900 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
                >
                  Cargar Mapa
                </button>
              </div>
            ) : (
              <SimpleMap 
                points={trees.slice(0, 100).map(t => ({ 
                  lat: t.latitude || 5.312, 
                  lng: t.longitude || -71.505, 
                  label: t.species_id 
                }))} 
                height="100%" 
              />
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50">
            <h3 className="text-sm font-black text-slate-800 mb-6 uppercase tracking-widest flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-blue-500" />
              Actividad Reciente
            </h3>
            <div className="space-y-5">
              {[
                { title: 'Monitoreo de Parcela A2', date: 'Hace 2 horas', user: 'Carlos B.', type: 'monitoring' },
                { title: 'Registro de Fauna (Venado)', date: 'Hace 5 horas', user: 'Ana M.', type: 'wildlife' },
                { title: 'Mantenimiento (Deshierbe)', date: 'Ayer', user: 'Juan P.', type: 'activity' },
              ].map((activity, i) => (
                <div key={i} className="flex group cursor-pointer">
                  <div className={`w-1 rounded-full mr-4 group-hover:w-2 transition-all ${
                    activity.type === 'monitoring' ? 'bg-emerald-500' : 
                    activity.type === 'wildlife' ? 'bg-amber-500' : 'bg-blue-500'
                  }`}></div>
                  <div>
                    <p className="text-sm font-black text-slate-800 group-hover:text-emerald-600 transition-colors">{activity.title}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{activity.date} • {activity.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-4 text-emerald-400">Salud del Bosque</h3>
              <p className="text-5xl font-black text-white leading-tight">NIVEL IV</p>
              <div className="h-1.5 w-full bg-slate-800 rounded-full mt-6 overflow-hidden">
                 <div className="h-full bg-emerald-500 w-[80%] rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)]"></div>
              </div>
              <p className="text-xs text-slate-400 mt-6 font-bold leading-relaxed">
                La cobertura forestal ha incrementado un **15%** en el último año. Próxima meta: Conectividad con el corredor biológico B.
              </p>
            </div>
            <div className="absolute -top-12 -right-12 opacity-5 scale-150 group-hover:scale-[1.7] transition-transform duration-1000">
              <TreeDeciduous className="w-64 h-64 text-emerald-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
