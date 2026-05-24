-- Run this in Supabase SQL Editor.
-- When a loan request is approved, notify ALL active members.
-- When rejected, notify only the borrower (unchanged).

create or replace function public.notify_member_on_loan_decision()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  member_rec   record;
  borrower_name text;
begin
  if OLD.status = NEW.status then return NEW; end if;
  if NEW.status not in ('approved', 'rejected') then return NEW; end if;

  if NEW.status = 'approved' then
    -- Get borrower name for the broadcast message
    select full_name into borrower_name
    from public.profiles
    where id = NEW.profile_id;

    -- Notify ALL active members
    for member_rec in
      select id from public.profiles where status = 'active'
    loop
      if member_rec.id = NEW.profile_id then
        -- Personal message to the borrower
        insert into public.notifications (profile_id, type, title, body, related_id)
        values (
          member_rec.id,
          'loan_approved',
          'Loan request approved',
          'Your loan request of ₹' || NEW.amount::text || ' has been approved.',
          NEW.id
        );
      else
        -- Broadcast to all other members
        insert into public.notifications (profile_id, type, title, body, related_id)
        values (
          member_rec.id,
          'loan_approved_broadcast',
          'Loan approved',
          coalesce(borrower_name, 'A member') || ' has been approved for a loan of ₹' || NEW.amount::text || '.',
          NEW.id
        );
      end if;
    end loop;

  else
    -- Rejected: notify only the borrower
    insert into public.notifications (profile_id, type, title, body, related_id)
    values (
      NEW.profile_id,
      'loan_rejected',
      'Loan request not approved',
      'Your loan request of ₹' || NEW.amount::text || ' was not approved. Contact the president.',
      NEW.id
    );
  end if;

  return NEW;
end;
$$;

drop trigger if exists trg_notify_member_loan_decision on public.loan_requests;
create trigger trg_notify_member_loan_decision
  after update on public.loan_requests
  for each row execute function public.notify_member_on_loan_decision();
