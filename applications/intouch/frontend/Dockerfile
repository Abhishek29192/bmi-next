# re-build
FROM node:12-alpine as build

WORKDIR /usr/src/app

COPY ./.yarn ./.yarn
COPY ./.yarnrc ./.yarnrc
COPY yarn.lock .
COPY package.json .

COPY tsconfig.json .
COPY babel.config.js .
COPY .eslintrc.js .
COPY .lintstagedrc.js .
COPY ./@types ./@types

COPY ./libraries ./libraries
COPY ./components ./components
COPY ./applications/intouch/frontend ./applications/intouch/frontend
COPY ./applications/intouch/api/types ./applications/intouch/api/types

RUN yarn install --non-interactive --frozen-lockfile --cache-folder ./ycache && \
  rm -rf ./ycache

# TODO change to real env
ENV NEXT_PUBLIC_BASE_URL=https://tf-frontend-rfwslk3zjq-nw.a.run.app
RUN yarn workspace @bmi/intouch-frontend run build

FROM node:12-alpine

WORKDIR /usr/src/app

COPY ./.yarn ./.yarn
COPY ./.yarnrc ./.yarnrc
COPY yarn.lock .
COPY package.json .

COPY ./libraries ./libraries
COPY ./components ./components
COPY ./applications/intouch/frontend ./applications/intouch/frontend
COPY ./applications/intouch/api/types ./applications/intouch/api/types

RUN ls -l /usr/src/app/applications/intouch/frontend

COPY --from=build /usr/src/app/applications/intouch/frontend/.next ./applications/intouch/frontend/.next

RUN ls -l && \
  yarn install --frozen-lockfile --non-interactive --ignore-optional --production --cache-folder ./ycache && \
  rm -rf ./ycache

WORKDIR /usr/src/app/applications/intouch/frontend

EXPOSE 3000
CMD ["npm", "start"]
