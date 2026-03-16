'use client'

import React, { useState } from 'react'
import { Trees, Microscope, Bug, Activity, ClipboardList, Bird, ArrowRight, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import MobileLayout from '@/components/mobile/MobileLayout'

export default function MobileHub() {
  const [recentSyncCount, setRecentSyncCount] = useState(0)

  const modules = [
    { 
      name: 'Registro Árbol', 
      icon: Trees, 
      href: '/field/tree', 
      color: 'bg-emerald-500', 
      desc: 'Plantación nueva' 
    },
    { 
      name: 'Monitoreo', 
      icon: Microscope, 
      href: '/field/monitoring', 
      color: 'bg-blue-500', 
      desc: 'Crecimiento y salud' 
    },
    { 
      name: 'Plagas y Enfermedades', 
      icon: Bug, 
      href: '/field/pests', 
      color: 'bg-red-500', 
      desc: 'Detección de riesgos' 
    },
    { 
      name: 'Actividades', 
      icon: Activity, 
      href: '/field/activities', 
      color: 'bg-amber-500', 
      desc: 'Mantenimiento' 
    },
    { 
      name: 'Aplicaciones', 
      icon: ClipboardList, 
      href: '/field/applications', 
      color: 'bg-purple-500', 
      desc: 'Insumos aplicados' 
    },
    { 
      name: 'Vida Silvestre', 
      icon: Bird, 
      href: '/field/fauna', 
      color: 'bg-teal-500', 
      desc: 'Observaciones' 
    },
  ]

  return (
    <MobileLayout title="Plantapp Field">
      {/* Welcome Card */}
      <div className="bg-emerald-600 rounded-3xl p-6 mb-8 text-white shadow-xl shadow-emerald-100 relative overflow-hidden">
        <div className="relative z-10">
           <h2 className="text-xl font-black mb-1">¡Hola, Técnico!</h2>
           <p className="text-emerald-100 text-xs font-medium">Estás en RNSC Palmarito</p>
           
           <div className="mt-6 flex items-center bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
              <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center mr-3">
                 <ShieldCheck size={20} className="text-white" />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Sincronización</p>
                 <p className="text-xs font-bold">{recentSyncCount} registros pendientes</p>
              </div>
           </div>
        </div>
        {/* Decor */}
        <div className="absolute top-0 right-0 h-32 w-32 bg-white/5 rounded-full -mr-12 -mt-12" />
      </div>

      {/* Grid of Modules */}
      <div>
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Módulos de Campo</h3>
        <div className="grid grid-cols-2 gap-4">
          {modules.map((mod) => (
            <Link 
              key={mod.name} 
              href={mod.href}
              className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm active:scale-95 transition-transform group"
            >
              <div className={`${mod.color} h-12 w-12 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-${mod.color.split('-')[1]}-100`}>
                 <mod.icon size={24} />
              </div>
              <p className="text-sm font-black text-slate-800 leading-tight mb-1">{mod.name}</p>
              <p className="text-[10px] text-slate-400 font-medium">{mod.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity Mini-Timeline */}
      <div className="mt-10 mb-8">
         <div className="flex justify-between items-end mb-4 px-1">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Actividad Reciente</h3>
            <span className="text-[9px] font-black text-emerald-600 uppercase">Ver Todo</span>
         </div>
         <div className="space-y-4">
            {[
              { type: 'Árbol', title: 'Saladillo (Vochysia)', time: 'Hace 10 min', status: 'pending' },
              { type: 'Monitoreo', title: 'Parcela A2 - Árbol #042', time: 'Hace 1 hora', status: 'synced' },
            ].map((item, i) => (
              <div key={i} className="bg-white px-5 py-4 rounded-2xl border border-slate-100 flex items-center">
                 <div className={`h-2 w-2 rounded-full mr-4 ${item.status === 'synced' ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
                 <div className="flex-1">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-tight">{item.type}</p>
                    <p className="text-xs font-bold text-slate-800">{item.title}</p>
                 </div>
                 <span className="text-[10px] text-slate-400 font-medium">{item.time}</span>
              </div>
            ))}
         </div>
      </div>
    </MobileLayout>
  )
}
