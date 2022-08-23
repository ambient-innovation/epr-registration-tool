# EPR Registration Tool | Frontend

## Table of contents
1. [Run project](#run-project)
2. [Storybook](#storybook)
3. [Testing](#testing)
4. [Linting](#linting)
5. [Code Formatting](#code-formatting)
6. [GraphQL Types Generation](#graphql-types-generation)
7. [Next.js images](#nextjs-images)
8. [Translations](#translations)


## Run project

**Non Docker setup**

We recommend not to use Docker for local development

    yarn install
    yarn dev
    
Open: [localhost:3000]()

----

**Docker setup**

Run in root directory

      docker compose up frontend


## Storybook

We use storybook to develop components in isolation. 

    yarn storybook
    
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

         backend/scripts/export_graphql_schema.sh 

2. Write your GraphQL queries
3. Generate Typescript Types:
         
         yarn generate-types 

You execute run step 1. and 3. by running (in root dir):

    update_schema_and_types.sh

You will find the generated types and hooks in: `src/api/__types__.ts`

## Next.js images

Please make sure that all `next/image`s use the `layout="repsonsive"` or `"fill"` with
appropriate `sizes="..."` attribute to make sure, that images are provided in the correct 
size for different screen sizes. 

## Translations

We currently manage all translations in a single namespace `common`.  
All translation keys in the JSON files **must be sorted by convention**. 

For PyCharm users, we recommend using the Plugin 
[Easy I18n](https://plugins.jetbrains.com/plugin/16316-easy-i18n),  
which provides automatic sorting ("sort translation keys alphabetically").