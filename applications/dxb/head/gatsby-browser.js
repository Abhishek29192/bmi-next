/* eslint-disable no-undef */
/* eslint-disable-next-line strict */
"use strict";

// exports.onServiceWorkerUpdateReady = () => {
//   window.location.reload();
// };

exports.onClientEntry = () => {
  window.addEventListener("load", () => {
    document.body.className = document.body.className.replace(/\bno-js\b/, "");
  });
};
