'use client'

import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'

// Fix for default marker icons in Leaflet with Next.js
const fixLeafletIcons = () => {
  // @ts-ignore
  if (typeof window !== 'undefined' && L.BaseIcon) {
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    })
  }
}

function GeomanControls({ 
  enabled, 
  onGeometryCreated 
}: { 
  enabled: boolean, 
  onGeometryCreated?: (geo: any) => void 
}) {
  const map = useMap()

  useEffect(() => {
    if (!map || !enabled) return

    map.pm.addControls({
      position: 'topleft',
      drawMarker: true,
      drawPolyline: true,
      drawPolygon: true,
      drawRectangle: false,
      drawCircle: false,
      drawCircleMarker: false,
      editMode: true,
      dragMode: true,
      removalMode: true,
    })

    map.pm.setGlobalOptions({ 
        measurements: {
            measurement: true,
            displayUnit: 'metric'
        } as any
    })

    map.on('pm:create', (e: any) => {
      if (onGeometryCreated) onGeometryCreated(e.layer.toGeoJSON())
    })

    return () => {
      map.pm.removeControls()
      map.off('pm:create')
    }
  }, [map, enabled, onGeometryCreated])

  return null
}

interface SimpleMapProps {
  points?: { lat: number; lng: number; label?: string }[]
  shapes?: any[]
  center?: [number, number]
  zoom?: number
  height?: string
  interactive?: boolean
  showDrawingTools?: boolean
  onGeometryCreated?: (geo: any) => void
}

const SimpleMap: React.FC<SimpleMapProps> = ({ 
  points = [], 
  shapes = [],
  center = [5.312, -71.505], 
  zoom = 15,
  height = '300px',
  interactive = true,
  showDrawingTools = false,
  onGeometryCreated
}) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    fixLeafletIcons()
    setMounted(true)
  }, [])

  if (!mounted) return (
    <div className="w-full bg-slate-50 rounded-2xl animate-pulse flex items-center justify-center text-slate-300 text-[10px] uppercase font-bold tracking-widest" style={{ height }}>
      Cargando Mapa...
    </div>
  )

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-100 relative" style={{ height }}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
        dragging={interactive && !L.Browser.mobile}
        touchZoom={interactive}
        zoomControl={interactive}
      >
        <GeomanControls enabled={showDrawingTools} onGeometryCreated={onGeometryCreated} />
        <TileLayer
          attribution='&copy; OSM'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {shapes.map((shape, idx) => (
          <GeoJSON key={idx} data={shape} style={{ color: '#10b981', weight: 2, fillOpacity: 0.1 }} />
        ))}

        {points.map((p, i) => (
          <Marker key={i} position={[p.lat, p.lng]}>
            {p.label && (
              <Popup>
                <div className="p-1">
                  <p className="text-xs font-bold text-slate-800">{p.label}</p>
                </div>
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default SimpleMap
