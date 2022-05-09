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