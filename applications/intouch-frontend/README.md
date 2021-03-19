# InTouch Frontend

## Project Background

To know more about BMI InTouch, see the related [Confluence documents](https://bmigroup.atlassian.net/wiki/spaces/IRP/pages/1858797800/Technical+Blueprint).

## Getting Started

- First, follow the monoropo instructions (root directory README). You should have installed all the necessary dependencies.

- Create self-signed certificate
  `openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem`

- Move the cert.pem & kjey.pen in the folder `./development-certs`

- run `yarn workspace @bmi/intouch-frontend dev-https` from the monorepo root directory

- visit [https://localhost:3000](https://localhost:3000)

## Workspaces

See the [Work with Workspaces](https://gitlab.com/bmi-digital/dxb#work-with-workspaces) section in the monorepo root README file.

### Importing a new component/library from other packages

See [monorepo root README](https://gitlab.com/bmi-digital/dxb/-/tree/master#work-with-workspaces).

Example: `yarn workspace @bmi/intouch-frontend add @bmi/button@0.0.0`

## Some Gotcha's

- The React version in this directory's `package.json` needs to be the same as the React version used by the DXB components.
