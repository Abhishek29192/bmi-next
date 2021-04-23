FROM node:12-alpine

WORKDIR /usr/src/app

COPY --from=eu.gcr.io/automated-style-303709/bigboi:latest /usr/src/app/package.json .
COPY --from=eu.gcr.io/automated-style-303709/bigboi:latest /usr/src/app/yarn.lock .
COPY --from=eu.gcr.io/automated-style-303709/bigboi:latest /usr/src/app/tsconfig.json .
COPY --from=eu.gcr.io/automated-style-303709/bigboi:latest /usr/src/app/babel.config.js .

COPY --from=eu.gcr.io/automated-style-303709/bigboi:latest  /usr/src/app/libraries/create-component-package ./libraries/create-component-package
COPY --from=eu.gcr.io/automated-style-303709/bigboi:latest  /usr/src/app/libraries/build-contentful ./libraries/build-contentful

COPY --from=eu.gcr.io/automated-style-303709/bigboi:latest  /usr/src/app/libraries/use-dimensions ./libraries/use-dimensions
COPY --from=eu.gcr.io/automated-style-303709/bigboi:latest  /usr/src/app/libraries/migrate ./libraries/migrate
COPY --from=eu.gcr.io/automated-style-303709/bigboi:latest  /usr/src/app/libraries/styles ./libraries/styles
COPY --from=eu.gcr.io/automated-style-303709/bigboi:latest  /usr/src/app/libraries/webpack ./libraries/webpack

COPY --from=eu.gcr.io/automated-style-303709/bigboi:latest /usr/src/app/applications/intouch-frontend/package.json /usr/src/app/applications/intouch-frontend/package.json
COPY --from=eu.gcr.io/automated-style-303709/bigboi:latest /usr/src/app/applications/intouch-frontend/public /usr/src/app/applications/intouch-frontend/public
COPY --from=eu.gcr.io/automated-style-303709/bigboi:latest /usr/src/app/applications/intouch-frontend/.next /usr/src/app/applications/intouch-frontend/.next

COPY --from=eu.gcr.io/automated-style-303709/bigboi:latest /usr/src/app/applications/intouch-frontend/next-i18next.config.js /usr/src/app/applications/intouch-frontend/next-i18next.config.js
COPY --from=eu.gcr.io/automated-style-303709/bigboi:latest /usr/src/app/applications/intouch-frontend/next.config.js /usr/src/app/applications/intouch-frontend/next.config.js
COPY --from=eu.gcr.io/automated-style-303709/bigboi:latest /usr/src/app/applications/intouch-frontend/next-env.d.ts /usr/src/app/applications/intouch-frontend/next-env.d.ts
COPY --from=eu.gcr.io/automated-style-303709/bigboi:latest /usr/src/app/applications/intouch-frontend/tsconfig.json /usr/src/app/applications/intouch-frontend/tsconfig.json

COPY --from=eu.gcr.io/automated-style-303709/bigboi:latest /usr/src/app/components /usr/src/app/components

ENV NODE_ENV production

RUN yarn install --pure-lockfile --non-interactive --cache-folder ./ycache; rm -rf ./ycache

WORKDIR /usr/src/app/applications/intouch-frontend

EXPOSE 3000
CMD ["npm", "start"]
