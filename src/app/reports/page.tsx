'use client'

import React, { useState } from 'react'
import { 
  FileText, 
  Download, 
  PieChart, 
  BarChart, 
  Activity,
  Calendar,
  Filter,
  Users,
  Settings,
  ChevronRight
} from 'lucide-react'

export default function ReportsPage() {
  const [reportType, setReportType] = useState('ecological')

  const reportCategories = [
    { id: 'ecological', name: 'Restauración Ecológica', icon: Activity, color: 'text-emerald-500' },
    { id: 'inventory', name: 'Inventario Forestal', icon: BarChart, color: 'text-blue-500' },
    { id: 'monitoring', name: 'Supervivencia & Salud', icon: PieChart, color: 'text-rose-500' },
    { id: 'financial', name: 'Costos & Inversión', icon: FileText, color: 'text-amber-500' },
  ]

  return (
    <div className="p-8 animate-in fade-in duration-700">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Centro de Reportes</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Generación de Informes Técnicos Automatizados</p>
        </div>
        <div className="flex space-x-3">
           <button className="h-12 px-6 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 shadow-xl transition-all flex items-center">
              <Settings className="mr-2 h-4 w-4" /> Configurar Plantillas
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-10">
        <div className="lg:col-span-1 space-y-4">
           {reportCategories.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => setReportType(cat.id)}
                className={`w-full p-6 rounded-[2rem] border transition-all flex items-center justify-between group ${
                  reportType === cat.id 
                  ? 'bg-white border-slate-100 shadow-xl scale-105 z-10' 
                  : 'bg-slate-50 border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                 <div className="flex items-center">
                    <div className={`p-3 rounded-xl bg-white shadow-sm mr-4 ${cat.color}`}>
                       <cat.icon size={20} />
                    </div>
                    <span className="text-xs font-black text-slate-700 uppercase tracking-tight">{cat.name}</span>
                 </div>
                 <ChevronRight size={16} className={`text-slate-300 transition-transform ${reportType === cat.id ? 'translate-x-1' : ''}`} />
              </button>
           ))}
        </div>

        <div className="lg:col-span-3 bg-white p-10 rounded-[2.5rem] border border-slate-50 shadow-sm">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Parámetros del Informe</h3>
              <div className="flex space-x-4">
                 <div className="flex items-center px-4 py-2 bg-slate-50 rounded-xl">
                    <Calendar size={14} className="text-slate-400 mr-2" />
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Trimestre Actual</span>
                 </div>
                 <div className="flex items-center px-4 py-2 bg-slate-50 rounded-xl">
                    <Filter size={14} className="text-slate-400 mr-2" />
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Filtros Avanzados</span>
                 </div>
              </div>
           </div>

           <div className="space-y-10">
              <div className="p-8 border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/20 text-center">
                 <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="text-emerald-500 animate-bounce" size={24} />
                 </div>
                 <h4 className="text-lg font-black text-slate-800 tracking-tight mb-2">Previsualización de Reporte</h4>
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-8">El sistema generará dinámicamente gráficos e indicadores basados en el tipo seleccionado.</p>
                 
                 <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                    <button className="h-14 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center">
                       Descargar PDF
                    </button>
                    <button className="h-14 bg-slate-100 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-200 transition-all flex items-center justify-center">
                       Exportar Excel
                    </button>
                 </div>
              </div>

              <div>
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Contenidos Incluidos</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      'Análisis Multitemporal de Supervivencia',
                      'Distribución de Diámetros y Alturas',
                      'Mapa de Calor de Mortalidad por Parcela',
                      'Comparativa contra Meta de Restauración',
                      'Anexo Fotográfico de Campo',
                      'Firmas de Responsabilidad Técnica'
                    ].map((item, i) => (
                       <div key={i} className="flex items-center p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-colors">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 mr-3"></div>
                          <span className="text-[11px] font-bold text-slate-600">{item}</span>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
         <div className="relative z-10 flex items-center justify-between">
            <div className="max-w-xl">
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-emerald-400">Governance & Roles</h3>
               <p className="text-3xl font-black text-white leading-tight mb-2">Gestión de Acceso del Personal</p>
               <p className="text-xs text-slate-400 font-bold leading-relaxed max-w-md">
                 Administre permisos de campo para técnicos, investigadores y administradores. Configure el acceso offline y los protocolos de sincronización.
               </p>
            </div>
            <button className="h-14 px-10 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-transform flex items-center">
               <Users className="mr-3 h-4 w-4" /> Administrar Usuarios
            </button>
         </div>
         <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-5 scale-150 rotate-12 group-hover:rotate-[20deg] transition-transform duration-1000">
            <Settings className="w-80 h-80 text-emerald-400" />
         </div>
      </div>
    </div>
  )
}
