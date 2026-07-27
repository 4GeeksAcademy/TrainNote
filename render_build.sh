#!/usr/bin/env bash
# exit on error
set -o errexit

npm install
npm run build

pip install pipenv

pipenv install

export PYTHONPATH=src
export FLASK_APP=src/app.py

# 1. Intentar correr migraciones estándar de Flask-Migrate
pipenv run upgrade || true

# 2. Respaldar con create_all() para garantizar que las tablas existan en PostgreSQL
python -c "from app import db, app; app.app_context().push(); db.create_all()"
