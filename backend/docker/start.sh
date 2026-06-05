#!/bin/sh
set -e

echo "==> Running migrations..."
php artisan migrate --force

echo "==> Seeding roles & admin..."
php artisan db:seed --force

echo "==> Caching config, routes and views..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "==> Creating storage symlink..."
php artisan storage:link || true

echo "==> Starting PHP-FPM in background..."
php-fpm -D

echo "==> Starting Nginx..."
exec nginx -g "daemon off;"
