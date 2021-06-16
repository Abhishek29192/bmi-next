#!/usr/bin/env node
"use strict";

const fs = require("fs");
const convertApi = require("contentful-graph");
const { graphviz } = require("node-graphviz");

const { SPACE_ID, ACCESS_TOKEN, ENVIRONMENT } = process.env;

convertApi
  .getContentTypesFromDistributionApi(SPACE_ID, ACCESS_TOKEN, ENVIRONMENT)
  .then((contentTypes) => {
    fs.writeFileSync("content-types.json", JSON.stringify(contentTypes));
    return convertApi.contentTypesToModelMap(contentTypes);
  })
  .then((contentTypesWithRelationships) => {
    fs.writeFileSync(
      "content-types-with-relationships.json",
      JSON.stringify(contentTypesWithRelationships)
    );
    return convertApi.modelsMapToDot(contentTypesWithRelationships, {});
  })
  .then((graph) => graphviz.dot(graph, "svg"))
  .then((svg) => {
    fs.writeFileSync("graph.svg", svg);
  })
  .catch((error) => {
    console.error(error);
  });
