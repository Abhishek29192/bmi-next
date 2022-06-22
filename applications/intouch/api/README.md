# InTouch API

## Local Setup

### Environmental variables

- Create a `.env` file in the `gateway` folder with the necessary env vars (see the `.env.example`). Ask the team
- Create a `.env` file in the `services/training` folder with the necessary env vars (see the `.env.example`). Ask the team

#### Working with a local services

- From `applications/intouch/api/services`, run `docker-compose up`
- Then (from anywhere in the DXB monorepo) run the following scripts:
  - `yarn workspace @bmi/intouch-api-service-companies migrate-db` - sets up docker for the company service
  - `yarn workspace @bmi/intouch-api-service-training migrate-db` - sets up docker for the training service

### Running the services

After setting up the environment variables, and having installed the monorepo dependencies with yarn, you can run the api by:

1. `yarn workspace @bmi/intouch-api-service-training dev` (run the training service)
2. `yarn workspace @bmi/intouch-api-service-companies dev` (run the companies service)
3. `yarn workspace @bmi/intouch-graph-gateway dev` (run the gateway)
