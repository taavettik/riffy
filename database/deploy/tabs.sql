-- Deploy riffy:tabs to pg

BEGIN;

CREATE TABLE tab (
  id            uuid NOT NULL PRIMARY KEY default uuid_generate_v4(),
  track_title   text NOT NULL,
  track_artist  text,
  chords        text NOT NULL
);

COMMIT;
