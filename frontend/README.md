# EPR Registration Tool | Frontend

## Local development

We recommend not to use Docker for local development

    yarn install
    yarn dev
    
Open: [localhost:3000]()

## Storybook

We use storybook to develop components in isolation. 

    yarn start:storybook
    
Open: [localhost:9009]()

## Testing

    yarn test
    
So far we only use plain jest + react-testing-library in unit tests

## Linting

    yarn lint
    
This command runs three scripts in parallel
- type checks `yarn lint:ts`
- eslint `yarn lint:eslint`
- prettier `yarn lint:prettier`

## Code formatting

    yarn format
    
This command runs two scripts
- eslint with fix option
- prettier

## GraphQL Types Generation

we make use of the static GraphQL schema from our backend to generate typescript types 
and thus keep backend and frontend synchronised. Therefore, we use the `graphql-code-generator`. 
This requires three steps:

1. Generate/update `schema.graphql` in backend: 

         backend/scripts/extract_graphql_schema.sh

2. Write your GraphQL queries
3. Generate Typescript Types:
         
         yarn generate-types 

You execute run step 1. and 3. by running (in root dir):

    update_schema_and_types.sh

You will find the generated types and hooks in: `src/api/__types__.ts`
