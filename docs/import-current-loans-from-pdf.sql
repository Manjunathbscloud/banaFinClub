-- Run this in Supabase SQL Editor to correct only the Current loan book.
-- Source of truth:
-- /Users/manjunathbanakar/Downloads/Loan_Records_2025-26_2026-05-16.pdf
--
-- This script keeps only the 8 PDF rows marked Active in public.loans.
-- Clear rows from the PDF, including Sarpabhushana, are not inserted here.

alter table public.loans add column if not exists legacy_loan_id text;
alter table public.loans add column if not exists renewal_or_return_date date;

delete from public.loans
where legacy_loan_id in (
  'SMA-25-001', 'SMA-25-002', 'SMA-25-003', 'SMA-25-004',
  'SMA-25-005', 'SMA-25-006', 'SMA-25-007', 'SMA-25-008',
  'SMA-25-009', 'SMA-25-010', 'SMA-26-001'
)
or purpose in (
  'Imported active loan from old records',
  'Imported active loan from PDF Loan_Records_2025-26_2026-05-16.pdf'
);

with pdf_active_loans(member_name, legacy_loan_id, principal, disbursed_at, monthly_interest, renewal_or_return_date) as (
  values
    ('Pratap', 'SMA-25-007', 140000::numeric, '2025-10-15'::date, 1750::numeric, '2026-06-15'::date),
    ('Pratap', 'SMA-25-002',  50000::numeric, '2025-10-15'::date,  625::numeric, '2026-12-15'::date),
    ('Pradeep', 'SMA-25-004', 100000::numeric, '2025-10-15'::date, 1250::numeric, '2027-03-15'::date),
    ('Pratap', 'SMA-25-005',  60000::numeric, '2025-10-15'::date,  750::numeric, '2026-05-15'::date),
    ('Pradeep', 'SMA-25-001', 100000::numeric, '2025-10-15'::date, 1250::numeric, '2026-11-15'::date),
    ('Manjunath', 'SMA-25-006', 100000::numeric, '2025-10-15'::date, 1250::numeric, '2026-06-15'::date),
    ('Pratap', 'SMA-25-010',  50000::numeric, '2025-11-15'::date,  625::numeric, '2026-11-15'::date),
    ('Praveen', 'SMA-26-001', 200000::numeric, '2026-04-15'::date, 2500::numeric, '2027-04-15'::date)
),
matched_loans as (
  select
    p.id as profile_id,
    l.*
  from pdf_active_loans l
  join public.profiles p on lower(p.full_name) like lower(l.member_name) || '%'
)
insert into public.loans (
  profile_id,
  legacy_loan_id,
  principal,
  principal_paid,
  interest_rate_monthly,
  is_interest_free,
  status,
  purpose,
  disbursed_at,
  renewal_or_return_date
)
select
  profile_id,
  legacy_loan_id,
  principal,
  0,
  1.25,
  false,
  'active',
  'Imported active loan from PDF Loan_Records_2025-26_2026-05-16.pdf',
  disbursed_at,
  renewal_or_return_date
from matched_loans;

with pdf_active_loans(member_name, legacy_loan_id, principal, disbursed_at, monthly_interest, renewal_or_return_date) as (
  values
    ('Pratap', 'SMA-25-007', 140000::numeric, '2025-10-15'::date, 1750::numeric, '2026-06-15'::date),
    ('Pratap', 'SMA-25-002',  50000::numeric, '2025-10-15'::date,  625::numeric, '2026-12-15'::date),
    ('Pradeep', 'SMA-25-004', 100000::numeric, '2025-10-15'::date, 1250::numeric, '2027-03-15'::date),
    ('Pratap', 'SMA-25-005',  60000::numeric, '2025-10-15'::date,  750::numeric, '2026-05-15'::date),
    ('Pradeep', 'SMA-25-001', 100000::numeric, '2025-10-15'::date, 1250::numeric, '2026-11-15'::date),
    ('Manjunath', 'SMA-25-006', 100000::numeric, '2025-10-15'::date, 1250::numeric, '2026-06-15'::date),
    ('Pratap', 'SMA-25-010',  50000::numeric, '2025-11-15'::date,  625::numeric, '2026-11-15'::date),
    ('Praveen', 'SMA-26-001', 200000::numeric, '2026-04-15'::date, 2500::numeric, '2027-04-15'::date)
)
select
  'Current loan book from PDF' as result,
  count(loans.id) as active_loans_inserted,
  coalesce(sum(loans.principal - loans.principal_paid), 0) as active_principal,
  coalesce(sum(pdf_active_loans.monthly_interest), 0) as monthly_interest_from_pdf,
  string_agg(pdf_active_loans.member_name, ', ' order by pdf_active_loans.member_name)
    filter (where loans.id is null) as missing_profile_matches
from pdf_active_loans
left join public.loans loans on loans.legacy_loan_id = pdf_active_loans.legacy_loan_id
and loans.status = 'active'
and loans.purpose = 'Imported active loan from PDF Loan_Records_2025-26_2026-05-16.pdf';
