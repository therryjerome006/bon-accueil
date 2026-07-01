-- Seed des 3 chambres principales (à exécuter dans l'éditeur SQL Supabase)
INSERT INTO rooms (slug, title, price, capacity, surface, description, images, amenities, services, is_featured, status)
VALUES
  (
    'chambre-standard',
    'Chambre Standard',
    80,
    2,
    22,
    'Une chambre lumineuse et fonctionnelle, idéale pour un séjour court à Jacmel.',
    ARRAY['/images/rooms/standard.jpg'],
    ARRAY['Télévision', 'Air conditionné', 'Toilettes séparées', 'Sèche-cheveux'],
    ARRAY['Accès internet', 'Parking gratuit'],
    true,
    'available'
  ),
  (
    'chambre-deluxe',
    'Chambre Deluxe',
    140,
    2,
    32,
    'Espace généreux avec terrasse privée et vue partielle sur la mer.',
    ARRAY['/images/rooms/deluxe.jpg'],
    ARRAY['Télévision', 'Air conditionné', 'Toilettes séparées', 'Coffre-fort', 'Machine à café', 'Machine à thé', 'Sèche-cheveux'],
    ARRAY['Accès internet', 'Service de chambre', 'Parking gratuit'],
    true,
    'available'
  ),
  (
    'suite-bon-accueil',
    'Suite Bon Accueil',
    250,
    4,
    55,
    'Notre suite signature : salon séparé, deux chambres, terrasse panoramique face à l''océan.',
    ARRAY['/images/rooms/suite.jpg'],
    ARRAY['Télévision', 'Air conditionné', 'Toilettes séparées', 'Coffre-fort', 'Machine à laver', 'Machine à café', 'Machine à thé', 'Sèche-cheveux'],
    ARRAY['Accès internet', 'Service de chambre', 'Parking gratuit'],
    true,
    'available'
  )
ON CONFLICT (slug) DO NOTHING;
