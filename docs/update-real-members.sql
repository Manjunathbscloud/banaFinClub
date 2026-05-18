-- Run this in Supabase SQL Editor to update the real Banakar FinClub members.
-- This keeps demo/test accounts separate because current-loan matching is by phone only.

with real_members(full_name, phone, role, status) as (
  values
    ('Manjunath Banakar', '9591382942', 'president', 'active'),
    ('Pratap Banakar', '7259907409', 'vice_president', 'active'),
    ('Praveen Banakar', '9538913204', 'member', 'active'),
    ('Mukkanna Banakar', '8618600807', 'member', 'active'),
    ('Santosh Banakar', '9739678816', 'member', 'active'),
    ('Pradeep Banakar', '9663644751', 'member', 'active'),
    ('Appanna Banakar', '8217526323', 'member', 'active')
),
updated as (
  update public.profiles p
  set
    phone = r.phone,
    role = r.role,
    status = r.status
  from real_members r
  where lower(p.full_name) = lower(r.full_name)
    and (
      p.phone = r.phone
      or p.phone like '900000000%'
      or p.auth_user_id is null
    )
  returning p.full_name
)
insert into public.profiles (full_name, phone, role, status)
select r.full_name, r.phone, r.role, r.status
from real_members r
where not exists (
  select 1
  from public.profiles p
  where p.phone = r.phone
);

update public.profiles
set status = 'exited'
where lower(full_name) like 'sarpabhushana%'
  and auth_user_id is null;

select full_name, phone, role, status, auth_user_id is not null as has_login
from public.profiles
where phone in (
  '9591382942',
  '7259907409',
  '9538913204',
  '8618600807',
  '9739678816',
  '9663644751',
  '8217526323'
)
order by role, full_name;
