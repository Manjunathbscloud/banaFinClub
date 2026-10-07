-- ============================================================
-- BANAKAR FINCLUB — DEV STATEMENTS SEED
-- Run this in dev Supabase SQL editor
-- These mirror prod exactly — latest balance = ₹15,335
-- ============================================================

-- First delete existing rows if re-running
DELETE FROM statements;

INSERT INTO statements (date, type, amount, description, balance, created_at) VALUES
  ('2026-07-01', 'credit',  9445, 'Appanna credited',           92085, '2026-07-01 04:58:11+00'),
  ('2026-07-01', 'credit',  3250, 'Manjunath Banakar credited', 95335, '2026-07-01 05:00:00+00'),
  ('2026-07-01', 'credit',  2000, 'Mukkanna credited',          97335, '2026-07-01 05:01:00+00'),
  ('2026-07-03', 'credit',  3250, 'Santhosha Banakar credited', 100585,'2026-07-03 06:00:00+00'),
  ('2026-07-04', 'credit',  4500, 'Banakar P S credited',       105085,'2026-07-04 07:00:00+00'),
  ('2026-07-05', 'credit',  5750, 'Pratap B credited',          110835,'2026-07-05 08:00:00+00'),
  ('2026-07-05', 'credit',  4500, 'Pradeep credited',           115335,'2026-07-05 09:00:00+00'),
  ('2026-07-10', 'debit', 100000, 'Manjunath Banakar debited',  15335, '2026-07-10 10:00:00+00');
