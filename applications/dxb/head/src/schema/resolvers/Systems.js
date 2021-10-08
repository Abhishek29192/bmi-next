"use strict";

const { generateSystemPath } = require("./utils/systems");

module.exports = {
  path: {
    async resolve(source) {
      return generateSystemPath(source);
    }
  }
};
