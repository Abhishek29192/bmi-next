# InTouch API Gateway

## Development

Install dependencies using [Yarn](https://yarnpkg.org/):

    yarn install

    yarn start

## Deployment

> This is a sample process to deploy Google Cloud

    yarn build

To authenticate Google Cloud, enter the following:

    gcloud auth login

To create your project, enter the following:

    gcloud projects create <project_name> --set-as-default

To provide detailed information about a project, enter the following:

    gcloud projects describe <project_name>

To deploy your app, you need to create an app in a region:

    gcloud app create --project=<project_name>

To deploy your app, enter the following:

    gcloud app deploy

To preview your app, enter the following:

    gcloud app browse
