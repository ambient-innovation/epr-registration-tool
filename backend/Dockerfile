FROM python:3.9 as base

RUN apt-get update && apt-get install -y gettext \
  # Cleanup apt cache
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# Move pipfiles to project.
RUN mkdir -p /app
WORKDIR /app

ADD Pipfile Pipfile.lock ./

# Install dependencies
RUN pip install -U pip pipenv

FROM base as prod-build-python

# copy migrations script
COPY ./scripts/migrations.sh /bin/migrations.sh
RUN chmod +x /bin/migrations.sh

RUN pipenv install --system --verbose --deploy

FROM base as dev-build-python

RUN pipenv install --system --verbose --deploy --dev

### Dev image used for loca development (bigger than prod image)
FROM dev-build-python as dev

COPY . /app/
WORKDIR /app

RUN addgroup --system --gid 1001 backend
RUN adduser --system --uid 1001 backend-user-dev && chown -R backend-user-dev /app

USER backend-user-dev

# Django-env expects this file to exist and prints warnings, but we use docker compose env vars.
RUN touch ./apps/config/.env

EXPOSE 8000

CMD ["./scripts/run_dev.sh"]

### Prod image
FROM python:3.9-slim as prod

ENV PYTHONUNBUFFERED 1

RUN apt-get update \
  && apt-get install -y \
  libxml2 \
  libssl3 \
  libcairo2 \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libgdk-pixbuf2.0-0 \
  shared-mime-info \
  mime-support \
  postgresql \
  libpq-dev \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

COPY --from=prod-build-python /usr/local/lib/python3.9/site-packages/ /usr/local/lib/python3.9/site-packages/
COPY --from=prod-build-python /usr/local/bin/ /usr/local/bin/
COPY --from=prod-build-python /bin/migrations.sh /bin/

COPY . /app/
WORKDIR /app

RUN addgroup --system --gid 1001 backend
RUN adduser --system --uid 1001 backend-user-prod && chown -R backend-user-prod /app

USER backend-user-prod


# Django-env expects this file to exist and prints warnings, but we use docker compose env vars.
RUN touch ./apps/config/.env

EXPOSE 8000

CMD ["./scripts/run_prod.sh"]
