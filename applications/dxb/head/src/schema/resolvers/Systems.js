"use strict";

const { generateSystemPath } = require("./utils/encryption");

module.exports = {
  path: {
    async resolve(source) {
      return generateSystemPath(source);
    }
  }
};
