-- RESTORE from _snap_ tables (run this after testing to reset to pre-test state)
-- Run in Supabase SQL Editor (prod DB: ighugnwxcrcycoydvflt)
-- Restores every table the snapshot copies. No CASCADE: if another table still points
-- at one of these, the whole restore stops with an error and nothing is changed.

BEGIN;

-- Inserting notification rows would fire the webhook and re-send email/SMS/push.
ALTER TABLE notifications DISABLE TRIGGER USER;

TRUNCATE
  game_players, game_sessions,
  audit_logs, push_subscriptions, messages, notifications,
  gallery_photos, meeting_acknowledgements, meeting_records,
  loan_history, loan_partial_payments, partial_repayment_requests,
  loan_interest_payments, loan_emis, loan_extension_requests, loan_requests,
  monthly_payments, statements, deposit_summaries, current_loans,
  rules, settings, profiles;

INSERT INTO profiles                   SELECT * FROM _snap_profiles;
INSERT INTO settings                   SELECT * FROM _snap_settings;
INSERT INTO rules                      SELECT * FROM _snap_rules;
INSERT INTO current_loans              SELECT * FROM _snap_current_loans;
INSERT INTO deposit_summaries          SELECT * FROM _snap_deposit_summaries;
INSERT INTO statements                 SELECT * FROM _snap_statements;
INSERT INTO monthly_payments           SELECT * FROM _snap_monthly_payments;
INSERT INTO loan_requests              SELECT * FROM _snap_loan_requests;
INSERT INTO loan_extension_requests    SELECT * FROM _snap_loan_extension_requests;
INSERT INTO loan_emis                  SELECT * FROM _snap_loan_emis;
INSERT INTO loan_interest_payments     SELECT * FROM _snap_loan_interest_payments;
INSERT INTO partial_repayment_requests SELECT * FROM _snap_partial_repayment_requests;
INSERT INTO loan_partial_payments      SELECT * FROM _snap_loan_partial_payments;
INSERT INTO loan_history               SELECT * FROM _snap_loan_history;
INSERT INTO meeting_records            SELECT * FROM _snap_meeting_records;
INSERT INTO meeting_acknowledgements   SELECT * FROM _snap_meeting_acknowledgements;
INSERT INTO gallery_photos             SELECT * FROM _snap_gallery_photos;
INSERT INTO notifications              SELECT * FROM _snap_notifications;
INSERT INTO messages                   SELECT * FROM _snap_messages;
INSERT INTO push_subscriptions         SELECT * FROM _snap_push_subscriptions;
INSERT INTO audit_logs                 SELECT * FROM _snap_audit_logs;
INSERT INTO game_sessions              SELECT * FROM _snap_game_sessions;
INSERT INTO game_players               SELECT * FROM _snap_game_players;

ALTER TABLE notifications ENABLE TRIGGER USER;

COMMIT;

-- Verify: every row should show the same count in both columns
SELECT t.tbl, t.live, t.snap, CASE WHEN t.live = t.snap THEN 'ok' ELSE 'MISMATCH' END AS check
FROM (
            SELECT 'profiles' AS tbl, (SELECT COUNT(*) FROM profiles) AS live, (SELECT COUNT(*) FROM _snap_profiles) AS snap
  UNION ALL SELECT 'settings', (SELECT COUNT(*) FROM settings), (SELECT COUNT(*) FROM _snap_settings)
  UNION ALL SELECT 'rules', (SELECT COUNT(*) FROM rules), (SELECT COUNT(*) FROM _snap_rules)
  UNION ALL SELECT 'current_loans', (SELECT COUNT(*) FROM current_loans), (SELECT COUNT(*) FROM _snap_current_loans)
  UNION ALL SELECT 'deposit_summaries', (SELECT COUNT(*) FROM deposit_summaries), (SELECT COUNT(*) FROM _snap_deposit_summaries)
  UNION ALL SELECT 'statements', (SELECT COUNT(*) FROM statements), (SELECT COUNT(*) FROM _snap_statements)
  UNION ALL SELECT 'monthly_payments', (SELECT COUNT(*) FROM monthly_payments), (SELECT COUNT(*) FROM _snap_monthly_payments)
  UNION ALL SELECT 'loan_requests', (SELECT COUNT(*) FROM loan_requests), (SELECT COUNT(*) FROM _snap_loan_requests)
  UNION ALL SELECT 'loan_extension_requests', (SELECT COUNT(*) FROM loan_extension_requests), (SELECT COUNT(*) FROM _snap_loan_extension_requests)
  UNION ALL SELECT 'loan_emis', (SELECT COUNT(*) FROM loan_emis), (SELECT COUNT(*) FROM _snap_loan_emis)
  UNION ALL SELECT 'loan_interest_payments', (SELECT COUNT(*) FROM loan_interest_payments), (SELECT COUNT(*) FROM _snap_loan_interest_payments)
  UNION ALL SELECT 'partial_repayment_requests', (SELECT COUNT(*) FROM partial_repayment_requests), (SELECT COUNT(*) FROM _snap_partial_repayment_requests)
  UNION ALL SELECT 'loan_partial_payments', (SELECT COUNT(*) FROM loan_partial_payments), (SELECT COUNT(*) FROM _snap_loan_partial_payments)
  UNION ALL SELECT 'loan_history', (SELECT COUNT(*) FROM loan_history), (SELECT COUNT(*) FROM _snap_loan_history)
  UNION ALL SELECT 'meeting_records', (SELECT COUNT(*) FROM meeting_records), (SELECT COUNT(*) FROM _snap_meeting_records)
  UNION ALL SELECT 'meeting_acknowledgements', (SELECT COUNT(*) FROM meeting_acknowledgements), (SELECT COUNT(*) FROM _snap_meeting_acknowledgements)
  UNION ALL SELECT 'gallery_photos', (SELECT COUNT(*) FROM gallery_photos), (SELECT COUNT(*) FROM _snap_gallery_photos)
  UNION ALL SELECT 'notifications', (SELECT COUNT(*) FROM notifications), (SELECT COUNT(*) FROM _snap_notifications)
  UNION ALL SELECT 'messages', (SELECT COUNT(*) FROM messages), (SELECT COUNT(*) FROM _snap_messages)
  UNION ALL SELECT 'push_subscriptions', (SELECT COUNT(*) FROM push_subscriptions), (SELECT COUNT(*) FROM _snap_push_subscriptions)
  UNION ALL SELECT 'audit_logs', (SELECT COUNT(*) FROM audit_logs), (SELECT COUNT(*) FROM _snap_audit_logs)
  UNION ALL SELECT 'game_sessions', (SELECT COUNT(*) FROM game_sessions), (SELECT COUNT(*) FROM _snap_game_sessions)
  UNION ALL SELECT 'game_players', (SELECT COUNT(*) FROM game_players), (SELECT COUNT(*) FROM _snap_game_players)
) t;
