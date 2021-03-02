"use strict";

const crypto = require("crypto");
const MurmurHash3 = require("imurmurhash");

exports.generateIdFromString = (string, useDate = true) =>
  MurmurHash3(string + useDate ? new Date().getTime().toString : "")
    .result()
    .toString();

exports.generateDigestFromData = (data) =>
  crypto.createHash("md5").update(JSON.stringify(data)).digest("hex");
