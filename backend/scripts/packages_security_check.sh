#!/bin/bash

pip install pipenv pipenv-to-requirements safety && pipenv run pipenv_to_requirements -f && safety check --file requirements.txt
