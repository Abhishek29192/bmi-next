/* eslint-disable import/no-extraneous-dependencies */

"use strict";

const MARKET = "no";
const APP_ENV = "uat";

const { merge } = require("webpack-merge");
const webpackConfiguration = require("../webpack.config");
const environment = require("./environment");

const localConfig = JSON.stringify({
  icon: "https://storage.googleapis.com/intouch-public-assets/auth0/bmi-logo.png",
  assetsUrl: "",
  auth0Domain: "dev-78gkj0yx.eu.auth0.com",
  auth0Tenant: "dev-78gkj0yx",
  clientConfigurationBaseUrl: "https://dev-78gkj0yx.eu.auth0.com/",
  callbackOnLocationHash: false,
  callbackURL: "https://dev-no.intouch.bmigroup.com/api/auth/callback",
  cdn: "https://cdn.auth0.com/",
  clientID: "mtDcCctmSekwsNm8ZCEN1oyXj8BgEh6T",
  dict: { signin: { title: "Default App" } },
  extraParams: {
    protocol: "oauth2",
    scope: "openid profile email",
    response_type: "code",
    audience: "https://dev-api.intouch.bmigroup.com",
    market: MARKET,
    env: APP_ENV,
    nonce: "thciB3v9ggiXOMFhbaZuWTqKyuCFG_t9Bh6_Fn44sRY",
    code_challenge: "62cUNMe4EazNzvJlYEFzcahTQamykn4y8U1U9i4gjQs",
    code_challenge_method: "S256",
    _csrf: "TvhLKSfC-xPdBEyrm_tHjfd4RsGL2LMlirHw",
    _intstate: "deprecated",
    state:
      "hKFo2SBTd2V6MUhsbjlWUTAwQzJpaGFUSnFkWmdSYjJGVkctYqFupWxvZ2luo3RpZNkgc2ktRFVEeEE1Nk5JbEhvVlZaanZ2QWdOcUtJUUlYakWjY2lk2SBtdERjQ2N0bVNla3dzTm04WkNFTjFveVhqOEJnRWg2VA"
  },
  internalOptions: {
    protocol: "oauth2",
    scope: "openid profile email",
    response_type: "code",
    audience: "https://dev-api.intouch.bmigroup.com",
    market: MARKET,
    env: APP_ENV,
    nonce: "thciB3v9ggiXOMFhbaZuWTqKyuCFG_t9Bh6_Fn44sRY",
    code_challenge: "62cUNMe4EazNzvJlYEFzcahTQamykn4y8U1U9i4gjQs",
    code_challenge_method: "S256",
    _csrf: "TvhLKSfC-xPdBEyrm_tHjfd4RsGL2LMlirHw",
    _intstate: "deprecated",
    state:
      "hKFo2SBTd2V6MUhsbjlWUTAwQzJpaGFUSnFkWmdSYjJGVkctYqFupWxvZ2luo3RpZNkgc2ktRFVEeEE1Nk5JbEhvVlZaanZ2QWdOcUtJUUlYakWjY2lk2SBtdERjQ2N0bVNla3dzTm04WkNFTjFveVhqOEJnRWg2VA"
  },
  widgetUrl: "https://cdn.auth0.com/w2/auth0-widget-5.1.min.js",
  isThirdPartyClient: false,
  authorizationServer: {
    url: "https://dev-78gkj0yx.eu.auth0.com",
    issuer: "https://dev-78gkj0yx.eu.auth0.com/"
  },
  colors: { page_background: "#f0f0f0", primary: "#009FE3" }
});

module.exports = merge(webpackConfiguration, {
  mode: "development",

  /* Manage source maps generation process */
  devtool: "eval-source-map",

  /* Development Server Configuration */
  devServer: {
    contentBase: environment.paths.output,
    watchContentBase: true,
    publicPath: "/",
    open: true,
    historyApiFallback: true,
    compress: true,
    overlay: true,
    hot: false,
    watchOptions: {
      poll: 300
    },
    ...environment.server
  },

  /* File watcher options */
  watchOptions: {
    aggregateTimeout: 300,
    poll: 300,
    ignored: /node_modules/
  },

  module: {
    rules: [
      {
        test: /.*\.html$/,
        loader: "raw-loader"
      },
      {
        test: /.*\.html$/,
        loader: "string-replace-loader",
        options: {
          multiple: [
            {
              search: /@@config@@/g,
              replace: Buffer.from(localConfig).toString("base64")
            },
            {
              search: "@@non_roof_img@@",
              replace:
                "https://storage.googleapis.com/bmi-np-intouch-gcs-publicstorage-euw3-dev/auth0/images/bmi_non_roofpro_intouch.jpg"
            },
            {
              search: "@@roof_imf@@",
              replace:
                "https://storage.googleapis.com/bmi-np-intouch-gcs-publicstorage-euw3-dev/auth0/images/bmi_roofpro_intouch.jpg"
            }
          ]
        }
      }
    ]
  },

  plugins: webpackConfiguration.plugins
});
