"use strict";

module.exports.description = "Impose brand logo mandatory";

module.exports.up = (migration) => {
  const brandLandingPage = migration.editContentType("brandLandingPage");
  brandLandingPage.editField("brandLogo").required(true);
};

module.exports.down = (migration) => {
  const brandLandingPage = migration.editContentType("brandLandingPage");
  brandLandingPage.editField("brandLogo").required(false);
};
