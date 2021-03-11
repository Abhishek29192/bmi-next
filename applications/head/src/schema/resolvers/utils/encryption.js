"use strict";

const crypto = require("crypto");
const MurmurHash3 = require("imurmurhash");

exports.generateIdFromString = (string, useDate = true) => {
  const dateString = useDate ? new Date().getTime().toString() : "";

  return MurmurHash3(string + dateString)
    .result()
    .toString();
};

exports.generateDigestFromData = (data) =>
  crypto.createHash("md5").update(JSON.stringify(data)).digest("hex");
