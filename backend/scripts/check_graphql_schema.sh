#!/bin/bash

# copy old file + re-generate schema
mv ./schema.graphql ./schema.graphql.tmp || exit
bash ./scripts/export_graphql_schema.sh || exit
diff ./schema.graphql ./schema.graphql.tmp > /dev/null 2>&1
schema_error=$?

# clean up
mv ./schema.graphql.tmp ./schema.graphql

# check for error code
if [ $schema_error -eq 0 ]
then
  echo "✅  Schema up to date"
elif [ $schema_error -eq 1 ]
then
  echo "❌  Schema is not up to date"
  exit $schema_error
else
  echo "💥  There was something wrong with the diff command"
fi

! (($schema_error))
