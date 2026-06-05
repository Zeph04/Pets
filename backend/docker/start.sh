#!/bin/sh
set -e

echo "==> Running migrations..."
php artisan migrate --force

echo "==> Seeding roles & admin..."
php artisan db:seed --force

echo "==> Caching config and routes..."
php artisan config:cache
php artisan route:cache

echo "==> Creating storage symlink..."
php artisan storage:link || true

echo "==> Starting PHP-FPM in background..."
php-fpm -D

echo "==> Starting Nginx..."
exec nginx -g "daemon off;"
