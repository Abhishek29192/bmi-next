"use strict";

const { generateIdFromString } = require("./encryption");

exports.generateSystemPath = ({ code, name }) => {
  console.log(code);
  const id = generateIdFromString(code, false);
  return `s/${name.replace(new RegExp(/([\s_])/gi), "-").toLowerCase()}/${id}`;
};
