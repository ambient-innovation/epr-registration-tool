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

IMPORTANT NOTE: Using Kubernetes environment only for hosting single small application can introduce significant maintenance overhead for that reason this option is not recommended in case there is no existing Kubernetes setup in the first place.

### Other setups
 
You can also install this application in other docker-based setups such as AWS ECS or standard servers. However, in case of using standard servers necessary solutions should be put in place to meet necessary scalibility and avaiability requirements.

To install on a root server, you can manually start a docker container for the frontend and backend as well as the database. Alternatively you can use docker-compose in a similar way as the provided [docker-compose setup](./docker-compose.yml) that we use for local development. 

To install this application without using docker, you can use the provided dependency management tools ([Pypi](./backend/Pipfile) in the backend and [npm](./frontend/package.json) in the frontend).

## Hardware requirements
### Test Environment
Minimum required resources in order to host test environment is as follows;
- 2 vCPU & 4 GB Memory 
Note that we recommend running two instance of frontend and two instance of backend application in the test system for high avialability purposes. Resources in the test system can be divided evenly between backend & frontend application.

We do use a hosted postgres database service (version 11.8 or higher)  with 2 CPU & 4 GB memory instance. We suggest that database is hosted on a seperate instance then where the test application is running. We suggest having minimum of 7 days of backup for test environment for database.

### Production Environment
Minimum required resources in order to host production environment is as follows;
- 4 vCPU & 8 GB Memory 
Note that we recommend running two instance of frontend and two instance of backend application in the production system for high avialability purposes. Resources in the production system can be divided evenly between backend & frontend application.

We do use a hosted postgres database service (version 11.8 or higher)  with 2 CPU & 4 GB memory instance. We suggest that database is hosted on a seperate instance then where the production application is running. We suggest having minimum of 30 days of backup for production environment for database.

IMPORTANT NOTE: Please note that, resources required to run production environment may need to be increased over time according to the actual usage from the users.


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
