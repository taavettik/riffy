-- Deploy riffy:tab_favourite to pg

BEGIN;

ALTER TABLE tab
ADD COLUMN is_favourite BOOLEAN NOT NULL DEFAULT false;

COMMIT;
