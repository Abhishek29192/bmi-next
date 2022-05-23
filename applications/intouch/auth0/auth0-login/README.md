## Development on local

- rename the package.json.noinstall (**DO NOT PUSH THIS FILE**)
- run yarn workspace @bmi/intouch-frontend-auth0-login dev

## Current Deployment Approach

- Generate html using command in package.json (build:dev|build:uat|build:preprod|build:prod) on **local** machine.
- Copy the generated static html under **dist/** to **auth0 template Web UI**
- if js or css has been changed. Upload then to the relevant cloud storage.

## To know

In order to work with this app please remove the `noInstall` from the package.json, when finished add it again in order to do not install the app in the pipeline
