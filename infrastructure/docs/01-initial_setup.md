# Initial Setup

This docs covers only the initial setup, if you have not configured your repository to create/manage aws resources. 

If your repository has the initial setup already done, have a look at [Usage](/aws/docs/02-usage.md)

# Prerequisites

- You need to have AWS CLI installed 
- Optional: You need to have direnv installed [Nuclino Docs](https://app.nuclino.com/AmbientDigital/Secret-Heroes/direnv-and-envrc-autoload-environment-variables-727b0879-540d-4766-8e85-e4509eeb545b)

# Short summary/version

The following part of this page will go over step by step what to do. But to get a better understanding here is a short sumamry:

1. The AWS folder gets copied into a project repository. 
2. Everything the project does not need, will be removed and specific variables adjusted to match the use case. 
3. Secret hero deploys the [IAM-Policy-CF-Stack](/aws/cf_iam_policies.yaml) to the AWS target account (test or prod)
4. Secret hero deploys the [SSO-CF-Stack to the](/aws/cf_sso_root_account.yaml) AWS ROOT Account and give therefore the devs all permissions they need
5. Developer can deploy the [Infrastucture-CF-Stack](/aws/cf_infrastructure.yaml) to the target account

# Step by step 

### Initial Steps

1. First copy the entire aws-folder into your project repository 
2. Add the rule `!/aws/**/.env` to your project's .gitignore to make sure, that you will be able to commit .env files of the aws-folder later.
3. In [/aws/env-folders/](/aws/env-folders/) you can find a test, prod and root folder. Each of them has a .env-file. They all have a variable called `PROJECT`, adjust it to match the name of your project.

### Before You Start;
- Check out resource specific readmes before you start deploy or destroy. There might be special steps you need to take depending on what you are deploying;
  - [Cloudfront S3 Frontend](/aws/docs/03-frontend_cloudfront.md)
  - [Dedicated RabbitMQ](/aws/docs/04-dedicated_rabbitMQ.md)
  - [Backend - SES](/aws/docs/05-backend.md)
  - [Dedicated RDS](/aws/docs/06-dedicated_RDS.md)

### Deploying IAM-Policies to target account (test/prod)

In order to grant permissions in AWS we need to create policies which define the scope of those permissions. Those policies can include permissions to create infrastructure resources, view/edit access to them, access to logs etc. Once they exist they can be used to bind them to SSO-Groups and therefore enable devs to use them.

1. Open the [IAM-Policy-CF-Stack](/aws/cf_iam_policies.yaml). Here you can find a category `Resources` which has multiple blocks. Each block will create a nested-stack with the resources for the use-case you can guess from it's name. Remove every block, that is for a use-case that is not needed in your project.
2. In the same file you will find on the top a category `Parameters`. There is a comment for each `Resources`-Block you removed earlier. For the same ones now also remove the corresponding parameters.
3. In [/aws/env-folders/test](/aws/env-folders/test) and [/aws/env-folders/prod](/aws/env-folders/prod) you will find files called `iam_policies-params.json` and `iam_policies-changeset-params.json`. In those remove the same parameters you just removed as well.
4. Now you have a cleaned up `iam_policies-params.json` file, but it has placeholder values. Replace the remaining ones with the values you need.
5. Make sure to saved all files with cmd + s before you proceed.
6. The IAM-Policy-Stack can now be deployed (this has to be done by a secret hero). Make sure you authorize with the correct AWS account in your terminal.
7. Set the following variable with your correct env: `export ENVIRONMENT=test` (could be also prod)
8. Source environment variables
    - Option 1: Run `direnv reload` and see that all variables are loaded 
    - Option 2: `set -o allexport && source ./env-folders/$ENVIRONMENT/.env && set +o allexport`
9. Run [/aws/deploy_iam_policies.sh](/aws/deploy_iam_policies.sh)
10. Your changeset will be created login to AWS Console, find the changeset, review it and execute it.

### Prerequisites for Deploying SSO to root account (Secret Hero Only)
#### Creating SSO Groups
- If the project team is newly formed and such team does not exists in AWS SSO yet do the following steps;
  - Go to SSO > Groups > Create Group
  - Create project team sso group in following convention;
    - Format: ambient-{name-of-project-team}
    - Example: ambient-evil-beard
  - Invite everyone in the team to this SSO group and mention that in the corresponding project channel.
  - Every new developer should be also in general-developers group in addition to their own team. This grants them devops workshop repo project resources as well as sandbox access in AWS.
- Create a prod SSO group for this new project. FYI, for test we use team's own SSO group and for prod we create individual SSO group to be able to assign permissions per individual basis.
  - Go to SSO > Groups > Create Group
  - Create project prod SSO group in following convention;
    - Format: prod-{project-name}
    - Example: prod-smartmatch
  - Production group is restricted and should be only provided to selected team members. Ask to the team if you are unsure about who supposed to have production access.

### Deploying SSO to root account

The policies that were created in the previous stage, can now be used to enable devs to have required permissions. We achieve that by binding those policies to SSO-Groups.

1. Open the [SSO-CF-Stack](/aws/cf_sso_root_account.yaml). Here you can find a category `Resources` which has multiple blocks. Each block will create a nested-stack with the resources for the use-case you can guess from it's name. Remove every block, that is for a use-case that is not needed in your project.
2. In the same file you will find on the top a category `Parameters`. There is a comment for each `Resources`-Block you removed earlier. For the same ones now also remove the corresponding parameters.
3. In [/aws/env-folders/root](/aws/env-folders/root) you will find files called `sso-params.json` and `sso-changeset-params.json`. In those remove the same parameters you just removed as well.
4. Now you have a cleaned up `sso-params.json` file, but it has placeholder values. Replace the remaining ones with the values you need.
5. Make sure to saved all files with cmd + s before you proceed.
6. The SSO-Stack can now be deployed (this has to be done by a secret hero). Make sure you authorize with the correct AWS account in your terminal (ROOT).
7. Set the following variable with your correct env: `export ENVIRONMENT=root`
8. Source environment variables
    - Option 1: Run `direnv reload` and see that all variables are loaded 
    - Option 2: `set -o allexport && source ./env-folders/$ENVIRONMENT/.env && set +o allexport`
9. Run [/aws/deploy_sso_root.sh](/aws/deploy_sso_root.sh)
10. Your changeset will be created login to AWS Console, find the changeset, review it and execute it.

### Postrequisites for Deploying SSO to root account (Secret Hero Only)
#### Granting Access to Cluster for Team Members & Gitlab CI/CD User
- CI/CD User created via IAM Repo needs to be granted access to cluster to be able to deploy.
- The SSO Group binded to Permission set will create a role in our system, this also needs to be granted access to cluster as well.
- Please do steps mentioned here as a secret hero; [configure cluster access](/aws/07-configuring-cluster-access-for-ci-and-devs.md)

### Deploying infrastructure

Now the status should be, that a dev can authorize with a new SSO-Group in aws, that enables him to create all resources he needs to. This can be done with the following steps:

1. Open the [Infra-CF-Stack](/aws/cf_infrastructure.yaml). Here you can find a category `Resources` which has multiple blocks. Each block will create a nested-stack with the resources for the use-case you can guess from it's name. Remove every block, that is for a use-case that is not needed in your project.
2. In the same file you will find on the top a category `Parameters`. There is a comment for each `Resources`-Block you removed earlier. For the same ones now also remove the corresponding parameters.
3. In [/aws/env-folders/test](/aws/env-folders/test) and [/aws/env-folders/prod](/aws/env-folders/prod) you will find files called `infrastructure-params.json` and `infrastructure-changeset-params.json`. In those remove the same parameters you just removed as well.
4. Now you have a cleaned up `infrastructure-params.json` file, but it has placeholder values. Replace the remaining ones with the values you need.
5. Make sure to saved all files with cmd + s before you proceed.
6. The Infra-Stack can now be deployed (this can be done by any developer). Make sure you authorize with the correct AWS account in your terminal.
7. Set the following variable with your correct env: `export ENVIRONMENT=test` (could be also prod)
8. Source environment variables
    - Option 1: Run `direnv reload` and see that all variables are loaded 
    - Option 2: `set -o allexport && source ./env-folders/$ENVIRONMENT/.env && set +o allexport`
9. Run [/aws/deploy_infra.sh](/aws/deploy_infra.sh)
10. Your changeset will be created login to AWS Console, find the changeset, review it and execute it.

# Further Steps (Secret Heroes)
- Go ahead and create AWS credentials manually for "ci.${Project}.iam-user" IAM user per environment to be used in CI/CD deployments
  - Set those credentials in CI/CD pipeline accordingly:
    - DEPLOYMENT_AWS_ACCESS_KEY_ID
    - DEPLOYMENT_AWS_SECRET_ACCESS_KEY

# Termination Protection
In case you need to delete the stack you need to set `TERMINATION_PROTECTION_ENABLED` to `false`, re-deploy and then delete the stacks accordingly.