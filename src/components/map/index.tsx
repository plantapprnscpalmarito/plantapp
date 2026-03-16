'use client'

import dynamic from 'next/dynamic'

export const SimpleMap = dynamic(() => import('./SimpleMap'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-50 animate-pulse flex items-center justify-center text-slate-300 text-[10px] uppercase font-bold tracking-widest">Cargando Mapa Base...</div>
})

export const Geovisor = dynamic(() => import('./Geovisor'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-400 text-[10px] uppercase font-bold tracking-widest">Cargando Herramientas SIG...</div>
})

export default SimpleMap
