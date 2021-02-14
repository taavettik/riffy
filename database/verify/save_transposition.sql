-- Verify riffy:save_transposition on pg

BEGIN;

SELECT transposition FROM view_history;

ROLLBACK;
