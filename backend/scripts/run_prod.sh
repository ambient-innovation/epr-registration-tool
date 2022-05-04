#!/bin/bash
echo "django shell commands for production"

python ./manage.py collectstatic --noinput
python ./manage.py migrate

# Start Gunicorn processes
echo Starting Gunicorn.
exec gunicorn apps.config.wsgi:application --bind 0.0.0.0:8000 --workers 3
