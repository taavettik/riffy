BEGIN;

INSERT INTO account (id, name, password_hash)
VALUES (
  -- admin / soitin
  '7b8c8e58-a8b0-4a8c-b1f1-21c3b0a14407', 'admin', '$2b$10$f05/QyzHzYurVHUBqv0RUu24yvDjua0ZTALZm2hFKB4nEK/BlwJSa'
) ON CONFLICT (id) DO NOTHING;

COMMIT;