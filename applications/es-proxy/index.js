"use strict";

require("dotenv").config();

var express = require("express");
var cors = require("cors");
var request = require("request");

var app = express();

app.use(cors());

var port = Number(process.env.PORT || 3000);
var apiServerHost = process.env.ES_HOST;

// Listen for requests on all endpoints
app.use("/", (req, res) => {
  // short-circuit favicon requests for easier debugging
  if (req.url != "/favicon.ico") {
    console.log("req.method: " + req.method);
    console.log("req.url: " + req.url);

    // Request method handling: exit if not GET or POST
    if (!(req.method == "GET" || req.method == "POST")) {
      const errMethod = {
        error: req.method + " request method is not supported. Use GET or POST."
      };
      console.log("ERROR: " + req.method + " request method is not supported.");
      res.write(JSON.stringify(errMethod));
      res.end();
      return;
    }

    // pass the request to elasticsearch
    var url = apiServerHost + req.url;
    req
      .pipe(
        request(
          {
            uri: url,
            auth: {
              user: process.env.ES_USERNAME,
              pass: process.env.ES_PASSWORD
            },
            headers: {
              "accept-encoding": "none"
            },
            rejectUnauthorized: false
          },
          () => {
            // you could do something here before returning the response
          }
        )
      )
      .pipe(res); // return the elasticsearch results to the user
  }
});

// Server Listen
app.listen(port, function () {
  console.log("App server is running on http://localhost:" + port);
  // console.log(
  //   "Heroku config variable - ELASTIC_URL: " + process.env.ELASTIC_URL
  // );
  console.log("apiServerHost: " + apiServerHost);
});
