-- Run this once in Supabase SQL Editor if the original seed already used 9000000001.
-- It changes the president/admin phone to Manjunath's real number.

update public.profiles
set phone = '9591382942',
    full_name = 'Manjunath Banakar',
    role = 'president',
    status = 'active'
where phone = '9000000001'
   or (full_name = 'Manjunath Banakar' and role = 'president');
