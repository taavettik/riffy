-- Revert riffy:save_transposition from pg

BEGIN;

ALTER TABLE view_history
DROP COLUMN transposition;

COMMIT;
