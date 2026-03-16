import { db } from './db'
import { supabase } from './supabase'

export async function syncFieldData() {
  const results = {
    trees: 0,
    monitoring: 0,
    wildlife: 0,
    activities: 0,
    applications: 0,
    pests: 0,
    errors: [] as string[]
  }

  try {
    // 1. Sync Trees
    const pendingTrees = await db.trees.where('status').equals('pending').toArray()
    for (const tree of pendingTrees) {
      const { error } = await (supabase.from('trees') as any).insert({
        parcel_id: tree.parcel_id,
        species_id: tree.species_id,
        location: `POINT(${tree.longitude} ${tree.latitude})`,
        elevation: tree.elevation,
        seedling_source: tree.seedling_source,
        responsible_person: tree.responsible_person,
        planted_at: tree.planted_at
      })

      if (!error) {
        await db.trees.update(tree.id!, { status: 'synced' })
        results.trees++
      } else {
        results.errors.push(`Tree sync error: ${error.message}`)
      }
    }

    // 2. Sync Monitoring
    const pendingMon = await db.monitoring.where('status').equals('pending').toArray()
    for (const mon of pendingMon) {
      const { error } = await (supabase.from('monitoring_records') as any).insert({
        tree_id: mon.tree_id,
        monitoring_date: mon.date,
        tree_height: mon.height,
        stem_diameter: mon.stem_diameter,
        canopy_diameter: mon.canopy_diameter,
        tree_condition: mon.condition,
        phytosanitary_condition: mon.phytosanitary,
        responsible_person: mon.responsible_person,
        observations: mon.observations,
        photos: mon.photos
      })

      if (!error) {
        await db.monitoring.update(mon.id!, { status: 'synced' })
        results.monitoring++
      } else {
        results.errors.push(`Monitoring sync error: ${error.message}`)
      }
    }

    // 3. Sync Wildlife
    const pendingWildlife = await db.wildlife.where('status').equals('pending').toArray()
    for (const wild of pendingWildlife) {
      const { error } = await (supabase.from('wildlife_observations') as any).insert({
        project_id: wild.project_id,
        parcel_id: wild.parcel_id,
        species: wild.species,
        observation_date: wild.observation_date,
        location: `POINT(${wild.longitude} ${wild.latitude})`,
        behavior: wild.behavior,
        habitat_type: wild.habitat_type,
        responsible_person: wild.responsible_person,
        notes: wild.notes
      })

      if (!error) {
        await db.wildlife.update(wild.id!, { status: 'synced' })
        results.wildlife++
      } else {
        results.errors.push(`Wildlife sync error: ${error.message}`)
      }
    }

    // 4. Sync Activities
    const pendingActs = await db.activities.where('status').equals('pending').toArray()
    for (const act of pendingActs) {
      const { error } = await (supabase.from('field_activities') as any).insert({
        parcel_id: act.parcel_id,
        activity_type: act.activity_type,
        activity_date: act.activity_date,
        responsible_person: act.responsible_person,
        inputs_used: act.inputs_used,
        observations: act.observations
      })

      if (!error) {
        await db.activities.update(act.id!, { status: 'synced' })
        results.activities++
      } else {
        results.errors.push(`Activity sync error: ${error.message}`)
      }
    }

    // 5. Sync Applications
    const pendingApps = await db.applications.where('status').equals('pending').toArray()
    for (const app of pendingApps) {
      const { error } = await (supabase.from('applications') as any).insert({
        tree_id: app.tree_id,
        parcel_id: app.parcel_id,
        product_name: app.product_name,
        product_type: app.product_type,
        dosage: app.dosage,
        application_method: app.application_method,
        treated_tree_count: app.treated_tree_count,
        responsible_person: app.responsible_person,
        application_date: app.application_date,
        notes: ''
      })

      if (!error) {
        await db.applications.update(app.id!, { status: 'synced' })
        results.applications++
      } else {
        results.errors.push(`Application sync error: ${error.message}`)
      }
    }

    return results
  } catch (err: any) {
    results.errors.push(`Critical sync failure: ${err.message}`)
    return results
  }
}
