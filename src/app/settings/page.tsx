'use client'

import React from 'react'
import { 
  Settings as SettingsIcon, 
  Users, 
  Shield, 
  Database, 
  Map as MapIcon,
  Bell,
  Cloud,
  Lock
} from 'lucide-react'

export default function SettingsPage() {
  const sections = [
    { title: 'Proyecto RNSC', icon: MapIcon, desc: 'Identificación, límites y metadatos del área de restauración.' },
    { title: 'Gestión de Usuarios', icon: Users, desc: 'Control de acceso, roles (Técnico, Investigador, Admin) y permisos.' },
    { title: 'Protocolos de Sincronización', icon: Cloud, desc: 'Frecuencia de respaldo, resolución de conflictos y almacenamiento offline.' },
    { title: 'Base de Datos SIG', icon: Database, desc: 'Configuración de PostGIS, SRID (Magna-Sirgas) y servicios WMS/WFS.' },
    { title: 'Notificaciones & Alertas', icon: Bell, desc: 'Umbrales de mortalidad, alertas de plagas e informes mensuales.' },
    { title: 'Seguridad & Auditoría', icon: Shield, desc: 'Logs de cambios, backups automáticos y encriptación de datos.' },
  ]

  return (
    <div className="p-8 animate-in fade-in duration-700">
      <header className="mb-10">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Configuración del Sistema</h2>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Gobernanza de Datos • Protocolos de Seguridad</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all group flex flex-col">
             <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-6 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                <section.icon size={28} />
             </div>
             <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-3">{section.title}</h3>
             <p className="text-xs text-slate-400 font-bold leading-relaxed mb-6 flex-1">{section.desc}</p>
             <button className="w-full py-3 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:bg-slate-900 group-hover:text-white transition-all">
                Configurar Parámetros
             </button>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-emerald-900 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
         <div className="relative z-10 flex items-center justify-between">
            <div className="max-w-xl">
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-emerald-400 flex items-center">
                  <Lock className="mr-2 h-4 w-4" /> Licenciamiento & Soporte
               </h3>
               <p className="text-2xl font-black text-white leading-tight mb-2">Plantapp Enterprise Edition v1.0</p>
               <p className="text-xs text-emerald-100/60 font-medium leading-relaxed">
                 Desplegado para la **Fundación Palmarito Casanare**. Todos los derechos reservados.
                 Soporte técnico prioritario activado.
               </p>
            </div>
            <div className="hidden sm:block">
               <div className="h-20 w-20 border-4 border-emerald-800 rounded-full flex items-center justify-center text-emerald-500 font-black text-xl">
                  RNSC
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}
