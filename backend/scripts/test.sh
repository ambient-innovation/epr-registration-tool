#!/bin/bash

coverage run manage.py test -v3 apps && coverage report --skip-covered --skip-empty && coverage xml -o /app/coverage/report.xml
