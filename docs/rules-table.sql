-- Run this in Supabase SQL Editor

create table if not exists public.rules (
  id          uuid primary key default gen_random_uuid(),
  section     text not null,
  item        text not null,
  sort_order  integer default 0,
  is_active   boolean default true,
  created_at  timestamptz default now()
);

alter table public.rules enable row level security;

create policy "rules_select"  on public.rules for select to authenticated using (true);
create policy "rules_insert"  on public.rules for insert to authenticated with check (true);
create policy "rules_update"  on public.rules for update to authenticated using (true);
create policy "rules_delete"  on public.rules for delete to authenticated using (true);

-- Seed with existing rules
insert into public.rules (section, item, sort_order) values
  ('Membership Rules', 'All members must attend monthly meetings', 1),
  ('Membership Rules', 'Monthly contribution of ₹2,000 is mandatory by the 15th of each month', 2),
  ('Membership Rules', 'Members must maintain active participation in association activities', 3),
  ('Membership Rules', 'New members require approval from all existing members', 4),
  ('Membership Rules', 'Members may exit by settling all outstanding loans; share value will be calculated at exit', 5),
  ('Loan Rules', 'Loan interest rate is 1.25% per month on the total loan amount', 1),
  ('Loan Rules', 'Interest is collected monthly from the borrower', 2),
  ('Loan Rules', 'Loans are subject to renewal; renewal date set at time of approval', 3),
  ('Loan Rules', 'Loan applications require approval from the President', 4),
  ('Loan Rules', 'Repayment of principal is made at renewal or as agreed', 5),
  ('Loan Rules', 'Outstanding loan is offset against share value upon member exit', 6),
  ('New Member Rules', 'New members require unanimous approval from existing members', 1),
  ('New Member Rules', 'Joining amount equals the current share value plus an additional 10%', 2),
  ('New Member Rules', 'EMI installments over 18 months are available for the joining amount', 3),
  ('New Member Rules', 'New member also pays monthly deposit and yearly renewal fee from joining month', 4),
  ('New Member Rules', 'Yearly renewal fee is ₹3,000 per member from Year 6 onwards', 5),
  ('Administrative Guidelines', 'President and Vice President are elected at the annual meeting', 1),
  ('Administrative Guidelines', 'Monthly meetings are held on the first Sunday of each month', 2),
  ('Administrative Guidelines', 'Annual meeting is held in October/November each year', 3),
  ('Administrative Guidelines', 'All major financial decisions require majority vote at the annual meeting', 4),
  ('Administrative Guidelines', 'Financial records must be maintained transparently and shared with all members', 5),
  ('Administrative Guidelines', 'Association established February 2021; extended to 10 years at 5th annual meeting (October 2025)', 6),
  ('Administrative Guidelines', 'President is exempt from December monthly deposit; Vice President pays ₹1,250 in December', 7),
  ('Exit Rules', 'A member wishing to exit must inform the President at least one month in advance', 1),
  ('Exit Rules', 'Outstanding loans will be deducted from the member share value at exit', 2),
  ('Exit Rules', 'If loans exceed share value, the net amount is payable by the member to the association', 3),
  ('Exit Rules', 'If share value exceeds loans, the net amount is paid to the exiting member', 4),
  ('Exit Rules', 'Exit settlement is final and agreed upon by all members', 5);
