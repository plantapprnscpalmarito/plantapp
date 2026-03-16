'use client'

import React, { useState, useEffect } from 'react'
import MobileLayout from '@/components/mobile/MobileLayout'
import { db } from '@/lib/db'
import { RefreshCw, CheckCircle, Clock, AlertCircle, HardDrive, Cloud } from 'lucide-react'

export default function SyncPage() {
  const [counts, setCounts] = useState({
    pending: 0,
    synced: 0
  })

  useEffect(() => {
    const updateCounts = async () => {
      const pTrees = await db.trees.where('status').equals('pending').count()
      const pMon = await db.monitoring.where('status').equals('pending').count()
      const pWild = await db.wildlife.where('status').equals('pending').count()
      const pAct = await db.activities.where('status').equals('pending').count()
      const pApp = await db.applications.where('status').equals('pending').count()

      const sTrees = await db.trees.where('status').equals('synced').count()
      const sMon = await db.monitoring.where('status').equals('synced').count()
      const sWild = await db.wildlife.where('status').equals('synced').count()
      const sAct = await db.activities.where('status').equals('synced').count()
      const sApp = await db.applications.where('status').equals('synced').count()

      setCounts({
        pending: pTrees + pMon + pWild + pAct + pApp,
        synced: sTrees + sMon + sWild + sAct + sApp
      })
    }
    updateCounts()
    const interval = setInterval(updateCounts, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <MobileLayout title="Estado de Datos">
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* Summary Card */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
           <div className="relative inline-block mb-6">
              <div className="h-24 w-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-600">
                 <RefreshCw size={48} className={counts.pending > 0 ? 'animate-spin-slow' : ''} />
              </div>
              {counts.pending > 0 && (
                <div className="absolute -top-2 -right-2 h-8 w-8 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-black shadow-lg">
                   {counts.pending}
                </div>
              )}
           </div>
           
           <h2 className="text-2xl font-black text-slate-800 mb-2">Sincronización</h2>
           <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Estado del Almacenamiento Local</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
                 <Clock size={20} />
              </div>
              <p className="text-3xl font-black text-slate-800">{counts.pending}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Pendientes</p>
           </div>
           
           <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                 <CheckCircle size={20} />
              </div>
              <p className="text-3xl font-black text-slate-800">{counts.synced}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Sincronizados</p>
           </div>
        </div>

        {/* Info Card */}
        <div className="bg-slate-900 p-6 rounded-[2.5rem] text-white shadow-xl shadow-slate-200">
           <div className="flex items-center mb-4">
              <Cloud size={20} className="text-emerald-400 mr-2" />
              <h3 className="text-sm font-black uppercase tracking-widest">Flujo de Datos</h3>
           </div>
           <p className="text-xs text-slate-400 leading-relaxed mb-6 font-medium">
             Tus registros se guardan primero en la base de datos local (**Dexie.js**) para permitir el trabajo sin internet. 
             Al detectar conexión, el sistema intenta subirlos automáticamente a **Supabase Cloud**.
           </p>
           
           <div className="space-y-3">
              <div className="flex items-center text-[10px] font-bold text-slate-500 uppercase">
                 <HardDrive size={14} className="mr-2" /> Almacenamiento Local: OK
              </div>
              <div className="flex items-center text-[10px] font-bold text-emerald-400 uppercase">
                 <ShieldCheck size={14} className="mr-2" /> Encriptación: Activa
              </div>
           </div>
        </div>
      </div>
    </MobileLayout>
  )
}

function ShieldCheck({ size, className }: { size: number, className: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
