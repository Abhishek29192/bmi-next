#!/usr/bin/env node
"use strict";

const fs = require("fs");
const convertApi = require("contentful-graph");
const { graphviz } = require("node-graphviz");

const { SPACE_ID, ACCESS_TOKEN, ENVIRONMENT } = process.env;

const getDotModel = async (spaceId, apiToken, environment) => {
  const contentTypes = await convertApi.getContentTypesFromDistributionApi(
    spaceId,
    apiToken,
    environment
  );

  const modelsMap = convertApi.contentTypesToModelMap(contentTypes);

  return convertApi.modelsMapToDot(modelsMap, {});
};

const convertToSvg = (graph) => {
  graphviz.dot(graph, "svg").then((svg) => {
    fs.writeFileSync("graph.svg", svg);
  });
};

getDotModel(SPACE_ID, ACCESS_TOKEN, ENVIRONMENT)
  .then((graph) => {
    convertToSvg(graph);
  })
  .catch((error) => {
    console.error(error);
  });
