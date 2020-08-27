-- Deploy riffy:users to pg

BEGIN;

CREATE TABLE account (
  id            uuid NOT NULL PRIMARY KEY default uuid_generate_v4(),
  name          text NOT NULL,
  password_hash text NOT NULL
);

COMMIT;
