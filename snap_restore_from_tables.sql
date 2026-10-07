-- RESTORE from _snap_ tables (run this after testing to reset to pre-test state)
-- Run in Supabase SQL Editor (prod DB: ighugnwxcrcycoydvflt)

BEGIN;

TRUNCATE meeting_acknowledgements;
TRUNCATE gallery_photos;
TRUNCATE loan_extension_requests;
TRUNCATE loan_requests;
TRUNCATE monthly_payments;
TRUNCATE loan_interest_payments;
TRUNCATE current_loans;
TRUNCATE statements;
TRUNCATE meeting_records;
TRUNCATE deposit_summaries;
TRUNCATE rules;
TRUNCATE settings;
TRUNCATE profiles CASCADE;

INSERT INTO profiles                 SELECT * FROM _snap_profiles;
INSERT INTO settings                 SELECT * FROM _snap_settings;
INSERT INTO rules                    SELECT * FROM _snap_rules;
INSERT INTO deposit_summaries        SELECT * FROM _snap_deposit_summaries;
INSERT INTO meeting_records          SELECT * FROM _snap_meeting_records;
INSERT INTO statements               SELECT * FROM _snap_statements;
INSERT INTO current_loans            SELECT * FROM _snap_current_loans;
INSERT INTO loan_interest_payments   SELECT * FROM _snap_loan_interest_payments;
INSERT INTO monthly_payments         SELECT * FROM _snap_monthly_payments;
INSERT INTO loan_requests            SELECT * FROM _snap_loan_requests;
INSERT INTO loan_extension_requests  SELECT * FROM _snap_loan_extension_requests;
INSERT INTO meeting_acknowledgements SELECT * FROM _snap_meeting_acknowledgements;
INSERT INTO gallery_photos           SELECT * FROM _snap_gallery_photos;

COMMIT;

-- Verify
SELECT 'profiles'                AS tbl, COUNT(*) AS rows FROM profiles
UNION ALL SELECT 'settings',                COUNT(*) FROM settings
UNION ALL SELECT 'current_loans',           COUNT(*) FROM current_loans
UNION ALL SELECT 'monthly_payments',        COUNT(*) FROM monthly_payments
UNION ALL SELECT 'loan_requests',           COUNT(*) FROM loan_requests
UNION ALL SELECT 'loan_extension_requests', COUNT(*) FROM loan_extension_requests
UNION ALL SELECT 'loan_interest_payments',  COUNT(*) FROM loan_interest_payments
UNION ALL SELECT 'meeting_acknowledgements',COUNT(*) FROM meeting_acknowledgements
UNION ALL SELECT 'deposit_summaries',       COUNT(*) FROM deposit_summaries
UNION ALL SELECT 'statements',              COUNT(*) FROM statements
UNION ALL SELECT 'meeting_records',         COUNT(*) FROM meeting_records
UNION ALL SELECT 'gallery_photos',          COUNT(*) FROM gallery_photos
UNION ALL SELECT 'rules',                   COUNT(*) FROM rules;
