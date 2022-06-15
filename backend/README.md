# EPR Registration Tool | Backend

## Table of contents
1. [Local Development](#local-development)
2. [Code formatting](#code-formatting)
3. [Linting](#linting)
4. [Check migrations](#check-migrations)
5. [Update graphql Schema](#update-graphql-schema)
6. [Testing](#testing)
7. [Loading Fixtures](#loading-fixtures)
8. [Emails](#emails)


## Local development
to start backend:

      docker compose up backend

- Admin: [localhost:8000/admin]()
- Admin email: `admin@epr.local`  
- Admin password: `Admin1234`
- GraphQL playground: [localhost:8000/graphql]()


Run commands with docker:
- `docker compose run -rm backend <command>` start container and remove after run
- `docker compose exec backend bash` execute command in running container

## Code formatting

      ./scripts/format.sh

## Linting

      ./scripts/lint.sh

Note:
You can set up PyCharm to run black and isort to run on every save automatically.
For this you have to add black and isort to your machine globally, if not done yet.
After this you can follow the [set-up instructions](https://black.readthedocs.io/en/stable/integrations/editors.html#pycharm-intellij-idea) of black and repeat the same process for isort.

Note:
You can make further adjustments or changes to blacks and isorts configuration by editing the `pyprojects.toml` of the `backend` directory.


## Check migrations

      ./scripts/check_migrations.sh

## Update graphql Schema

      ./scripts/export_graphql_schema.sh

## Testing

    python manage.py test

## Emails

When using docker-compose, `mailhog` is our default email backend.

Start service:

    docker-compose up mailhog

All emails that leave your local backend can be displayed under:

    http://0.0.0.0:8025/

Alternatively you can comment out the following env variable to use a simple console backend.

    DJANGO_EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend

