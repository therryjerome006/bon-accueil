-- Tables restaurant
INSERT INTO restaurant_tables (name, capacity, description, images, status)
VALUES
  ('Table pour 2', 2, 'Intime, avec vue dégagée sur Jacmel — idéale pour un dîner en couple.', ARRAY['/images/restaurant/table-2.jpg'], 'available'),
  ('Table pour 4', 4, 'Terrasse ombragée, parfaite pour un déjeuner en famille.', ARRAY['/images/restaurant/table-4.jpg'], 'available'),
  ('Table pour 6', 6, 'Grande table conviviale avec vue sur le jardin et la ville.', ARRAY['/images/restaurant/table-6.jpg'], 'available'),
  ('Table pour 8', 8, 'Espace privatif pour groupes et événements intimes.', ARRAY['/images/restaurant/table-8.jpg'], 'available')
ON CONFLICT DO NOTHING;

-- Les offres « groupes & événements » sont définies dans lib/group-events.ts (page publique).
-- Pour vider d'anciennes excursions : DELETE FROM activities;
