-- Run this in Supabase SQL Editor.
-- Current active loans are verified from:
-- /Users/manjunathbanakar/Downloads/Loan_Records_2025-26_2026-05-16.pdf
--
-- Imports loan data into:
-- 1) public.loans for current active loans
-- 2) public.loan_history for closed/clear historical loans
--
-- Old loan IDs are stored only as legacy references. Supabase IDs remain primary.

alter table public.profiles drop constraint if exists profiles_status_check;
alter table public.profiles add constraint profiles_status_check
  check (status in ('pending', 'active', 'rejected', 'disabled', 'exited'));

alter table public.loans add column if not exists legacy_loan_id text;
alter table public.loans add column if not exists renewal_or_return_date date;

create table if not exists public.loan_history (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id),
  legacy_loan_id text,
  year text not null,
  member_name text not null,
  from_date date,
  principal numeric(12,2) not null default 0,
  monthly_interest numeric(12,2) not null default 0,
  interest_text text,
  renewal_or_return text,
  status text not null default 'Clear',
  total_paid numeric(12,2) not null default 0,
  is_interest_free boolean not null default false,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.loan_history enable row level security;

drop policy if exists "loan history readable by authenticated users" on public.loan_history;
drop policy if exists "loan history admin write" on public.loan_history;

create policy "loan history readable by authenticated users"
  on public.loan_history for select
  to authenticated
  using (public.is_admin() or profile_id = public.current_profile_id());

create policy "loan history admin write"
  on public.loan_history for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

update public.profiles
set status = 'exited'
where lower(full_name) like 'sarpabhushana%';

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

with active_loans(member_name, legacy_loan_id, principal, disbursed_at, renewal_or_return_date) as (
  values
    ('Pratap', 'SMA-25-007', 140000::numeric, '2025-10-15'::date, '2026-06-15'::date),
    ('Pratap', 'SMA-25-002',  50000::numeric, '2025-10-15'::date, '2026-12-15'::date),
    ('Pradeep', 'SMA-25-004', 100000::numeric, '2025-10-15'::date, '2027-03-15'::date),
    ('Pratap', 'SMA-25-005',  60000::numeric, '2025-10-15'::date, '2026-05-15'::date),
    ('Pradeep', 'SMA-25-001', 100000::numeric, '2025-10-15'::date, '2026-11-15'::date),
    ('Manjunath', 'SMA-25-006', 100000::numeric, '2025-10-15'::date, '2026-06-15'::date),
    ('Pratap', 'SMA-25-010',  50000::numeric, '2025-11-15'::date, '2026-11-15'::date),
    ('Praveen', 'SMA-26-001', 200000::numeric, '2026-04-15'::date, '2027-04-15'::date)
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
  p.id,
  a.legacy_loan_id,
  a.principal,
  0,
  1.25,
  false,
  'active',
  'Imported active loan from PDF Loan_Records_2025-26_2026-05-16.pdf',
  a.disbursed_at,
  a.renewal_or_return_date
from active_loans a
join public.profiles p on lower(p.full_name) like lower(a.member_name) || '%';

delete from public.loan_history
where notes in (
  'Imported clear loan from old records',
  'Exited member record retained for history',
  'Imported clear loan from PDF Loan_Records_2025-26_2026-05-16.pdf',
  'Exited member record retained from PDF Loan_Records_2025-26_2026-05-16.pdf'
);

with history(year, legacy_loan_id, member_name, from_date, principal, monthly_interest, interest_text, renewal_or_return, status, total_paid, is_interest_free) as (
  values
    ('2023-24','SMA-24-001','Santosh','2025-04-24'::date,30000::numeric,450::numeric,'450','May 24, 2025','Clear',450::numeric,false),
    ('2023-24','SMA-24-002','Pratap','2025-04-24'::date,140000::numeric,2100::numeric,'2100','Jun 25, 2025','Clear',14700::numeric,false),
    ('2023-24','SMA-24-003','Manjunath','2025-04-24'::date,100000::numeric,1500::numeric,'1500','Dec 24, 2025','Clear',10500::numeric,false),
    ('2023-24','SMA-24-004','Pratap','2025-04-24'::date,50000::numeric,750::numeric,'750','Dec 24, 2025','Clear',5250::numeric,false),
    ('2023-24','SMA-24-005','Pradeep','2025-04-24'::date,100000::numeric,1500::numeric,'1500','Mar 25, 2025','Clear',10500::numeric,false),
    ('2023-24','SMA-24-006','Santosh','2025-04-24'::date,100000::numeric,1500::numeric,'1500','Apr 25, 2025','Clear',10500::numeric,false),
    ('2023-24','SMA-24-007','Pratap','2025-05-24'::date,60000::numeric,900::numeric,'900','May 25, 2025','Clear',5400::numeric,false),
    ('2023-24','SMA-24-008','Pradeep','2025-11-24'::date,100000::numeric,1500::numeric,'1500','Nov 25, 2025','Clear',0::numeric,false),
    ('2024-25','SMA-24-003','Manjunath','2025-12-24'::date,100000::numeric,1500::numeric,'1500','Dec 24, 2025','Clear',1500::numeric,false),
    ('2024-25','SMA-24-006','Santosh','2025-12-24'::date,100000::numeric,1500::numeric,'1500','Apr 25, 2025','Clear',6000::numeric,false),
    ('2024-25','SMA-24-002','Pratap','2025-12-24'::date,140000::numeric,2100::numeric,'2100','Jun 26, 2025','Clear',21000::numeric,false),
    ('2024-25','SMA-24-004','Pratap','2025-12-24'::date,50000::numeric,750::numeric,'750','Dec 25, 2025','Clear',7500::numeric,false),
    ('2024-25','SMA-24-005','Pradeep','2025-12-24'::date,100000::numeric,1500::numeric,'1500','Mar 26, 2025','Clear',15000::numeric,false),
    ('2024-25','SMA-24-007','Pratap','2025-12-24'::date,60000::numeric,900::numeric,'900','May 26, 2025','Clear',9000::numeric,false),
    ('2024-25','SMA-24-008','Pradeep','2025-11-24'::date,100000::numeric,1500::numeric,'1500','Nov 25, 2025','Clear',16500::numeric,false),
    ('2024-25','SMA-25-001','Sarpabhushana','2025-12-24'::date,30000::numeric,450::numeric,'450','Dec 25, 2025','Clear',4500::numeric,false),
    ('2024-25','SMA-25-002','Santosh','2025-12-24'::date,40000::numeric,600::numeric,'600','Jul 25, 2025','Clear',4200::numeric,false),
    ('2024-25','SMA-25-003','Praveen','2025-02-25'::date,70000::numeric,1050::numeric,'1050','May 26, 2025','Clear',3150::numeric,false),
    ('2024-25','SMA-25-004','Manjunath','2025-04-15'::date,100000::numeric,1500::numeric,'1500','Jul 25, 2025','Clear',4500::numeric,false),
    ('2024-25','SMA-25-005','Manjunath','2025-06-15'::date,100000::numeric,1500::numeric,'1500','Jun 26, 2025','Clear',6000::numeric,false),
    ('2024-25','SMA-25-006','Praveen','2025-07-15'::date,100000::numeric,1500::numeric,'1500','Oct 25, 2025','Clear',4500::numeric,false),
    ('2025-26','SMA-25-003','Sarpabhushana','2025-10-15'::date,30000::numeric,375::numeric,'375','Mar 15, 2026','Clear',1875::numeric,false),
    ('2025-26','SMA-25-008','Sarpabhushana','2025-10-15'::date,100000::numeric,1250::numeric,'1250','Mar 15, 2026','Clear',6250::numeric,false),
    ('2025-26','SMA-25-009','Sarpabhushana','2025-10-15'::date,70000::numeric,0::numeric,'Interest Free','Monthly EMI','Clear',0::numeric,true)
)
insert into public.loan_history (
  profile_id,
  legacy_loan_id,
  year,
  member_name,
  from_date,
  principal,
  monthly_interest,
  interest_text,
  renewal_or_return,
  status,
  total_paid,
  is_interest_free,
  notes
)
select
  p.id,
  h.legacy_loan_id,
  h.year,
  h.member_name,
  h.from_date,
  h.principal,
  h.monthly_interest,
  h.interest_text,
  h.renewal_or_return,
  h.status,
  h.total_paid,
  h.is_interest_free,
  case
    when lower(h.member_name) = 'sarpabhushana' then 'Exited member record retained from PDF Loan_Records_2025-26_2026-05-16.pdf'
    when h.year = '2025-26' then 'Imported clear loan from PDF Loan_Records_2025-26_2026-05-16.pdf'
    else 'Imported clear loan from old records'
  end
from history h
left join public.profiles p on lower(p.full_name) like lower(h.member_name) || '%';

select
  'PDF active loan import summary' as result,
  count(*) as active_loans,
  coalesce(sum(principal - principal_paid), 0) as active_principal,
  coalesce(sum(
    case
      when is_interest_free then 0
      else round((principal - principal_paid) * interest_rate_monthly / 100, 2)
    end
  ), 0) as monthly_interest
from public.loans
where status = 'active'
and legacy_loan_id in (
  'SMA-25-007', 'SMA-25-002', 'SMA-25-004', 'SMA-25-005',
  'SMA-25-001', 'SMA-25-006', 'SMA-25-010', 'SMA-26-001'
);
