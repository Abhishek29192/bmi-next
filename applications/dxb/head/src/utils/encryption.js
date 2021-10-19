"use strict";

const { MD5, enc } = require("crypto-js");
const MurmurHash3 = require("imurmurhash");

exports.generateIdFromString = (string, useDate) => {
  const dateString = useDate ? new Date().getTime().toString() : "";

  return MurmurHash3(string + dateString)
    .result()
    .toString();
};

exports.generateDigestFromData = (data) =>
  MD5(JSON.stringify(data)).toString(enc.Hex);
