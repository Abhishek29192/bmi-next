"use strict";

const fs = require("fs");
var https = require("https");
const express = require("express");

const port = 5000;

const credentials = {
  key: fs.readFileSync("./development-certs/key.pem"),
  cert: fs.readFileSync("./development-certs/cert.pem")
};

const app = express();
app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
  console.log("server starting on port : " + port);
});
