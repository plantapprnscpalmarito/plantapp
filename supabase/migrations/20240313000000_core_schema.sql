-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Parcels Table (Polygon Geometry)
CREATE TABLE IF NOT EXISTS parcels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    owner TEXT,
    boundary GEOMETRY(Polygon, 4326) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Spatial Index for Parcels
CREATE INDEX IF NOT EXISTS parcels_boundary_idx ON parcels USING GIST (boundary);

-- Species Metadata
CREATE TABLE IF NOT EXISTS species (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    common_name TEXT NOT NULL,
    scientific_name TEXT NOT NULL UNIQUE,
    taxonomic_group TEXT,
    habitat_type TEXT
);

-- Trees Table (Point Geometry)
CREATE TABLE IF NOT EXISTS trees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parcel_id UUID NOT NULL REFERENCES parcels(id) ON DELETE CASCADE,
    species_id UUID REFERENCES species(id),
    location GEOMETRY(Point, 4326) NOT NULL,
    planted_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Spatial Index for Trees
CREATE INDEX IF NOT EXISTS trees_location_idx ON trees USING GIST (location);

-- Monitoring Records (Growth & Condition)
CREATE TABLE IF NOT EXISTS monitoring_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tree_id UUID NOT NULL REFERENCES trees(id) ON DELETE CASCADE,
    monitoring_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    tree_height FLOAT, -- meters
    stem_diameter FLOAT, -- (DBH) centimeters
    canopy_diameter FLOAT, -- meters
    tree_condition TEXT CHECK (tree_condition IN ('Excellent', 'Good', 'Fair', 'Poor', 'Dead')),
    phytosanitary_condition TEXT,
    photos JSONB DEFAULT '[]',
    observations TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pest and Disease Events
CREATE TABLE IF NOT EXISTS pest_disease_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tree_id UUID NOT NULL REFERENCES trees(id) ON DELETE CASCADE,
    event_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    agent_name TEXT,
    severity TEXT,
    observations TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Field Activities per Parcel
CREATE TABLE IF NOT EXISTS field_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parcel_id UUID NOT NULL REFERENCES parcels(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL, -- e.g., 'Weeding', 'Fertilization', 'Irrigation'
    activity_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    technician TEXT,
    observations TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Applications (Fertilizers/Treatments)
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tree_id UUID REFERENCES trees(id) ON DELETE SET NULL,
    parcel_id UUID REFERENCES parcels(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    dosage TEXT,
    application_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cost Records
CREATE TABLE IF NOT EXISTS cost_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    category TEXT NOT NULL, -- 'Labor', 'Materials', 'Equipment', etc.
    amount DECIMAL(12, 2) NOT NULL,
    currency TEXT DEFAULT 'COP',
    record_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wildlife Observations (Point Geometry)
CREATE TABLE IF NOT EXISTS wildlife_observations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parcel_id UUID REFERENCES parcels(id) ON DELETE SET NULL,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    species TEXT NOT NULL,
    scientific_name TEXT,
    taxonomic_group TEXT,
    observation_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    observer TEXT,
    location GEOMETRY(Point, 4326) NOT NULL,
    photo_record TEXT, -- storage URL
    behavior TEXT,
    habitat_type TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Spatial Index for Wildlife
CREATE INDEX IF NOT EXISTS wildlife_location_idx ON wildlife_observations USING GIST (location);

-- Drone and Satellite Imagery Metadata
CREATE TABLE IF NOT EXISTS remote_sensing_layers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    source_type TEXT CHECK (source_type IN ('Drone', 'Satellite')),
    layer_type TEXT, -- 'Orthomosaic', 'NDVI', 'DSM', etc.
    acquisition_date TIMESTAMPTZ NOT NULL,
    file_url TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ecological Indicators
CREATE TABLE IF NOT EXISTS ecological_indicators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    indicator_name TEXT NOT NULL,
    value FLOAT NOT NULL,
    calculation_date TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Restoration Model Outputs
CREATE TABLE IF NOT EXISTS restoration_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    model_name TEXT NOT NULL,
    prediction_data JSONB NOT NULL,
    run_date TIMESTAMPTZ DEFAULT NOW()
);

-- Alerts
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    alert_type TEXT NOT NULL,
    severity TEXT NOT NULL,
    message TEXT NOT NULL,
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
