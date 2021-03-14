-- Deploy riffy:save_transposition to pg

BEGIN;

ALTER TABLE view_history
ADD COLUMN transposition INTEGER;

COMMIT;
