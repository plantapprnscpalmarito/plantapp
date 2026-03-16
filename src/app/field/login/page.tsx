'use client'

import React, { useState } from 'react'
import { TreePine, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function MobileLogin() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate auth
    setTimeout(() => {
      router.push('/field/hub')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col px-8 pt-24 pb-12 font-sans overflow-hidden">
      {/* Background Decor */}
      <div className="absolute -top-24 -right-24 h-64 w-64 bg-emerald-50 rounded-full" />
      <div className="absolute -bottom-32 -left-32 h-80 w-80 bg-emerald-100/50 rounded-full" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="h-20 w-20 bg-emerald-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-emerald-200 mb-6">
           <TreePine size={40} />
        </div>
        
        <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Plantapp <span className="text-emerald-600">Field</span></h1>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-12">Monitoreo RNSC Palmarito</p>

        <form onSubmit={handleLogin} className="w-full space-y-4">
           <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                placeholder="Usuario / Correo"
                className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 text-sm font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                required
              />
           </div>

           <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                placeholder="Contraseña"
                className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 text-sm font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                required
              />
           </div>

           <button 
             type="submit"
             disabled={loading}
             className="w-full h-14 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-100 flex items-center justify-center active:scale-95 transition-all disabled:opacity-50"
           >
             {loading ? 'Iniciando...' : (
               <>
                 Ingresar <ArrowRight className="ml-2" size={18} />
               </>
             )}
           </button>
        </form>

        <div className="mt-auto pt-12 flex flex-col items-center">
           <div className="flex items-center text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">
              <ShieldCheck size={12} className="mr-2" />
              Conexión Encriptada
           </div>
           <p className="text-[10px] text-slate-400 font-medium">© 2026 Fundación Palmarito Casanare</p>
        </div>
      </div>
    </div>
  )
}
