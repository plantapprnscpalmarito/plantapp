export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      parcels: {
        Row: {
          id: string
          project_id: string
          name: string
          owner: string | null
          boundary: any // Geometry
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          owner?: string | null
          boundary: any
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          owner?: string | null
          boundary?: any
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      trees: {
        Row: {
          id: string
          parcel_id: string
          species_id: string | null
          location: any // Geometry
          elevation: number | null
          seedling_source: string | null
          responsible_person: string | null
          initial_height: number | null
          initial_diameter: number | null
          condition: 'healthy' | 'stressed' | 'dead' | null
          planting_method: string | null
          soil_condition: string | null
          notes: string | null
          planted_at: string
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          parcel_id: string
          species_id?: string | null
          location: any
          elevation?: number | null
          seedling_source?: string | null
          responsible_person?: string | null
          initial_height?: number | null
          initial_diameter?: number | null
          condition?: 'healthy' | 'stressed' | 'dead' | null
          planting_method?: string | null
          soil_condition?: string | null
          notes?: string | null
          planted_at?: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          parcel_id?: string
          species_id?: string | null
          location?: any
          elevation?: number | null
          seedling_source?: string | null
          responsible_person?: string | null
          initial_height?: number | null
          initial_diameter?: number | null
          condition?: 'healthy' | 'stressed' | 'dead' | null
          planting_method?: string | null
          soil_condition?: string | null
          notes?: string | null
          planted_at?: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      species: {
        Row: {
          id: string
          common_name: string
          scientific_name: string
          family: string | null
          taxonomic_group: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          common_name: string
          scientific_name: string
          family?: string | null
          taxonomic_group?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          common_name?: string
          scientific_name?: string
          family?: string | null
          taxonomic_group?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      tree_photos: {
        Row: {
          id: string
          tree_id: string
          url: string
          created_at: string
        }
        Insert: {
          id?: string
          tree_id: string
          url: string
          created_at?: string
        }
        Update: {
          id?: string
          tree_id?: string
          url?: string
          created_at?: string
        }
      }
      monitoring_records: {
        Row: {
          id: string
          tree_id: string
          monitoring_date: string
          tree_height: number | null
          stem_diameter: number | null
          canopy_diameter: number | null
          tree_condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Dead' | null
          phytosanitary_condition: string | null
          photos: Json
          responsible_person: string | null
          observations: string | null
          created_at: string
        }
        Insert: {
          id?: string
          tree_id: string
          monitoring_date?: string
          tree_height?: number | null
          stem_diameter?: number | null
          canopy_diameter?: number | null
          tree_condition?: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Dead' | null
          phytosanitary_condition?: string | null
          photos?: Json
          responsible_person?: string | null
          observations?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          tree_id?: string
          monitoring_date?: string
          tree_height?: number | null
          stem_diameter?: number | null
          canopy_diameter?: number | null
          tree_condition?: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Dead' | null
          phytosanitary_condition?: string | null
          photos?: Json
          responsible_person?: string | null
          observations?: string | null
          created_at?: string
        }
      }
      wildlife_observations: {
        Row: {
          id: string
          parcel_id: string | null
          project_id: string
          species: string
          scientific_name: string | null
          taxonomic_group: string | null
          observation_date: string
          observer: string | null
          location: any
          photo_record: string | null
          behavior: string | null
          habitat_type: string | null
          responsible_person: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          parcel_id?: string | null
          project_id: string
          species: string
          scientific_name?: string | null
          taxonomic_group?: string | null
          observation_date?: string
          observer?: string | null
          location: any
          photo_record?: string | null
          behavior?: string | null
          habitat_type?: string | null
          responsible_person?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          parcel_id?: string | null
          project_id?: string
          species?: string
          scientific_name?: string | null
          taxonomic_group?: string | null
          observation_date?: string
          observer?: string | null
          location?: any
          photo_record?: string | null
          behavior?: string | null
          habitat_type?: string | null
          responsible_person?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      field_activities: {
        Row: {
          id: string
          parcel_id: string
          activity_type: string
          activity_date: string
          responsible_person: string | null
          inputs_used: string | null
          observations: string | null
          created_at: string
        }
        Insert: {
          id?: string
          parcel_id: string
          activity_type: string
          activity_date?: string
          responsible_person?: string | null
          inputs_used?: string | null
          observations?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          parcel_id?: string
          activity_type?: string
          activity_date?: string
          responsible_person?: string | null
          inputs_used?: string | null
          observations?: string | null
          created_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          tree_id: string | null
          parcel_id: string | null
          product_name: string
          product_type: string | null
          dosage: string | null
          application_method: string | null
          treated_tree_count: number | null
          responsible_person: string | null
          notes: string | null
          application_date: string
          created_at: string
        }
        Insert: {
          id?: string
          tree_id?: string | null
          parcel_id?: string | null
          product_name: string
          product_type?: string | null
          dosage?: string | null
          application_method?: string | null
          treated_tree_count?: number | null
          responsible_person?: string | null
          notes?: string | null
          application_date?: string
          created_at?: string
        }
        Update: {
          id?: string
          tree_id?: string | null
          parcel_id?: string | null
          product_name?: string
          product_type?: string | null
          dosage?: string | null
          application_method?: string | null
          treated_tree_count?: number | null
          responsible_person?: string | null
          notes?: string | null
          application_date?: string
          created_at?: string
        }
      }
    }
  }
}
