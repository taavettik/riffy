-- Deploy riffy:favourite_tabs to pg

BEGIN;

CREATE TABLE favourite_tab (
  account_id  uuid NOT NULL,
  tab_url     TEXT NOT NULL,
  PRIMARY KEY (account_id, tab_url)
);

COMMIT;
