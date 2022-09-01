# EPR Registration Tool | E2E Tests

## Local testing

### Run tests

Run backend container `backend_e2e` that is starting with a empty test db and loads needed fixtures.

        docker compose up e2ebackend

Additionally, run the frontend in docker.

        docker compose up e2efrontend

Or you can run your frontend also locally. Switch to the frontend directory `./frontend` and run following command:

        yarn dev

Finally, to run the tests switch to the `./e2e` directory and run:
        
        yarn playwright test

If you have not installed needed packages before you need to run the following commands:

        yarn install

        yarn playwright install
        
### Writing new tests

To write a test start first with the test generator that playwright comes with

        yarn playwright codegen

It is needed to replace the absolute URLs to relative as we have configured a `baseUrl` in our config.

The test files mostly need to be cleaned up afterwards as it registers every action you perform that may be unnecessary
to test.

### Debug tests

After running one or more tests a report per test will be generated. You will find them under 

        `./e2e/test-results/tests-TEST_NAME`.

Each of the tests will contain a `trace.zip` file which you can open or drag and drop on the site

        https://trace.playwright.dev/
