-- Revert riffy:tab_favourite from pg

BEGIN;

ALTER TABLE tab DROP COLUMN is_favourite;

COMMIT;
