#!/bin/bash
if (aws sts get-caller-identity | grep -q $ACCOUNT_NUMBER); then
    echo "You are logged in for $ACCOUNT_NUMBER."
else
    echo "Please configure ACCOUNT_NUMBER or login."
    exit 1
fi

NESTED_STACK_S3_BUCKET="ambient-shared-$ENVIRONMENT-cloudformation-nested-stack-deployments"

ROOT_STACK_NAME="$ENVIRONMENT-$PROJECT-sso-root-stack"
ROOT_STACK_PARAMS="file://env-folders/$ENVIRONMENT/sso-params.json"
ROOT_STACK_CHANGESET_PARAMS="file://env-folders/$ENVIRONMENT/sso-changeset-params.json"

echo "Pushing nested stack files to $NESTED_STACK_S3_BUCKET for $ROOT_STACK_NAME"
aws s3 sync --delete ./nested-stacks/sso s3://$NESTED_STACK_S3_BUCKET/$ROOT_STACK_NAME

# Check if the stack exists
if aws cloudformation describe-stacks --stack-name $ROOT_STACK_NAME &>/dev/null; then
    echo "Stack exists. Creating cloudformation changeset for $ROOT_STACK_NAME"

    # If stack exists, create just a changeset
    aws cloudformation create-change-set \
        --stack-name $ROOT_STACK_NAME \
        --parameters $ROOT_STACK_CHANGESET_PARAMS \
        --tags "Key=${PROJECT}:environment,Value=${ENVIRONMENT}" "Key=project,Value=${PROJECT}" "Key=environment,Value=${ENVIRONMENT}" \
        --change-set-name $ROOT_STACK_NAME-changeset \
        --template-body file://cf_sso_root_account.yaml \
        --capabilities CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \
        --include-nested-stacks \
        && echo "Please go ahead and review changeset to approve or reject the changes in corresponding AWS account."
else
    echo "Stack does not exist. Deploying new stack $ROOT_STACK_NAME."

    # If stack does not exist, create a new stack
    aws cloudformation deploy --stack-name $ROOT_STACK_NAME \
        --template-file ./cf_sso_root_account.yaml \
        --parameter-overrides $ROOT_STACK_PARAMS \
        --tags "${PROJECT}:environment=${ENVIRONMENT}" "project=${PROJECT}" "environment=${ENVIRONMENT}" \
        --capabilities CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \
        --no-execute-changeset \
        && echo "Please go ahead and review changeset to approve or reject the changes in corresponding AWS account."
fi

if [ "$TERMINATION_PROTECTION_ENABLED" == "true" ]; then
    aws cloudformation update-termination-protection \
        --stack-name $ROOT_STACK_NAME \
        --enable-termination-protection
else
    aws cloudformation update-termination-protection \
        --stack-name $ROOT_STACK_NAME \
        --no-enable-termination-protection
fi