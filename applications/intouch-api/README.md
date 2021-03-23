# InTouch API

## Local Setup

### Environmental variables

- Create a `.env` file in the `gateway` folder with the necessary env vars (see the `.env.example`). Ask the team
- Create a `.env` file in the `services/training` folder with the necessary env vars (see the `.env.example`). Ask the team

### Running the services

After setting up the environment variables, and having installed the monorepo dependencies with yarn, you can run the api by:

- `yarn workspace @bmi/intouch-api-gateway dev` (run the gateway)
- `yarn workspace @bmi/intouch-api-service-training dev` (run the training service)

#### Working with a local company service

<!-- TODO: Proper instructions -->

For now please work with a remote company service. If you need to work with company service running locally, ask the team. TBD

### Making authenticated requests

You will need to pass the Auth0 `access_token` as a Bearer token for each request, into the `Authorization` header: `Authorization: Bearer {access_token}`.

To get the `access_token`:

- Sign up as a user on InTouch. You can do so from InTouch frontend.
  - If you are accessing the frontend on localhost, and you get an error on Chrome related to the https certificate try out [this solution](https://stackoverflow.com/questions/58802767/no-proceed-anyway-option-on-neterr-cert-invalid-in-chrome-on-macos/63539455#63539455).
- Login to InTouch Frontend, or simply refresh the page if already logged in.
- Open the Chrome Developer Tools. On the network tab, you should see a request for `/oauth/token` to Auth0. Inspect the JSON response, and copy the `access_token` value.

### Working with the GraphQL playground UI

If you want to access the GraphQL Playground to make requests to the InTouch API, you will need to pass the Authorization header before requesting access to the page.

To do so, you can use a browser extension that modifies Auth headers. For example, [ModHeader](https://bewisse.com/modheader/).

You can add a `Authorization: Bearer {access_token}` header.
**Make sure to add a filter condition, to apply this header only for localhost!** If not, it will probably mess up authentication for all other websites you will browse!
