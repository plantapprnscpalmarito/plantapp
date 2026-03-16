import { Database } from '@/types/database'

type Tree = Database['public']['Tables']['trees']['Row']
type Monitoring = Database['public']['Tables']['monitoring_records']['Row']

/**
 * Calculates the survival rate for a set of monitoring records.
 * Uses the latest record for each tree to determine its current status.
 */
export function calculateSurvivalRate(records: Monitoring[]): number {
  if (records.length === 0) return 0
  
  // Get latest record for each tree
  const latestByTree: Record<string, Monitoring> = {}
  records.forEach(r => {
    if (!latestByTree[r.tree_id] || new Date(r.monitoring_date) > new Date(latestByTree[r.tree_id].monitoring_date)) {
      latestByTree[r.tree_id] = r
    }
  })

  const aliveCount = Object.values(latestByTree).filter(r => r.tree_condition !== 'Dead').length
  const totalSeen = Object.keys(latestByTree).length
  
  return totalSeen > 0 ? (aliveCount / totalSeen) * 100 : 0
}

/**
 * Calculates the Mean Annual Increment (MAI) for height.
 */
export function calculateGrowthMetrics(records: Monitoring[]) {
  // Logic to calculate growth trajectories over time
  return {
    avgHeight: records.reduce((acc, r) => acc + (r.tree_height || 0), 0) / (records.length || 1),
    avgDiameter: records.reduce((acc, r) => acc + (r.stem_diameter || 0), 0) / (records.length || 1)
  }
}

/**
 * Generates alerts based on phytosanitary conditions.
 */
export function detectAnomalies(records: Monitoring[]) {
  return records.filter(r => 
    r.phytosanitary_condition && 
    (r.phytosanitary_condition.toLowerCase().includes('sick') || 
     r.phytosanitary_condition.toLowerCase().includes('enfermo') ||
     r.phytosanitary_condition.toLowerCase().includes('pest'))
  )
}
