'use client'

import React, { useEffect, useState } from 'react'
import { Bird, ArrowUpRight } from 'lucide-react'
import { SimpleMap } from '@/components/map'
import { supabase } from '@/lib/supabase'

export default function BiodiversityPage() {
  const [observations, setObservations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from('wildlife_observations').select('*')
      setObservations(data || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <div className="p-8 animate-in fade-in duration-700">
      <header className="mb-8">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Monitoreo de Biodiversidad</h2>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Avistamientos y Salud del Ecosistema • Palmarito</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center">
              <Bird className="mr-2 h-5 w-5 text-emerald-500" />
              Últimos Avistamientos
            </h3>
            <div className="space-y-4">
              {observations.map((obs, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-emerald-50 transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-4 border border-slate-100 group-hover:border-emerald-200">
                      <Bird className="h-5 w-5 text-slate-400 group-hover:text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{obs.species}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        {new Date(obs.observation_date).toLocaleDateString()} • {obs.responsible_person}
                      </p>
                    </div>
                  </div>
                  <button className="text-slate-300 hover:text-emerald-600 transition-all">
                    <ArrowUpRight className="h-5 w-5" />
                  </button>
                </div>
              ))}
              {observations.length === 0 && (
                <div className="py-20 text-center">
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">No hay observaciones registradas en el sistema.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <h3 className="relative z-10 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-8">Resumen Taxonómico</h3>
            <div className="relative z-10 space-y-8">
              {[
                { name: 'Aves', count: 124, progress: 80, color: 'bg-emerald-500' },
                { name: 'Mamíferos', count: 12, progress: 30, color: 'bg-blue-500' },
                { name: 'Reptiles', count: 8, progress: 15, color: 'bg-amber-500' },
              ].map(cat => (
                <div key={cat.name}>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                    <span className="text-slate-400">{cat.name}</span>
                    <span className="text-white">{cat.count}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className={`${cat.color} h-full rounded-full`} style={{ width: `${cat.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute -bottom-10 -right-10 opacity-5">
               <Bird className="w-48 h-48" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden min-h-[350px] flex flex-col">
             <div className="p-4 border-b border-slate-50 mb-4">
                <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">Hotspots de Fauna</h3>
             </div>
             <div className="flex-1 rounded-[1.5rem] overflow-hidden">
                <SimpleMap 
                  points={observations.map(obs => ({ lat: obs.latitude || 5.312, lng: obs.longitude || -71.505, label: obs.species }))}
                  height="100%"
                />
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
