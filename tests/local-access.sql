-- Run ONLY against the disposable local Supabase stack. All fixtures roll back.
begin;
insert into auth.users (id, email, raw_user_meta_data) values
('aa000001-0000-4000-8000-000000000001', 'teacher@example.test', '{"full_name":"Test Teacher"}'),
('aa000002-0000-4000-8000-000000000002', 'learner@example.test', '{"full_name":"Test Learner"}'),
('aa000003-0000-4000-8000-000000000003', 'outsider@example.test', '{"full_name":"Test Outsider"}');

set local role authenticated;
select set_config('request.jwt.claim.sub', 'aa000002-0000-4000-8000-000000000002', true);
insert into public.sessions (id, teacher_id, learner_id, skill_id, goal)
values (987654321, 'aa000001-0000-4000-8000-000000000001', 'aa000002-0000-4000-8000-000000000002',
  (select min(id) from public.skills), 'Test a private learning room');
do $$
declare rejected boolean := false;
begin
  begin
    update public.sessions set status = 'accepted' where id = 987654321;
  exception when raise_exception then
    if sqlerrm <> 'Invalid session status transition' then raise; end if;
    rejected := true;
  end;
  if not rejected then raise exception 'Learner incorrectly accepted their own request'; end if;
end $$;

select set_config('request.jwt.claim.sub', 'aa000001-0000-4000-8000-000000000001', true);
update public.sessions set status = 'accepted' where id = 987654321;
insert into public.messages (session_id, sender_id, content)
values (987654321, 'aa000001-0000-4000-8000-000000000001', 'Private fixture lesson');

select set_config('request.jwt.claim.sub', 'aa000003-0000-4000-8000-000000000003', true);
do $$
declare affected integer; rejected boolean := false;
begin
  if exists (select 1 from public.sessions where id = 987654321) then raise exception 'Outsider read a session'; end if;
  if exists (select 1 from public.messages where session_id = 987654321) then raise exception 'Outsider read chat'; end if;
  update public.sessions set lesson_notes = 'Unauthorized' where id = 987654321;
  get diagnostics affected = row_count;
  if affected <> 0 then raise exception 'Outsider edited a session'; end if;
  begin
    insert into public.messages (session_id, sender_id, content)
    values (987654321, 'aa000003-0000-4000-8000-000000000003', 'Unauthorized');
  exception when insufficient_privilege then rejected := true;
  end;
  if not rejected then raise exception 'Outsider wrote chat'; end if;
end $$;

select set_config('request.jwt.claim.sub', 'aa000002-0000-4000-8000-000000000002', true);
do $$
begin
  if (select count(*) from public.messages where session_id = 987654321) <> 1 then raise exception 'Participant cannot read chat'; end if;
  if (select status from public.sessions where id = 987654321) <> 'accepted' then raise exception 'Teacher acceptance was not persisted'; end if;
end $$;
rollback;
