"use strict";

const express = require("express");

const port = 5000;

const app = express();
app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));
app.listen(port, () => {
  console.log("server starting on port http://localhost:" + port);
});
