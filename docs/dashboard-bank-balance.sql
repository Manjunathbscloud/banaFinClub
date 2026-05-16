-- Run this once in Supabase SQL Editor.
-- It creates the shared Bank Balance setting used by the dashboard.
-- Future statement imports will update this value automatically.

insert into public.settings (id, value)
values (
  'bank_balance',
  '{
    "amount": 231770,
    "updatedAt": "2026-05-14",
    "source": "initial"
  }'::jsonb
)
on conflict (id) do nothing;

update public.settings
set value = jsonb_set(value, '{minimumReserve}', '5000'::jsonb, true),
    updated_at = now()
where id = 'rules';
