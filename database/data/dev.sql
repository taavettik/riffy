BEGIN;

INSERT INTO account (id, name, password_hash)
VALUES (
  '7b8c8e58-a8b0-4a8c-b1f1-21c3b0a14407', 'admin', '$argon2i$v=19$m=4096,t=3,p=1$XIMeJeo0i389fbCifOuN1w$Oywp5BmW4lBnmwPhlUsTIHUMX6hvRJ//wvpKoXJ2Grs'
) ON CONFLICT (id) DO NOTHING;

COMMIT;