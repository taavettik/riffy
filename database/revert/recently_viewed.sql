-- Revert riffy:recently_viewed from pg

BEGIN;

DROP TABLE view_history;

COMMIT;
