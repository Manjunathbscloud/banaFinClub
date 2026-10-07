-- ============================================================
-- BANAKAR FINCLUB — DEV SEED DATA
-- Mirrors production Year 6 state exactly.
--
-- BEFORE RUNNING:
--   1. Go to Supabase Dashboard → Authentication → Users → Add User
--   2. Email: manjunathbs.cloud@gmail.com  Password: 1234567
--   3. Copy the UUID generated for that user
--   4. Replace  f6c51bf8-350b-425e-aabf-84562a5373c7  below with that UUID (2 places)
-- ============================================================

-- ============================================================
-- PROFILES
-- ============================================================
INSERT INTO profiles (id, auth_user_id, full_name, phone, role, status, email) VALUES
  -- PRESIDENT — replace f6c51bf8-350b-425e-aabf-84562a5373c7 with the UUID from Auth dashboard
  ('f0526e8f-e31f-4fb0-a237-85b6497ca97b', 'f6c51bf8-350b-425e-aabf-84562a5373c7', 'Manjunath Banakar', '9591382942', 'president', 'active', 'manjunathbs.cloud@gmail.com'),
  -- Active members (auth_user_id not needed — they won't log in during dev testing)
  ('4316a1c2-e94d-498a-86e7-544a93e9efb4', NULL, 'Halaswamy D B',     '8217526323', 'member', 'active',  'halaswamydb@gmail.com'),
  ('b9cb1f18-c556-4224-b94c-01c55ca6361c', NULL, 'Mukkanna',           '8618600807', 'member', 'active',  'banakarms@gmail.com'),
  ('7e7790b5-424c-4ebd-8188-07298481ec07', NULL, 'Pradeep',            '9663644751', 'member', 'active',  'pradeepbanakar@gmail.com'),
  ('6874d44c-cb73-4959-9824-92c168cde5a9', NULL, 'Pratap B',           '7259907409', 'member', 'active',  'pratapbanakar@gmail.com'),
  ('598c6ccd-7c1e-45af-9fb0-ea34935bf094', NULL, 'Santhosha Banakar',  '9739678816', 'member', 'active',  'santhoshabanakar1990@gmail.com'),
  ('c54ddef5-9ead-4d21-a1fd-05ec305e9e15', NULL, 'Banakar P S',        '9538913204', 'member', 'active',  'praveenbanakar24@gmail.com'),
  -- Exited members (status = exited)
  ('8deebb9b-de10-474e-b0fd-47b37e44c446', NULL, 'BM MANOJ KUMAR',     'exited-8deebb9b-de10-474e-b0fd-47b37e44c446', 'member', 'exited', 'bm.manoj619@gmail.com'),
  ('cdb217e0-8c07-4737-b56e-4f57046f004c', NULL, 'Demo',               'exited-cdb217e0-8c07-4737-b56e-4f57046f004c', 'member', 'exited', 'manjubsna@gmail.com'),
  ('b733fa08-9e26-4de0-ae2b-fe30e4ce8093', NULL, 'Manj demo',          'exited-b733fa08-9e26-4de0-ae2b-fe30e4ce8093', 'member', 'exited', 'manjubsna321@gmail.com');

-- ============================================================
-- SETTINGS
-- ============================================================
INSERT INTO settings (id, value) VALUES
  ('rules', '{
    "dueDay": 5,
    "minimumReserve": 5000,
    "monthlyDeposit": 2000,
    "annualRenewalRule": "Decided in annual meeting",
    "loanInterestRateMonthly": 1.25,
    "presidentDecemberDeposit": 0,
    "vicePresidentDecemberDeposit": 1250
  }'::jsonb),
  ('emi_settings', '{"enabled": false, "interestRate": 1.5}'::jsonb),
  ('bank_balance', '{"amount": 231770, "source": "initial", "updatedAt": "2026-05-14"}'::jsonb),
  ('available_loan_balance', '{"amount": 10335}'::jsonb),
  ('active_year_info', '{
    "yearClosed": false,
    "activeYearExits": [{"name": "Sarpabhushana Banakar", "payout": 121834}],
    "activeYearLabel": "Sixth Year",
    "activeYearNumber": 6,
    "activeYearRenewalFee": 21000
  }'::jsonb);

-- ============================================================
-- DEPOSIT SUMMARIES (Years 1–6)
-- ============================================================
INSERT INTO deposit_summaries (year, label, principal, interest, expenditure, exit_payouts, balance) VALUES
  (2021, 'First Year (2021-2022)',   111000,  8700,   5600, 0,      114100),
  (2022, 'Second Year (2022-2023)',  149000, 33600,  13000, 0,      169600),
  (2023, 'Third Year (2023-2024)',   159500, 45700,  17750, 0,      187450),
  (2024, 'Fourth Year (2024-2025)', 126000,  57300,  33385, 0,      149915),
  (2025, 'Fifth Year (2025)',        149000, 103350, 20580, 0,      231770),
  (2026, 'Sixth Year (2025-2026)',        0,      0,     0, 121834,      0);

-- ============================================================
-- CURRENT LOANS (all active)
-- ============================================================
INSERT INTO current_loans (member_name, member_phone, principal, principal_paid, interest_rate_monthly, monthly_interest, loan_type, notes, status, disbursed_at, renewal_or_return_date, emis_paid) VALUES
  ('Appanna Banakar',   '8217526323', 134016.93, 37226.90, 5.556, 7445.38, 'full', 'emi_entry', 'active', '2026-01-01', '2027-06-01', 0),
  ('Pratap Banakar',    '7259907409',  50000.00,     0.00, 1.25,     0.00, 'full', NULL,        'active', '2025-10-15', '2026-12-15', 0),
  ('Pradeep Banakar',   '9663644751', 100000.00,     0.00, 1.25,     0.00, 'full', NULL,        'active', '2025-10-15', '2027-03-15', 0),
  ('Pratap Banakar',    '7259907409',  60000.00,     0.00, 1.25,     0.00, 'full', NULL,        'active', '2025-10-15', '2027-05-15', 0),
  ('Pradeep Banakar',   '9663644751', 100000.00,     0.00, 1.25,     0.00, 'full', NULL,        'active', '2025-10-15', '2026-11-15', 0),
  ('Praveen Banakar',   '9538913204', 200000.00,     0.00, 1.25,     0.00, 'full', NULL,        'active', '2026-04-15', '2027-04-15', 0),
  ('Pratap Banakar',    '7259907409',  50000.00,     0.00, 1.25,     0.00, 'full', NULL,        'active', '2025-11-15', '2027-11-15', 0),
  ('Manjunath Banakar', '9591382942', 100000.00,     0.00, 1.25,     0.00, 'full', NULL,        'active', '2025-10-15', '2027-06-15', 0),
  ('Santhosha Banakar', '9739678816', 100000.00,     0.00, 1.25,     0.00, 'full', NULL,        'active', '2026-06-07', '2027-06-07', 0),
  ('Pratap Banakar',    '7259907409', 140000.00,     0.00, 1.25,     0.00, 'full', NULL,        'active', '2025-10-15', '2028-06-15', 0),
  ('Manjunath Banakar', '9591382942', 100000.00,     0.00, 1.25,  1250.00, 'full', NULL,        'active', '2026-07-10', '2027-07-10', 0);

-- ============================================================
-- MONTHLY PAYMENTS — July 2026
-- (This is the only month with clean data in DB)
-- ============================================================
INSERT INTO monthly_payments (profile_id, month, expected_amount, paid_amount, status, source) VALUES
  ('4316a1c2-e94d-498a-86e7-544a93e9efb4', '2026-07', 9445.00, 9445.00, 'paid', 'manual'),  -- Halaswamy (Appanna EMI)
  ('f0526e8f-e31f-4fb0-a237-85b6497ca97b', '2026-07', 3250.00, 3250.00, 'paid', 'manual'),  -- Manjunath
  ('b9cb1f18-c556-4224-b94c-01c55ca6361c', '2026-07', 2000.00, 2000.00, 'paid', 'manual'),  -- Mukkanna
  ('598c6ccd-7c1e-45af-9fb0-ea34935bf094', '2026-07', 3250.00, 3250.00, 'paid', 'manual'),  -- Santhosha
  ('c54ddef5-9ead-4d21-a1fd-05ec305e9e15', '2026-07', 4500.00, 4500.00, 'paid', 'manual'),  -- Banakar P S (Praveen)
  ('6874d44c-cb73-4959-9824-92c168cde5a9', '2026-07', 5750.00, 5750.00, 'paid', 'manual'),  -- Pratap
  ('7e7790b5-424c-4ebd-8188-07298481ec07', '2026-07', 4500.00, 4500.00, 'paid', 'manual');  -- Pradeep
