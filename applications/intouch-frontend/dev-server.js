"use strict";

const fs = require("fs");
require("dotenv").config();
const { parse } = require("url");
const { createServer } = require("https");
const next = require("next");

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
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, () => {
    console.log("> Server started on https://localhost:3000/");
  });
});
