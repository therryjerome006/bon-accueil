-- Supprime les anciennes excursions organisées par l'hôtel (Bassin Bleu, etc.)
-- La page /activites utilise désormais lib/group-events.ts

DELETE FROM activity_bookings;
DELETE FROM activities;
