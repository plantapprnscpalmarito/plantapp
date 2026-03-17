// Forest Inventory Module Types

import { Database } from '@/types/database'

export type Tree = Database['public']['Tables']['trees']['Row'] & {
  parcels?: { name: string }
  species?: Database['public']['Tables']['species']['Row']
  monitoring_records?: Database['public']['Tables']['monitoring_records']['Row'][]
}

export type Species = Database['public']['Tables']['species']['Row']
export type Parcel = Database['public']['Tables']['parcels']['Row']
export type TreePhoto = Database['public']['Tables']['tree_photos']['Row']

export interface InventoryFilters {
  searchQuery: string
  parcelId: string
  speciesId: string
  condition: string
  startDate: string
  endDate: string
}
