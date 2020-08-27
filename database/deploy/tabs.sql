-- Deploy riffy:tabs to pg

BEGIN;

CREATE TABLE tab (
  id            uuid NOT NULL PRIMARY KEY default uuid_generate_v4(),
  account_id    uuid NOT NULL,
  track_title   text NOT NULL,
  track_artist  text,
  chords        text NOT NULL,
  CONSTRAINT fk_account FOREIGN KEY(account_id) REFERENCES account(id)
);

COMMIT;
