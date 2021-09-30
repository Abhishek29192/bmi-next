/* eslint-disable no-undef */
/* eslint-disable-next-line strict */
"use strict";

require("./src/styles/global.css");

exports.onServiceWorkerUpdateReady = () => {
  window.location.reload();
};
