"use strict";

const path = require("path");

module.exports = {
  paths: {
    /* Path to source files directory */
    source: path.resolve(__dirname, "../src/"),

    /* Path to built files directory */
    output: path.resolve(__dirname, "../dist/local/")
  },
  server: {
    host: "localhost",
    port: 3000
  },
  limits: {
    /* Font files size in bytes. Below this value the font file will be served as DataURL (inline base64). */
    fonts: 8192
  }
};
