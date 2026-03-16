'use client'

import React, { useState, useEffect } from 'react'
import { Wifi, WifiOff, RefreshCw, LogOut, Menu, X, Bell } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { syncFieldData } from '@/lib/sync'

interface MobileLayoutProps {
  children: React.ReactNode
  title: string
}

export default function MobileLayout({ children, title }: MobileLayoutProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleManualSync = async () => {
    if (!isOnline) {
      alert('Debes estar conectado a Internet para sincronizar.')
      return
    }
    setIsSyncing(true)
    const results = await syncFieldData()
    setIsSyncing(false)
    
    if (results.errors.length > 0) {
      alert(`Sincronización completada con errores:\n${results.errors.join('\n')}`)
    } else {
       const total = results.trees + results.monitoring + results.wildlife + results.activities + results.applications
       alert(`Sincronización exitosa: ${total} registros subidos a la nube.`)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-none">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-100 px-4 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 -ml-2 text-slate-500 hover:text-emerald-600 transition-colors"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="ml-2">
            <h1 className="text-sm font-black text-slate-800 uppercase tracking-widest">{title}</h1>
            <div className="flex items-center">
              <span className={`h-1.5 w-1.5 rounded-full mr-1 ${isOnline ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
              <span className="text-[10px] text-slate-400 font-bold uppercase">{isOnline ? 'Online' : 'Offline'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <button 
             onClick={handleManualSync}
             className={`p-2 rounded-xl transition-all ${isSyncing ? 'bg-emerald-50 text-emerald-600 animate-spin' : 'text-slate-400 hover:bg-slate-50'}`}
           >
             <RefreshCw size={20} />
           </button>
           <div className="h-8 w-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-black text-xs">
             BC
           </div>
        </div>
      </header>

      {/* Sidebar / Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm transition-all animate-in fade-in">
           <div className="w-64 h-screen bg-white shadow-2xl p-6 flex flex-col animate-in slide-in-from-left duration-300">
              <div className="mb-8">
                 <span className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em]">Plantapp</span>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Field Interface</p>
              </div>

              <nav className="flex-1 space-y-2">
                {[
                  { name: 'Dashboard', href: '/field/hub' },
                  { name: 'Registrar Árbol', href: '/field/tree' },
                  { name: 'Monitoreo', href: '/field/monitoring' },
                  { name: 'Observación Fauna', href: '/field/fauna' },
                  { name: 'Actividades', href: '/field/activity' },
                  { name: 'Aplicaciones', href: '/field/application' },
                  { name: 'Estado de Sincronización', href: '/field/sync' },
                ].map((item) => (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-xs font-bold transition-all ${pathname === item.href ? 'bg-emerald-50 border-emerald-100 border text-emerald-700' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              <button className="flex items-center text-slate-400 hover:text-red-500 text-xs font-bold transition-colors mt-4">
                 <LogOut size={16} className="mr-2" />
                 Cerrar Sesión
              </button>
           </div>
           <div className="flex-1" onClick={() => setMenuOpen(false)} />
        </div>
      )}

      {/* Content */}
      <main className="flex-1 pt-20 pb-24 px-4 overflow-x-hidden">
        {children}
      </main>

      {/* Bottom bar for crucial info */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-100 h-16 px-6 flex items-center justify-between z-30">
        <Link href="/field/hub" className={`flex flex-col items-center ${pathname === '/field/hub' ? 'text-emerald-600' : 'text-slate-400'}`}>
           <RefreshCw size={18} />
           <span className="text-[9px] font-black uppercase mt-1">Sinc</span>
        </Link>
        <Link href="/field/tree" className="relative -top-6 h-14 w-14 bg-emerald-600 rounded-2xl shadow-xl shadow-emerald-200 flex items-center justify-center text-white border-4 border-white">
           <RefreshCw size={24} />
        </Link>
        <Link href="/field/fauna" className={`flex flex-col items-center ${pathname === '/field/fauna' ? 'text-emerald-600' : 'text-slate-400'}`}>
           <Bell size={18} />
           <span className="text-[9px] font-black uppercase mt-1">Alertas</span>
        </Link>
      </footer>
    </div>
  )
}
