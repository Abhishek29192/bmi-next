"use strict";

const fs = require("fs");
const express = require("express");
const hash = require("./config");

const port = 3000;

const app = express();
app.get("/login", (req, res) => {
  let data = fs.readFileSync(__dirname + "/index.html", { encoding: "utf8" });

  return res.send(data.replace("@@config@@", hash));
});
app.get("/reset-password", (req, res) => {
  let data = fs.readFileSync(__dirname + "/reset-password.html", {
    encoding: "utf8"
  });
  return res.send(data);
});
app.listen(port, () => {
  console.log("server starting on port http://localhost:" + port);
});
