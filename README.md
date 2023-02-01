# EPR Registration Tool

## Links

- Repo: [GitLab](https://gitlab.ambient-innovation.com/giz/epr-registration-tool)
- Designs: [Figma](https://www.figma.com/file/DAopFQAjt8DvKetQfrH7EG/GIZ-EPR-Registration-Tool-MUI)
- Test Server
  - Django Admin: [api.epr-test.ambient.digital/admin](https://api.epr-tool.ambient.digital/admin/)
  - GraphiQL: [api.epr-test.ambient.digital/graphql](https://api.epr-tool.ambient.digital/graphql/)
  - Wagtail: [api.epr-test.ambient.digital/cms](https://api.epr-tool.ambient.digital/cms/)
  - Frontend: [epr-test.ambient.digital](https://epr-tool.ambient.digital/)
- Local
  - Django Admin: [localhost:8000/admin](http://localhost:8000/admin/)
  - GraphiQL: [localhost:8000/graphql](http://localhost:8000/grapqhl/)
  - Wagtail: [localhost:8000/cms](http://localhost:8000/cms/)
  - Frontend: [localhost:3000](http://localhost:3000)
  - Storybook: [localhost:9009](http://localhost:9009)
  - Mailhog: [localhost:8025](http://localhost:8025)


## Project Structure

- Backend [`/backend/README.md`](./backend/README.md)
- CMS [`/backend/README.md`](./backend/README.md)
- Frontend [`/frontend/README.md`](./frontend/README.md)
- e2e Tests [`/e2e/README.md`](./e2e/README.md)
- ADRs [`/docs/decistions/`](./docs/decisions/0000-example-use-adrs.md)


## Quick Start

1. Follow "Local development" instructions in [backend README](./backend/README.md)
   - run backend
   - create/load data
   - setup first wagtail page
2. Follow "Run project" instructions in [frontend README](./frontend/README.md)

## Deployment

In order to run this application, you need to start three separate components: 
- A postgres database (postgres version 11.8), where we recommend to provide a managed database
- The backend application, which is written in Django
- The frontend application, which is written in Next.JS and hence also runs server-side

### Kubernetes

We strongly recommend deploying this application in a Kubernetes environment, because this makes it easy to scale the different parts of the application depending on the load and to ensure availability through redundancy.

You can use the provided [helm charts](./charts/epr-registration-tool) to install the application. In this setup we assume a managed Postgres database is provided and linked through the values set under the "db" section of the [values file](./charts/epr-registration-tool/values.yaml).

### Other setups
 
You can also install this application in other docker-based setups such as AWS ECS or even on a root server. However, we disencourage installing this application on traditional servers, because of the disadvantages in scalability and availability. 

To install on a root server, you can manually start a docker container for the frontend and backend as well as the database. Alternatively you can use docker-compose in a similar way as the provided [docker-compose setup](./docker-compose.yml) that we use for local development. 

To install this application without using docker, you can use the provided dependency management tools ([Pypi](./backend/Pipfile) in the backend and [npm](./frontend/package.json) in the frontend).

## Hardware requirements
You should reserve at least 4 CPU cores and 16 GB of memory in total for running the application.
- Run at least 2 frontend-pods with each 300 mCPU and 800 MB memory
- Run at least 2 backend-pods with each 300 mCPU and 800 MB memory
- As database we recommend providing at least 2 CPU cores and 4 GB memory 

## Helm Charts

When making changes in the [Helm Charts](charts/epr-registration-tool/Chart.yaml), follow these steps

  1. increase version in [Chart.yaml](charts/epr-registration-tool/Chart.yaml)
  2. adjust `TEST_HELM_CHART_VERSION` in [CI/CD pipelines](.gitlab-ci.yml)
  3. push + merge your code
  4. create a new tag in [GitLab](https://gitlab.ambient-innovation.com/giz/epr-registration-tool/-/tags) 
     from the target branch called `helm-x.x.x` (adjust version).

Now the new helm-chart version is available for deployments.

## pre-push hooks

Git pre push hooks for Backend and Frontend are in [`.pre-commit-config`](./.pre-commit-config.yaml)
to activate it run in the project root dir.

    pre-commit install --hook-type pre-push

You may need to install pre-commit if not already installed

    pip install pre-commit
    brew install pre-commit     (mac alternative)


## Glossary

<dl>
  <dt>
    <a href="https://www.zmart.de/blog/epr-was-ist-die-erweiterte-herstellerverantwortung" target='_blank'>
      EPR
    </a>
  </dt>
  <dd>
    extended producer responsibility <br>
    (erweiterte Herstellerverantwortung)
  </dd>
  <dt>Packaging Report</dt>
  <dd>
    A representation of single data report for packaging material, created by a company.<br>
    One packaging report can hold up to two submissions, one for the forecast and one for the final data.<br>
    We called it "Packaging" Report, to separate it from reporting tools of the application.
  </dd>
  <dt>Submission</dt>
  <dd>
    One set of material records, defining the quantities per material and material group for one period of time.<br>
    A submission either represents the forecast data OR the final data ("actual quantities""
  </dd>
</dl>
