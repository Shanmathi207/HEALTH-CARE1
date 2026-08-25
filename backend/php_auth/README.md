PHP Auth Service
================

This is a minimal PHP service to provide user auth CRUD endpoints backed by MySQL. It is intended to be consumed by the Node backend's adapter when `PHP_AUTH_API_URL` is set.

Files:
- `db.php` - PDO connection helper (reads `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS` from environment).
- `index.php` - Minimal REST endpoints for `/users` (GET/POST/DELETE).
- `create_tables.sql` - SQL to create `users` table.

Quick setup:

1. Create database and run `create_tables.sql`:

   mysql -u root -p smartcare_db < create_tables.sql

2. Put these files in your PHP webroot (or configure a virtual host), e.g. `http://localhost/php_auth/index.php`.

3. Set backend environment variable `PHP_AUTH_API_URL` to `http://localhost/php_auth` (no trailing slash recommended).

4. Ensure `DB_*` environment variables are available to PHP (via Apache/Nginx config or system env).

Example curl calls:

Get user by email:

  curl 'http://localhost/php_auth/users?email=alice@example.com'

Create/update user:

  curl -X POST http://localhost/php_auth/users -H 'Content-Type: application/json' -d '{"email":"alice@example.com","password":"$2a$10$...","name":"Alice"}'

Delete all users (use with caution):

  curl -X DELETE http://localhost/php_auth/users
