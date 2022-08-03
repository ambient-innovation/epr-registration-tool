# EPR Registration Tool | Backend

## Table of contents
1. [Local Development](#local-development)
2. [Code formatting](#code-formatting)
3. [Linting](#linting)
4. [Check migrations](#check-migrations)
5. [Update graphql Schema](#update-graphql-schema)
6. [Testing](#testing)
8. [Emails](#emails)
9. [Wagtail](#wagtail)


## Local development

### Links

- Admin: [localhost:8000/admin]()
  - email: `admin@epr.local`  
  - password: `Admin1234`
- GraphQL playground: [localhost:8000/graphql]()
- CMS [localhost:8000/cms]()
- CMS API [localhost:8000/cms/api/v2/pages]()

### Run backend

**🐳 Docker setup**

      docker compose up backend

Run commands with docker:
- `docker compose run -rm backend <command>`  
   start container and remove after run
- `docker compose exec backend bash`  
   execute command in running container

-----
**🐍 Non Docker setup**

1. copy [.env.example](./apps/config/.env.example) --> `.env`
2. run database `docker compose up db` + other services as need (like `mailhog`)
3. migrate database `python ./manage.py migrate`
4. run server, either using a run config or via `python ./manage.py runserver`


### Create data

#### Users

(already included in docker setup --> [scripts/run_dev.sh](scripts/run_dev.sh))

    python manage.py loaddata dev_users.yaml

#### Packaging

groups + materials + prices

    python manage.py loaddata packaging_groups_and_materials

#### CMS

**Create initial home page**

1. Go to [CMS](localhost:8000/cms)
2. Go to `settings > Locales`
3. Add locale for Arabic (synchronized from English)
4. Go to `Pages` + click `⌂ Pages`
5. Create a new `HomePage` at root level
6. Delete default Wagtail page
7. Go to `setting > Sites`
8. Add / adjust default site
   - hostname: `localhost`
   - port: 8000
   - site name: `EPR Registration Tool`
   - root page: select the just created `HomePage` 
   - is default site: `true`
9. Publish your `HomePage`


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

Check if all model changes are reflected in migrations. 
This will be checked in the pipeline too.

      ./scripts/check_migrations.sh

## Update graphql Schema

Export the current GraphQL schema to [schema.graphql](schema.graphql).
The FE wil generate Typescript types based on this schema. 
Therefore our [GitLab pipelines](../.gitlab-ci.yml) will make sure the schema is up to date.

      ./scripts/export_graphql_schema.sh

## Testing

    ./scripts/test.sh

## Emails

When using docker-compose, `mailhog` is our default email backend.

Start service:

    docker-compose up mailhog

All emails that leave your local backend can be displayed under:

    http://0.0.0.0:8025/

Alternatively you can comment out the following env variable to use a simple console backend.

    DJANGO_EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend

## Wagtail

We picked Wagtail as our CMS --> [ADR](../docs/decisions/0001-use-wagtail-as-cms.md).
It is fully integrated in Django.

### Translation

Translations are based on [wagtail_localize](https://wagtail-localize.org/). 
This library will create as synchronized page tree per language.

### Slugs & Links

⚠️ It is very important that all pages (except for the homepage) share the same `slug` across different languages.
Thi is because in the frontend, pages are only identified through their slug for both languages.

This becomes important when it comes to inline links in rich-text.
Links share the same reference in rich-text across all languages, only the text content will differ. 

**Example:**


Rich-text (English): 


        <p>Hello <a id="11" type="pagelink">World</a>  

Rich-text (Arabic): 
        
        أهلا <p><a id="11" type="pagelink">العالمية</a>

The stored ID will be the same for both languages. 
In API response will transform the link to something like this:

        <a data-slug="my-slug" data-pagetype="cms.StandardPage">...</a>

In the FE the link will be transformed to 
        
        <a href="/my-slug">...</a>
        <a href="/ar/my-slug">...</a>

depending on the selected language. If the slug is different for both translation, the link will be broken
for one of both.

### Preview mode

The preview is implemented in two steps:

1. When the "preview" button is clicked in Wagtail, the `wagtail_headlesspreview` package will create
   a new preview entry in the database, that can be referenced by a token. This token will be sent to
   the FE via an API call, like `<FRONTEND_URL>/api/preview?token=...&content_type=...&secret=...`
2. By calling this FE API, next.js will enter a preview mode, that tells next.js to render pages on request.  
   Next.js will store the token inside the cookie data, so next.js can use this token to fetch the preview 
   from wagtail.

### Publishing pages

Our frontend renders cms content statically at build time.
Therefore, we need to trigger a rebuild, when new changes in Wagtail are published.

To achieve this, we use 
[GitLab triggers](https://gitlab.ambient-innovation.com/giz/epr-registration-tool/-/settings/ci_cd),
which are called using a `page_publish` [signal](apps/cms/signals.py).
This will trigger a pipeline in GitLab for the develop branch.
In order to avoid running all linters, tests, etc., we exclude unnecessary jobs using
`exclude: - triggers` in the respective [jobs](../.gitlab-ci.yml). 
This approach is based on the assumption, that we use triggers only for that purpose.

This setup could be improved in the future by using 
[incremental builds](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration). 