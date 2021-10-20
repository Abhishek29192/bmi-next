"use strict";

const { generateIdFromString } = require("./encryption");

exports.generateSystemPath = ({ code, name }) => {
  const id = generateIdFromString(code, false);
  return `s/${name.replace(new RegExp(/([\s_])/gi), "-").toLowerCase()}-${id}`;
};
