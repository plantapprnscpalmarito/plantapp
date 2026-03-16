'use client'

import React, { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Polygon, Marker, Popup, LayersControl, GeoJSON, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'

// Fix for default marker icons in Leaflet with Next.js
const fixLeafletIcons = () => {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })
}

interface GeovisorProps {
  parcels?: any[]
  trees?: any[]
  geojsonLayers?: any[]
  center?: [number, number]
  zoom?: number
  onGeometryCreated?: (geometry: any) => void
  viewMode?: 'default' | 'ndvi' | 'heatmap'
}

// Internal component to handle Geoman initialization
function GeomanControls({ onGeometryCreated }: { onGeometryCreated?: (geometry: any) => void }) {
  const map = useMap()

  useEffect(() => {
    if (!map) return

    // Initialize Geoman
    map.pm.addControls({
      position: 'topleft',
      drawMarker: true,
      drawPolyline: true,
      drawRectangle: true,
      drawPolygon: true,
      drawCircle: false,
      drawCircleMarker: false,
      editMode: true,
      dragMode: true,
      cutPolygon: true,
      removalMode: true,
      rotateMode: true,
    })

    // Set global options
    map.pm.setGlobalOptions({ 
        measurements: {
            measurement: true,
        } as any
    })

    // Handle creation
    map.on('pm:create', (e: any) => {
      const { layer } = e
      console.log('Geometry Created:', layer.toGeoJSON())
      if (onGeometryCreated) {
        onGeometryCreated(layer.toGeoJSON())
      }
    })

    return () => {
      map.pm.removeControls()
      map.off('pm:create')
    }
  }, [map, onGeometryCreated])

  return null
}

const Geovisor: React.FC<GeovisorProps> = ({ 
  parcels = [], 
  trees = [], 
  geojsonLayers = [],
  center = [5.312, -71.505], 
  zoom = 13,
  onGeometryCreated,
  viewMode = 'default'
}) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    fixLeafletIcons()
    setMounted(true)
  }, [])

  if (!mounted) return (
    <div className="w-full h-full bg-slate-100 animate-pulse flex flex-col items-center justify-center text-slate-400">
      <div className="mb-4">Cargando Geovisor Premium...</div>
      <div className="h-1 w-48 bg-slate-200 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-500 animate-progress"></div>
      </div>
    </div>
  )

  return (
    <div className="w-full h-full relative group">
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%', borderRadius: '1.5rem' }}>
        <GeomanControls onGeometryCreated={onGeometryCreated} />
        
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked={viewMode !== 'ndvi'} name="OpenStreetMap">
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          
          <LayersControl.BaseLayer checked={viewMode === 'ndvi'} name="Satélite (NDVI Integration)">
            <TileLayer
              attribution='&copy; Sentinel-2 / Esri'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{x}/{y}"
            />
          </LayersControl.BaseLayer>

          {viewMode === 'ndvi' && (
            <LayersControl.Overlay checked name="Capa NDVI (Índice de Vegetación)">
               {/* This would be a WMS or ImageOverlay. Mocking with a green-tinted overlay for the demo area */}
               <TileLayer 
                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                 opacity={0.3}
                 className="filter sepia brightness-50 contrast-150 saturate-200 hue-rotate-[90deg]"
               />
            </LayersControl.Overlay>
          )}

          <LayersControl.Overlay checked name="Parcelas">
            <GeoJSON data={{ type: 'FeatureCollection', features: parcels } as any} style={{ color: viewMode === 'ndvi' ? '#fff' : '#10b981', weight: 2, fillOpacity: 0.1 }} />
          </LayersControl.Overlay>

          {viewMode === 'heatmap' ? (
             <LayersControl.Overlay checked name="Mapa de Calor (Densidad)">
                {/* Heatmap implementation usually requires a plugin, here we'll use small translucent circles as a fallback */}
                {trees.map((t, i) => (
                   <Marker key={i} position={[t.latitude || 5.312, t.longitude || -71.505]} icon={L.divIcon({ className: 'bg-emerald-500/20 w-8 h-8 rounded-full blur-md' })} />
                ))}
             </LayersControl.Overlay>
          ) : (
            <LayersControl.Overlay checked name="Árboles Individuales">
               {trees.map((t, i) => (
                  <Marker key={i} position={[t.latitude || 5.312, t.longitude || -71.505]}>
                     <Popup>
                        <div className="p-2">
                           <p className="font-bold text-slate-800">{t.species_id}</p>
                           <p className="text-[10px] text-slate-500 uppercase tracking-widest">{t.id.substring(0,8)}</p>
                        </div>
                     </Popup>
                  </Marker>
               ))}
            </LayersControl.Overlay>
          )}

          {geojsonLayers.map((layer, idx) => (
            <LayersControl.Overlay key={idx} checked name={layer.name || `Capa ${idx + 1}`}>
              <GeoJSON data={layer.data as any} style={{ color: '#3b82f6', weight: 2, fillOpacity: 0.2 }} />
            </LayersControl.Overlay>
          ))}
        </LayersControl>
      </MapContainer>

      {/* Measurement Overlay Tip */}
      <div className="absolute bottom-6 left-6 z-[1000] bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-100 shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Herramientas Activas</p>
         <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5">
               <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
               <span className="text-xs font-bold text-slate-700">Dibujo</span>
            </div>
            <div className="flex items-center space-x-1.5">
               <div className="w-2 h-2 rounded-full bg-blue-500"></div>
               <span className="text-xs font-bold text-slate-700">Medición</span>
            </div>
            <div className="flex items-center space-x-1.5">
               <div className="w-2 h-2 rounded-full bg-purple-500"></div>
               <span className="text-xs font-bold text-slate-700">Edición</span>
            </div>
         </div>
      </div>
    </div>
  )
}

export default Geovisor
