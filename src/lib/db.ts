import Dexie, { type Table } from 'dexie'

export interface OfflineTree {
  id?: number
  parcel_id: string
  species_id: string | null
  latitude: number
  longitude: number
  elevation: number
  seedling_source: string | null
  responsible_person: string | null
  planted_at: string
  status: 'pending' | 'synced'
  createdAt: number
}

export interface OfflineMonitoring {
  id?: number
  tree_id: string
  date: string
  height: number
  stem_diameter: number
  canopy_diameter: number
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Dead'
  phytosanitary: string | null
  responsible_person: string | null
  photos: string[]
  observations: string | null
  status: 'pending' | 'synced'
  createdAt: number
}

export interface OfflineWildlife {
  id?: number
  parcel_id: string | null
  project_id: string
  species: string
  observation_date: string
  latitude: number
  longitude: number
  photo_record: string | null
  behavior: string | null
  habitat_type: string | null
  responsible_person: string | null
  notes: string | null
  status: 'pending' | 'synced'
  createdAt: number
}

export interface OfflineActivity {
  id?: number
  parcel_id: string
  activity_type: string
  activity_date: string
  responsible_person: string | null
  inputs_used: string | null
  observations: string | null
  status: 'pending' | 'synced'
  createdAt: number
}

export interface OfflineApplication {
  id?: number
  tree_id: string | null
  parcel_id: string | null
  product_name: string
  product_type: string | null
  dosage: string | null
  application_method: string | null
  treated_tree_count: number | null
  responsible_person: string | null
  application_date: string
  status: 'pending' | 'synced'
  createdAt: number
}

export interface OfflinePest {
  id?: number
  tree_id: string
  event_date: string
  agent_name: string
  severity: string
  observations: string | null
  action_taken: string | null
  photo: string | null
  status: 'pending' | 'synced'
  createdAt: number
}

export class PlantappDB extends Dexie {
  trees!: Table<OfflineTree>
  monitoring!: Table<OfflineMonitoring>
  wildlife!: Table<OfflineWildlife>
  activities!: Table<OfflineActivity>
  applications!: Table<OfflineApplication>
  pests!: Table<OfflinePest>

  constructor() {
    super('PlantappDB')
    this.version(2).stores({
      trees: '++id, parcel_id, status, createdAt',
      monitoring: '++id, tree_id, status, createdAt',
      wildlife: '++id, project_id, status, createdAt',
      activities: '++id, parcel_id, status, createdAt',
      applications: '++id, tree_id, status, createdAt',
      pests: '++id, tree_id, status, createdAt'
    })
  }
}

export const db = new PlantappDB()
