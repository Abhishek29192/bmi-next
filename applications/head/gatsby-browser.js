/* eslint-disable no-undef */
/* eslint-disable-next-line strict */
"use strict";

exports.onServiceWorkerUpdateReady = () => {
  const answer = window.confirm(
    `This application has been updated. ` +
      `Reload to display the latest version?`
  );
  if (answer === true) {
    window.location.reload();
  }
};
