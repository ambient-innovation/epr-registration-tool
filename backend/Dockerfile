FROM python:3.9 as build-python

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
RUN pipenv install --system --verbose --deploy --dev

### Dev image used for loca development (bigger than prod image)
FROM build-python as dev

COPY . /app/
WORKDIR /app

RUN useradd -ms /bin/bash giz-user-dev && chown -R giz-user-dev /app

USER giz-user-dev

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
  libssl1.1 \
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

COPY --from=build-python /usr/local/lib/python3.9/site-packages/ /usr/local/lib/python3.9/site-packages/
COPY --from=build-python /usr/local/bin/ /usr/local/bin/

COPY . /app/
WORKDIR /app

RUN useradd -ms /bin/bash giz-user-prod && chown -R giz-user-prod /app

USER giz-user-prod

# Django-env expects this file to exist and prints warnings, but we use docker compose env vars.
RUN touch ./apps/config/.env

EXPOSE 8000

CMD ["./scripts/run_prod.sh"]
