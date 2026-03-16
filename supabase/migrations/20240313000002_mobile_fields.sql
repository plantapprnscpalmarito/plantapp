-- Add missing fields for mobile-optimized data collection

-- Trees Table Enhancements
ALTER TABLE trees 
ADD COLUMN IF NOT EXISTS elevation FLOAT,
ADD COLUMN IF NOT EXISTS seedling_source TEXT,
ADD COLUMN IF NOT EXISTS responsible_person TEXT;

-- Monitoring Records Enhancements
ALTER TABLE monitoring_records
ADD COLUMN IF NOT EXISTS responsible_person TEXT;

-- Field Activities Enhancements
ALTER TABLE field_activities
ADD COLUMN IF NOT EXISTS responsible_person TEXT,
ADD COLUMN IF NOT EXISTS inputs_used TEXT;

-- Applications Enhancements
ALTER TABLE applications
ADD COLUMN IF NOT EXISTS product_type TEXT,
ADD COLUMN IF NOT EXISTS application_method TEXT,
ADD COLUMN IF NOT EXISTS treated_tree_count INTEGER,
ADD COLUMN IF NOT EXISTS responsible_person TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Wildlife Observations Enhancements
-- Already has species, scientific_name, taxonomic_group, observation_date, location, photo_record, behavior, habitat_type, notes
ALTER TABLE wildlife_observations
ADD COLUMN IF NOT EXISTS responsible_person TEXT;

-- Sync Log for Audit
CREATE TABLE IF NOT EXISTS sync_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    sync_date TIMESTAMPTZ DEFAULT NOW(),
    records_synced INTEGER,
    status TEXT, -- 'Success', 'Partial', 'Failed'
    errors JSONB DEFAULT '[]'
);
