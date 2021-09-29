"use strict";

const { generateIdFromString } = require("./utils/encryption");

module.exports = {
  path: {
    async resolve(source) {
      if (source.approvalStatus === "approved") {
        const id = generateIdFromString(source.code, false);
        return `s/${source.name
          .replace(new RegExp(/([\s_])/gi), "-")
          .toLowerCase()}/${id}`;
      }
      return null;
    }
  }
};
