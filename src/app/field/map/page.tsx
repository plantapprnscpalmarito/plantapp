'use client'

import React, { useState, useEffect } from 'react'
import { ArrowLeft, MapPin, Layers, Save, Ruler } from 'lucide-react'
import Link from 'next/link'
import { SimpleMap } from '@/components/map'
import { supabase } from '@/lib/supabase'

export default function MobileMapPage() {
  const [trees, setTrees] = useState<any[]>([])
  const [parcels, setParcels] = useState<any[]>([])

  useEffect(() => {
    async function fetchData() {
      const { data: treeData } = await supabase.from('trees').select('*')
      const { data: parcelData } = await supabase.from('parcels').select('*')
      setTrees(treeData || [])
      setParcels(parcelData || [])
    }
    fetchData()
  }, [])

  const handleGeometryCreated = (geometry: any) => {
    console.log('Mobile Geometry Created:', geometry)
    if (geometry.type === 'Feature' && geometry.geometry.type === 'Point') {
      const coords = geometry.geometry.coordinates
      localStorage.setItem('picked_coords', JSON.stringify({ lat: coords[1], lng: coords[0] }))
    }
  }

  return (
    <div className="h-screen bg-slate-900 flex flex-col relative overflow-hidden">
      {/* HUD Header */}
      <div className="absolute top-0 left-0 right-0 z-[1001] p-5 pointer-events-none">
        <div className="flex justify-between items-start">
           <Link href="/field" className="p-4 bg-slate-900/80 backdrop-blur-xl rounded-[1.5rem] text-white pointer-events-auto shadow-2xl border border-slate-700 active:scale-95 transition-all">
              <ArrowLeft size={20} />
           </Link>
           <div className="bg-slate-900/80 backdrop-blur-xl rounded-[1.5rem] p-4 px-6 border border-slate-700 pointer-events-auto shadow-2xl text-center">
              <h1 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">Field SIG Lite</h1>
              <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">RNSC Palmarito</p>
           </div>
           <div className="flex flex-col space-y-3 pointer-events-auto">
              <button className="p-4 bg-emerald-600 rounded-[1.5rem] text-white shadow-xl active:scale-95 transition-all">
                 <Layers size={20} />
              </button>
           </div>
        </div>
      </div>

      {/* Main Map */}
      <div className="flex-1 grayscale-[0.2]">
         <SimpleMap 
           center={[5.312, -71.505]}
           zoom={16}
           height="100%"
           showDrawingTools={true}
           onGeometryCreated={handleGeometryCreated}
           points={trees.map(t => ({ lat: t.latitude || 5.312, lng: t.longitude || -71.505, label: t.species_id }))}
         />
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-10 left-4 right-4 z-50 pointer-events-none">
         <div className="flex justify-between items-end">
            <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl p-4 border border-slate-700 pointer-events-auto shadow-2xl max-w-[200px]">
               <div className="flex items-center space-x-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black text-white uppercase">GPS HD Activo</span>
               </div>
               <p className="text-[9px] text-slate-400 font-bold">Precisión: 1.2m</p>
            </div>
            
            <button className="h-16 w-16 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(16,185,129,0.5)] pointer-events-auto active:scale-90 transition-transform border-4 border-white">
               <MapPin size={28} />
            </button>
            
            <Link href="/field" className="h-16 px-8 bg-white rounded-full flex items-center justify-center text-slate-900 font-black text-xs uppercase tracking-widest shadow-2xl pointer-events-auto active:scale-95 transition-transform">
               Finalizar
            </Link>
         </div>
      </div>

      {/* Grid Overlay for feel */}
      <div className="absolute inset-0 pointer-events-none opacity-5 border-[20px] border-emerald-500/20 m-4 rounded-[3rem]" />
    </div>
  )
}
