-- Deploy riffy:recently_viewed to pg

BEGIN;

CREATE TABLE view_history (
  tab_id uuid,
  tab_url TEXT,
  account_id uuid NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT fk_account FOREIGN KEY(account_id) REFERENCES account(id),
  CONSTRAINT fk_tab FOREIGN KEY(tab_id) REFERENCES tab(id),
  CONSTRAINT ux_id_account UNIQUE (tab_id, account_id),
  CONSTRAINT ux_url_account UNIQUE (tab_url, account_id)
);

COMMIT;
