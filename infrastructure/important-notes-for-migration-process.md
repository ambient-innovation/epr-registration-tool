In ideal scenario, it is best to replicate the infrastructure environment as much as possible to
ensure smooth migration process however if this is not feasible due to time constraints, budget
constraints or due to need for migration to on-premise environment;
- Pick the simplest possible infrastructure architecture that suits your needs that will help
you get your application running as quickly as possible.
  - For example, if you don’t need auto-scaling, do not try to implement auto scaling. In most cases, picking a bigger instance just works.
- In most cases you can simply use a single server setup to run backend & frontend as Docker containers.

If you are going to host your application in a cloud environment, please use a relational
database service instead of hosting it on your own. Databases are very critical parts of the
infrastructure that need special attention and would greatly benefit from robust backup systems
offered by cloud environments.
- If you have to host your own database in a server setup, ensure that backups are
working and perform regular checks on your backup systems. It is easy to oversee that and be left with no backup to use in case of critical issues.

If you need to move to an on-premise environment, make sure you request relevant resources
as quick as possible, as commissioning relevant resources on your on premise IT department
can take significant time and migration process can be greatly affected by the type of
environment you receive thus it is best to request such resources as quick as possible and start
the migration process as early as possible.

Expected Regular Maintenance Work for the Application
- Postgres database updates for security patches & deprecations.
- Django / Next.js package updates for deprecations.
- Server updates for security patches.

Relevant IT Skills That Might Be Needed During Migration
- Docker
- Django - Backend
- Next.js - Frontend
- Postgres - Database
- Gitlab CI/CD - CI/CD system for building & deployments
- If migrating to another cloud environment, knowing the target cloud environment would
help e.g. AWS / Azure / Google Cloud / etc.