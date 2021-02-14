-- Deploy riffy:tab_isrc to pg

BEGIN;

ALTER TABLE tab
ADD COLUMN isrc TEXT;

COMMIT;
