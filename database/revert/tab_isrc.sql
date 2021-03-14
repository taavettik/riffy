-- Revert riffy:tab_isrc from pg

BEGIN;

ALTER TABLE tab
DROP COLUMN isrc;

COMMIT;
