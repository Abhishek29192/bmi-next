"use strict";

const fs = require("fs");
require("dotenv").config();
const { createServer } = require("https");
const next = require("next");
const express = require("express");

const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev
});
const handle = app.getRequestHandler();
const httpsOptions = {
  key: fs.readFileSync("./development-certs/key.pem"),
  cert: fs.readFileSync("./development-certs/cert.pem")
};

app.prepare().then(() => {
  const expressApp = express();
  expressApp.all("*", handle);
  createServer(httpsOptions, expressApp).listen(3000, () => {
    console.log(`🚀 Server started on ${process.env.NEXT_PUBLIC_BASE_URL}`);
  });
});
