#!/bin/bash

# shortcut for updating schema + generated types

cd ./backend/ || exit
bash ./scripts/export_graphql_schema.sh || exit

cd ../frontend || exit
yarn generate-types
