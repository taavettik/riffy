-- Revert riffy:users from pg

BEGIN;

DROP TABLE account;

COMMIT;
