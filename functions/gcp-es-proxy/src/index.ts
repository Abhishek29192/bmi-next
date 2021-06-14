import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
import fetch, { RequestInit } from "node-fetch";

const { ES_HOST } = process.env;

export const proxy: HttpFunction = async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "GET,POST");
    res.set("Access-Control-Allow-Headers", ["Content-Type", "authorization"]);
    res.set("Access-Control-Max-Age", "3600");

    return res.status(204).send("");
  } else if (req.method !== "GET" && req.method !== "POST") {
    const errMethod = {
      error: req.method + " request method is not supported. Use GET or POST."
    };
    // eslint-disable-next-line no-console
    console.error("ERROR: " + req.method + " request method is not supported.");
    return res.status(400).send(JSON.stringify(errMethod));
  } else {
    // eslint-disable-next-line no-console
    console.info("req.method: " + req.method);
    // eslint-disable-next-line no-console
    console.info("req.url: " + req.url);
    // eslint-disable-next-line no-console
    console.info("req.body: ", JSON.stringify(req.body, undefined, 2));

    const requestInit: RequestInit = {
      method: req.method,
      headers: {
        accept: req.header("accept"),
        "accept-encoding": req.header("accept-encoding"),
        "accept-language": req.header("accept-language"),
        authorization: req.header("authorization"),
        connection: req.header("connection")
      }
    };
    if (req.method === "POST") {
      requestInit.headers["content-length"] = req.header("content-length");
      requestInit.headers["content-type"] = req.header("content-type");
      requestInit.compress = false;
      requestInit.body = JSON.stringify(req.body);
    }
    try {
      const response = await fetch(ES_HOST + req.url, requestInit);
      // eslint-disable-next-line no-console
      console.debug(response);
      res.status(response.status);
      for (let [key, value] of response.headers.entries()) {
        res.setHeader(key, value);
      }
      return response.body.pipe(res);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return res.status(500).send("Request to Elasticsearch failed.");
    }
  }
};
