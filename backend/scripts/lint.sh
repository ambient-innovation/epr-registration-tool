#!/bin/bash

flake8 -v --count && black --check --diff --color . && isort . --check --diff
