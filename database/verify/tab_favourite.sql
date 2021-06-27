-- Verify riffy:tab_favourite on pg

BEGIN;

SELECT is_favourite FROM tab;

ROLLBACK;
