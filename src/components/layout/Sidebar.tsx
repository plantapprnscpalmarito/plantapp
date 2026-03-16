'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  TreeDeciduous, 
  Activity, 
  Database, 
  BarChart3, 
  Settings, 
  Users,
  FileText,
  TrendingUp,
  Bird
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Inventario Forestal', href: '/inventory', icon: TreeDeciduous },
  { name: 'Monitoreo', href: '/monitoring', icon: Activity },
  { name: 'Biodiversidad', href: '/biodiversity', icon: Bird },
  { name: 'Visor de Mapas', href: '/map-viewer', icon: MapIcon },
  { name: 'Análisis NDVI', href: '/ndvi', icon: TrendingUp },
  { name: 'Importar/Exportar', href: '/data', icon: Database },
  { name: 'Reportes', href: '/reports', icon: FileText },
  { name: 'Configuración', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col bg-slate-900 text-white">
      <div className="flex h-16 items-center px-6">
        <h1 className="text-xl font-bold tracking-tight text-emerald-400">PLANTAPP</h1>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive 
                  ? 'bg-emerald-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              )}
            >
              <item.icon className={cn(
                'mr-3 h-5 w-5 flex-shrink-0',
                isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'
              )} />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Users className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">Admin Palmarito</p>
            <p className="text-xs text-slate-400 font-light truncate">admin@palmarito.org</p>
          </div>
        </div>
      </div>
    </div>
  )
}
