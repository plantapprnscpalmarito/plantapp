-- Palmarito Species Dataset
-- Seed: species_seed.sql

INSERT INTO public.species (common_name, scientific_name, family, taxonomic_group)
VALUES 
('Guarataro', 'Vitex orinocensis', 'Lamiaceae', 'Arboreo'),
('Búcaro', 'Erythrina fusca', 'Fabaceae', 'Arboreo'),
('Guamo', 'Inga spp.', 'Fabaceae', 'Arboreo'),
('Simarubo', 'Simarouba amara', 'Simaroubaceae', 'Arboreo'),
('Yopo', 'Anadenanthera peregrina', 'Fabaceae', 'Arboreo'),
('Caño fistol', 'Cassia grandis', 'Fabaceae', 'Arboreo'),
('Aceite', 'Copaifera officinalis', 'Fabaceae', 'Arboreo'),
('Oboco', 'Jacaranda copaia', 'Bignoniaceae', 'Arboreo'),
('Moriche', 'Mauritia flexuosa', 'Arecaceae', 'Palma'),
('Guaque', 'Clusia spp.', 'Clusiaceae', 'Arboreo'),
('Algarrobo', 'Hymenaea courbaril', 'Fabaceae', 'Arboreo')
ON CONFLICT (scientific_name) DO UPDATE SET 
    common_name = EXCLUDED.common_name,
    family = EXCLUDED.family,
    taxonomic_group = EXCLUDED.taxonomic_group;
