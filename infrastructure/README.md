# Idea behind this folder/setup/template
At some point the Secret Heroes decided, that AWS related resources to a project should be owned by the project and the tools to create and modify those should be part of their repositories and accessible to developers. 

To make this setup on new projects as easy as possible, we created in the "DevOps Workshop" repository an [aws-folder](https://gitlab.ambient-innovation.com/infrastructure/examples/devops-1-workshop/-/tree/develop/aws) as an example. The idea is, that for default projects, that are using the shared ambient infra, the "aws" folder can be copied into a project-repository, than all stuff, that is not needed can be removed, details can be adjusted and finally deployed.

You will find here the required code to create and manage:
- IAM Policies related to AWS resources of a project
- AWS SSO project related configurations (access for devs via AWS SSO page)
- AWS Resources (S3 Buckets, RDS, Cloud front etc.)

All of those 3 are deployed via an own Cloudformation Stack into the correct AWS account. Each of those 3 stacks serves as a wrapper and deploys underlying nested stacks. Those nested stacks can be seen as modules and you just use the ones you actually need for your project and remove/don't use the other ones.

The resources here are split based on use cases, so you can easily decide which use cases you need and which ones you dont, so that you can remove them easily. Examples for use cases are: 
- Backend: S3 Bucket 
- Frontend: Cloud front Distribution + S3 Bucket + IAM User for CI/CD
- Dedicated RDS
- Dedicated RabbitMQ
- Access to send mails via specific email address 
- etc. 

# Initial Setup + Adjustments to permissions (done in cooperation with Secret Hero)

If you have the aws folder not setup yet in your project repository, follow the documentation in [aws/docs/01-inital_setup.md](/aws/docs/01-inital_setup.md) to do that properly.

# Usage (devs can fully use on their own)

If the initial setup is done and you want as a developer to deploy for example changes to your AWS Resources, have a look into [aws/docs/02-usage.md](/aws/docs/02-usage.md).

# Special notes on specific use cases 

- [Frontend: Cloudfront Distribution + S3 Bucket + IAM User for CI/CD](/aws/docs/03-frontend_cloudfront.md)
- [Dedicated RabbitMQ](docs/04-dedicated_rabbitMQ.md)
- [Backend: S3, SecretsManager, SES etc.](/aws/docs/05-backend.md)
- [Dedicated RDS](/aws/docs/06-dedicated_RDS.md)
- [CI/CD: Pipeline & SSO Access](/aws/docs/07-configuring-cluster-access-for-ci-and-devs.md)
