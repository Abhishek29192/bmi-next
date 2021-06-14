import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
import { request } from "express";
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
      requestInit.compress = req.header("accept-encoding")?.includes("gzip");
      requestInit.body = JSON.stringify(req.body);
    }
    // eslint-disable-next-line no-console
    console.debug(JSON.stringify(requestInit, undefined, 2));
    const response = await fetch(ES_HOST + req.url, requestInit);
    // eslint-disable-next-line no-console
    console.debug(response);
    return res.status(response.status).send(response);
  }
};
