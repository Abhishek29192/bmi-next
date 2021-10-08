"use strict";

const crypto = require("crypto");
const MurmurHash3 = require("imurmurhash");

const generateIdFromString = (string, useDate = true) => {
  const dateString = useDate ? new Date().getTime().toString() : "";

  return MurmurHash3(string + dateString)
    .result()
    .toString();
};

exports.generateIdFromString = (string, useDate = true) =>
  generateIdFromString(string, useDate);

exports.generateDigestFromData = (data) =>
  crypto.createHash("md5").update(JSON.stringify(data)).digest("hex");

exports.generateSystemPath = ({ code, name }) => {
  const id = generateIdFromString(code, false);
  return `s/${name.replace(new RegExp(/([\s_])/gi), "-").toLowerCase()}/${id}`;
};
