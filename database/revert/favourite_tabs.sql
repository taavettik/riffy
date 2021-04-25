-- Revert riffy:favourite_tabs from pg

BEGIN;

DROP TABLE favourite_tab;

COMMIT;
