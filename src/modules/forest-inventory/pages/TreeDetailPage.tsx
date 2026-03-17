'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  TreeDeciduous, 
  History, 
  Camera, 
  Heart,
  Droplets,
  Ruler,
  Edit3,
  Loader2
} from 'lucide-react'
import { treeService } from '../services/treeService'
import { Tree, TreePhoto } from '../types'
import dynamic from 'next/dynamic'

// Lazy load SimpleMap for performance
const SimpleMap = dynamic(() => import('@/components/map/SimpleMap'), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center text-[10px] font-black uppercase text-slate-400">Cargando Atlas Espacial...</div>
})

function DetailsContent() {
  const searchParams = useSearchParams()
  const id = searchParams?.get('id')
  const router = useRouter()
  const [tree, setTree] = useState<Tree | null>(null)
  const [photos, setPhotos] = useState<TreePhoto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) fetchTreeDetails()
  }, [id])

  const fetchTreeDetails = async () => {
    setLoading(true)
    const { tree, photos, error } = await treeService.getTreeById(id as string)

    if (error || !tree) {
      alert('Error: Tree not found or deleted')
      router.push('/inventory')
      return
    }

    setTree(tree)
    setPhotos(photos || [])
    setLoading(false)
  }

  if (loading || !tree) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compilando Perfil de Individuo...</p>
      </div>
    )
  }

  // Parse location POINT(lng lat)
  const locationString = tree.location as string
  const coords = locationString.replace('POINT(', '').replace(')', '').split(' ')
  const position: [number, number] = [parseFloat(coords[1]), parseFloat(coords[0])]

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-1000">
      <header className="mb-10 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => router.push('/inventory')}
            className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-800 shadow-sm transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase rounded-lg">Individuo Activo</span>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Individuo #{tree.id.substring(0, 8)}</h2>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 ml-1">Parcela: {tree.parcels?.name} • RNSC Palmarito</p>
          </div>
        </div>
        <button className="h-12 px-6 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center space-x-2">
           <Edit3 size={16} />
           <span>Editar Perfil</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Scientific Bio Card */}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[5rem] -mr-10 -mt-10 opacity-50" />
             <TreeDeciduous className="absolute top-8 right-8 text-emerald-100 h-16 w-16" />
             
             <div className="relative z-10">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-4">Ficha Taxonómica</p>
                <h3 className="text-4xl font-black text-slate-800 mb-2 italic">{tree.species?.scientific_name}</h3>
                <p className="text-lg font-bold text-slate-500 mb-8">Nombre Común: {tree.species?.common_name}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-8 border-t border-slate-50">
                  <div>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Familia</p>
                    <p className="font-bold text-slate-700">{tree.species?.family || 'No registrada'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Grupo Taxonómico</p>
                    <p className="font-bold text-slate-700">{tree.species?.taxonomic_group || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Fecha de Siembra</p>
                    <p className="font-bold text-slate-700">{new Date(tree.planted_at).toLocaleDateString()}</p>
                  </div>
                </div>
             </div>
          </div>

          {/* Technical Specs & Survival */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm">
               <div className="flex items-center space-x-3 mb-6">
                  <Heart className="text-rose-500" size={18} />
                  <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Estado de Vitalidad</h4>
               </div>
               <div className="space-y-6">
                  <div className="flex justify-between items-end border-b border-slate-50 pb-4">
                     <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Condición Actual</p>
                        <p className="text-xl font-black text-slate-800 uppercase">{tree.condition}</p>
                     </div>
                     <div className={`h-8 px-4 rounded-full flex items-center text-[10px] font-black uppercase ${
                       tree.condition === 'healthy' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                     }`}>
                        {tree.condition === 'healthy' ? 'Óptimo' : 'Crítico'}
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-slate-50 p-4 rounded-2xl">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Método Siembra</p>
                        <p className="text-xs font-black text-slate-800 uppercase">{tree.planting_method || 'Manual'}</p>
                     </div>
                     <div className="bg-slate-50 p-4 rounded-2xl">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Suelo / Sitio</p>
                        <p className="text-xs font-black text-slate-800 uppercase">{tree.soil_condition || 'Normal'}</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm">
               <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                     <Ruler className="text-blue-500" size={18} />
                     <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Métricas Iniciales</h4>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col">
                     <span className="text-3xl font-black text-slate-800">{tree.initial_height || 0}</span>
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Altura (cm)</span>
                  </div>
                  <div className="flex flex-col">
                     <span className="text-3xl font-black text-slate-800">{tree.initial_diameter || 0}</span>
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">DAP (mm)</span>
                  </div>
                  <div className="col-span-2 pt-4 border-t border-slate-50">
                     <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase mb-2">
                        <span>Crecimiento Estimado</span>
                        <span className="text-emerald-600">+12% / año</span>
                     </div>
                     <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[12%]" />
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Timeline / History */}
          <div className="bg-white p-8 rounded-[3rem] border border-slate-50 shadow-sm">
             <div className="flex items-center justify-between mb-10">
                <div className="flex items-center space-x-3">
                   <History className="text-purple-600" size={20} />
                   <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">Línea de Tiempo de Monitoreo</h4>
                </div>
                <button className="text-[10px] font-black text-emerald-600 uppercase border-b-2 border-emerald-500 pb-1">Registrar Nuevo Monitoreo</button>
             </div>
             
             <div className="space-y-12 ml-4 border-l-2 border-slate-50 pl-10 relative">
                {/* Initial Planting Record */}
                <div className="relative">
                   <div className="absolute -left-[51px] top-0 w-5 h-5 bg-white border-4 border-emerald-500 rounded-full z-10" />
                   <div className="flex flex-col">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{new Date(tree.planted_at).toLocaleDateString()}</p>
                      <h5 className="text-sm font-black text-slate-800 uppercase mb-2">Siembra Inicial</h5>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">{tree.notes || 'Registro inicial del individuo en terreno.'}</p>
                   </div>
                </div>

                {(tree as any).monitoring_records?.map((record: any) => (
                  <div key={record.id} className="relative">
                     <div className="absolute -left-[51px] top-0 w-5 h-5 bg-white border-4 border-blue-500 rounded-full z-10" />
                     <div className="flex flex-col">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{new Date(record.monitoring_date).toLocaleDateString()}</p>
                        <h5 className="text-sm font-black text-slate-800 uppercase mb-2">Control de Crecimiento</h5>
                        <div className="flex space-x-6 mb-3">
                           <div className="flex items-center space-x-2">
                              <Ruler size={12} className="text-slate-300" />
                              <span className="text-xs font-bold text-slate-600">{record.tree_height}m</span>
                           </div>
                           <div className="flex items-center space-x-2">
                              <Droplets size={12} className="text-slate-300" />
                              <span className="text-xs font-bold text-slate-600">{record.tree_condition}</span>
                           </div>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">{record.observations}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
             <div className="flex items-center space-x-3 mb-4">
                <MapPin className="text-emerald-500" size={16} />
                <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Ubicación Precisa</h4>
             </div>
             <div className="h-[300px] w-full rounded-2xl overflow-hidden mb-4 border border-slate-100">
                <SimpleMap 
                  center={position} 
                  zoom={18}
                  points={[{
                    id: tree.id,
                    lat: position[0],
                    lng: position[1],
                    label: `ID: ${tree.id.substring(0, 8)}`,
                    color: tree.condition === 'healthy' ? '#10b981' : tree.condition === 'stressed' ? '#f59e0b' : '#ef4444'
                  }]}
                />
             </div>
             <div className="flex justify-between items-center text-[10px] font-black text-slate-400 font-mono">
                <span>COORD: {position[0].toFixed(5)}, {position[1].toFixed(5)}</span>
                <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">PRECISIÓN: HIGH</span>
             </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm">
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                   <Camera className="text-blue-500" size={18} />
                   <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Registro Fotográfico</h4>
                </div>
                <span className="text-[10px] font-black text-slate-400">{photos.length} fotos</span>
             </div>
             
             {photos.length > 0 ? (
               <div className="grid grid-cols-2 gap-3">
                  {photos.map((photo, i) => (
                    <div key={photo.id} className="aspect-square rounded-2xl bg-slate-100 overflow-hidden group relative cursor-pointer">
                       <img src={photo.url} alt="Tree" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                       <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                  <button className="aspect-square rounded-2xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300 hover:text-emerald-500 hover:border-emerald-200 transition-all">
                     <Camera size={20} />
                     <span className="text-[8px] font-black uppercase mt-1">Añadir</span>
                  </button>
               </div>
             ) : (
               <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-100">
                  <Camera size={32} className="mx-auto mb-3 text-slate-200" />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-4">No se han registrado imágenes de este individuo todavía.</p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function TreeDetailPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Preparando Entorno...</p>
      </div>
    }>
      <DetailsContent />
    </Suspense>
  )
}
