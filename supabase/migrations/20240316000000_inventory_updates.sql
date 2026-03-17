-- Forest Inventory Module Updates
-- Migration: 20240316000000_inventory_updates.sql

-- 1. Add Soft Delete and Audit Fields to Core Tables
ALTER TABLE IF EXISTS parcels ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE IF EXISTS species ADD COLUMN IF NOT EXISTS family TEXT;
ALTER TABLE IF EXISTS species ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- 2. Enhance Trees Table with Requested Fields
ALTER TABLE IF EXISTS trees ADD COLUMN IF NOT EXISTS initial_height FLOAT; -- cm
ALTER TABLE IF EXISTS trees ADD COLUMN IF NOT EXISTS initial_diameter FLOAT; -- mm
ALTER TABLE IF EXISTS trees ADD COLUMN IF NOT EXISTS condition TEXT DEFAULT 'healthy' CHECK (condition IN ('healthy', 'stressed', 'dead'));
ALTER TABLE IF EXISTS trees ADD COLUMN IF NOT EXISTS planting_method TEXT;
ALTER TABLE IF EXISTS trees ADD COLUMN IF NOT EXISTS soil_condition TEXT;
ALTER TABLE IF EXISTS trees ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE IF EXISTS trees ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE IF EXISTS trees ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- 3. Tree Photos Table (Multi-photo Support)
CREATE TABLE IF NOT EXISTS tree_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tree_id UUID NOT NULL REFERENCES trees(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS tr_trees_updated_at ON trees;
CREATE TRIGGER tr_trees_updated_at
    BEFORE UPDATE ON trees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 5. Seed basic species if empty
INSERT INTO species (common_name, scientific_name, family, taxonomic_group)
VALUES 
('Saladillo', 'Vochysia lehmannii', 'Vochysiaceae', 'Arboreo'),
('Alcornoque', 'Bowdichia virgilioides', 'Fabaceae', 'Arboreo'),
('Yopo', 'Anadenanthera peregrina', 'Fabaceae', 'Arboreo'),
('Aceite', 'Copaifera pubiflora', 'Fabaceae', 'Arboreo')
ON CONFLICT (scientific_name) DO NOTHING;
