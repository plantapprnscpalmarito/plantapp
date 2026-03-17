-- Master Species Catalog Creation
-- Migration: 001_create_species.sql

CREATE TABLE IF NOT EXISTS public.species (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    common_name TEXT NOT NULL,
    scientific_name TEXT NOT NULL UNIQUE,
    family TEXT,
    taxonomic_group TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure active column exists if table was created previously
ALTER TABLE public.species ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- Ensure updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS tr_species_updated_at ON public.species;
CREATE TRIGGER tr_species_updated_at
    BEFORE UPDATE ON public.species
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
