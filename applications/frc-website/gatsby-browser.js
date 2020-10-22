/* eslint-disable no-undef */
"use strict";

exports.onRouteUpdate = ({ location }) => {
  if (window.gtag) {
    window.gtag("config", process.env.FRC_GA_CODE, {
      page_path: location.pathname
    });
  }
};
