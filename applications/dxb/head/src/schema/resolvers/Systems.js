"use strict";

const { generateIdFromString } = require("./utils/encryption");

module.exports = {
  path: {
    async resolve(source) {
      const id = generateIdFromString(source.code, false);
      console.log(
        `s/${source.name
          .replace(new RegExp(/([\s])/gi), "-")
          .toLowerCase()}/${id}`
      );
      return `s/${source.name
        .replace(new RegExp(/([\s_])/gi), "-")
        .toLowerCase()}/${id}`;
    }
  }
};
