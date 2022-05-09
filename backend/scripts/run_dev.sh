#!/bin/bash
echo "django shell commands for local development"

echo "waiting 5 seconds for local DB server"
sleep 5

python ./manage.py migrate

python ./manage.py loaddata dev_users.json

echo "Starting django server on 0.0.0.0:8000"
exec python ./manage.py runserver 0.0.0.0:8000
