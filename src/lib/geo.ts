import shp from 'shpjs'

/**
 * Converts a Shapefile (as ArrayBuffer) to GeoJSON using shpjs
 */
export async function convertShpToGeoJson(data: ArrayBuffer): Promise<any> {
    try {
        const geojson = await shp(data)
        return geojson
    } catch (error) {
        console.error('Error converting SHP to GeoJSON:', error)
        throw error
    }
}

/**
 * Placeholder for KML to GeoJSON conversion
 * In a real app, you would use a library like toGeoJSON (mapbox)
 */
export function convertKmlToGeoJson(kmlText: string): any {
    // This would use a DOMParser and toGeoJSON
    console.warn('KML conversion requires toGeoJSON library')
    return null
}

/**
 * Basic validation for GeoJSON
 */
export function validateGeoJson(data: any): boolean {
    return data && data.type && (data.features || data.geometries || data.coordinates)
}
