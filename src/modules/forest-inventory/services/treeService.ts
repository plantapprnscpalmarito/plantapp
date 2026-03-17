import { supabase } from '@/lib/supabase'
import { Tree, Species, Parcel, TreePhoto } from '../types'

export const treeService = {
  async getTrees(page: number = 1, pageSize: number = 10, filters: any = {}) {
    let query = supabase
      .from('trees')
      .select(`
        *,
        parcels(name),
        species(*)
      `, { count: 'exact' })
      .is('deleted_at', null)

    if (filters.searchQuery) {
      query = query.ilike('id', `%${filters.searchQuery}%`)
    }
    if (filters.parcelId && filters.parcelId !== 'all') {
      query = query.eq('parcel_id', filters.parcelId)
    }
    if (filters.speciesId && filters.speciesId !== 'all') {
      query = query.eq('species_id', filters.speciesId)
    }
    if (filters.condition && filters.condition !== 'all') {
      query = query.eq('condition', filters.condition)
    }
    if (filters.startDate) {
      query = query.gte('planted_at', filters.startDate)
    }
    if (filters.endDate) {
      query = query.lte('planted_at', filters.endDate)
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1)

    return { data: data as Tree[], error, count }
  },

  async getTreeById(id: string) {
    const { data: treeData, error } = await (supabase
      .from('trees') as any)
      .select(`
        *,
        parcels(name),
        species(*),
        monitoring_records(*)
      `)
      .eq('id', id)
      .single()

    const { data: photoData } = await supabase
      .from('tree_photos')
      .select('*')
      .eq('tree_id', id)

    return { 
      tree: treeData as Tree, 
      photos: (photoData || []) as TreePhoto[], 
      error 
    }
  },

  async createTree(treeData: any, photoUrls: string[] = []) {
    const { data, error } = await (supabase
      .from('trees') as any)
      .insert([treeData])
      .select()
      .single()

    if (error) return { error }

    if (photoUrls.length > 0) {
      const photoInserts = photoUrls.map(url => ({
        tree_id: data.id,
        url
      }))
      await (supabase.from('tree_photos') as any).insert(photoInserts)
    }

    return { data, error: null }
  },

  async softDeleteTree(id: string) {
    const { error } = await (supabase
      .from('trees') as any)
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
    return { error }
  },

  async getParcels() {
    return await supabase.from('parcels').select('*').order('name')
  },

  async getSpecies() {
    return await supabase.from('species').select('*').order('common_name')
  }
}
