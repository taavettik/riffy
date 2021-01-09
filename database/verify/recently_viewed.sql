-- Verify riffy:recently_viewed on pg

BEGIN;

SELECT * FROM recently_viewed;

ROLLBACK;
