# Usage

This docs asumes, that the initial setup was done and all 3 stacks (iam, sso and infra) are at least deployed once.

If this is not the case, have a look at [initial Setup](/aws/docs/01-initial_setup.md)

# Prerequisites

- You need to have AWS CLI installed 
- Optional: You need to have direnv installed [Nuclino Docs](https://app.nuclino.com/AmbientDigital/Secret-Heroes/direnv-and-envrc-autoload-environment-variables-727b0879-540d-4766-8e85-e4509eeb545b)

# Structure explained

- Your infrastrucutre is managed via a Cloudformation-Stack [/aws/cf_infrastructure.yaml](/aws/cf_infrastructure.yaml). It is making use of substacks which each cover specific use cases.
- In [/aws/env-folders/test](/aws/env-folders/test) and [/aws/env-folders/prod](/aws/env-folders/prod) you can find files called `infrastructure-params.json` and `infrastructure-changeset-params.json`. In those variables for your templates are defined.
- In [/aws/nested-stacks/infrastructure](/aws/nested-stacks/infrastructure) you can find all the templates of the substacks/nested-stacks that are part of your overlying infra-stack.
- For applying changes you have a script called [/aws/deploy_infra.sh](/aws/deploy_infra.sh)

# Adjusting variables of your templates 

A common use case is, that you have to make changes to existing deployed resources via the change of values. This can be done like this:

1. Find the `infrastructure-changeset-params.json` of your env.
2. Find the variable you want to change
3. Set `UsePreviousValue` to false 
4. Under `ParameterKey` create a new variable `ParameterValue`
5. Define for `ParameterValue` your new value
6. Deploy your changes (see below)

Disclaimer: Don't change `infrastructure-params.json` that one is used only for the initial variable values used.

# Adjusting templates of sub/nest-stacks

A common use case is, that you have to make changes to existing cloudformation templates. This can be done like this:

1. Find the correct template in [/aws/nested-stacks/infrastructure](/aws/nested-stacks/infrastructure)
2. Modify it the way you want 
3. Deploy your changes (see below)

# Deploying changes

1. Make sure you authorize with the correct AWS account in your terminal.
2. Set the following variable with your correct env: `export ENVIRONMENT=test` (could be also prod)
3. Source environment variables
    - Option 1: Run `direnv reload` and see that all variables are loaded 
    - Option 2: `set -o allexport && source ./env-folders/$ENVIRONMENT/.env && set +o allexport`
4. Run [/aws/deploy_infra.sh](/aws/deploy_infra.sh)
5. Your changeset will be created login to AWS Console, find the changeset, review it and execute it.

# Termination Protection
In case you need to delete the stack you need to set `TERMINATION_PROTECTION_ENABLED` to `false`, re-deploy and then delete the stacks accordingly.