# re-build
FROM node:12-alpine as build

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
COPY babel.config.js .
COPY .eslintrc.js .
COPY .lintstagedrc.js .
COPY ./@types ./@types

COPY ./libraries ./libraries
COPY ./components ./components
COPY ./applications/intouch/shared ./applications/intouch/shared
COPY ./applications/intouch/frontend ./applications/intouch/frontend
COPY ./applications/intouch/api/types ./applications/intouch/api/types

RUN yarn install --non-interactive --cache-folder ./ycache && \
  rm -rf ./ycache

RUN yarn workspace @bmi/intouch-frontend run build

FROM node:12-alpine

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .

COPY ./libraries ./libraries
COPY ./components ./components
COPY ./applications/intouch/shared ./applications/intouch/shared
COPY ./applications/intouch/frontend ./applications/intouch/frontend
COPY ./applications/intouch/api/types ./applications/intouch/api/types

RUN ls -l /usr/src/app && \
  chmod +x ./applications/intouch/frontend/secret-fetch.sh 

RUN ls -l /usr/src/app/applications/intouch/frontend

COPY --from=build /usr/src/app/applications/intouch/frontend/.next ./applications/intouch/frontend/.next

RUN ls -l && \
  yarn install --frozen-lockfile --non-interactive --ignore-optional --production --cache-folder ./ycache && \
  rm -rf ./ycache

WORKDIR /usr/src/app/applications/intouch/frontend

EXPOSE 3000
CMD ["sh", "secret-fetch.sh"]
