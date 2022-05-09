import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
//import { getSecret } from "@bmi-digital/functions-secret-client";
//import fetch from "node-fetch";
import logger from "@bmi-digital/functions-logger";
import { createClient, Entry, Asset } from "contentful-management";
import {
  FindOwner,
  FindMarketRole,
  FindMembership,
  GetMarketName
} from "./membership";
import { TagEntity } from "./tag";

//const SECRET_MIN_LENGTH = 10;

export const tag: HttpFunction = async (request, response) => {
  //TODO: add method checks POST, auth etc

  const owner = FindOwner(request.body);
  if (!owner) {
    logger.error({
      message: `Could not find the owner from ${JSON.stringify(request.body)}`
    });
    return response.sendStatus(400);
  }

  const client = createClient({
    accessToken: process.env.MANAGEMENT_ACCESS_TOKEN!
  });

  const space = await client.getSpace(process.env.SPACE_ID!);
  const membership = await FindMembership(space, owner);

  if (!membership) {
    logger.error({
      message: `Could not find the membership for user id ${owner}`
    });
    return response.sendStatus(400);
  }

  const role = await FindMarketRole(
    membership.roles.map((r) => r.sys.id),
    space
  );

  if (!role) {
    logger.error({
      message: `Could not find the market role in membership ID ${membership.sys.id}`
    });
    return response.sendStatus(400);
  }

  const market = GetMarketName(role.name);
  if (!market) {
    logger.error({
      message: `Could not find the market name from role ${role.name}`
    });
    return response.sendStatus(500);
  }

  let entity: Entry | Asset | undefined;
  if (request.body.sys.type === "Entry") {
    entity = request.body as Entry;
  } else if (request.body.sys.type === "Asset") {
    entity = request.body as Asset;
  } else {
    entity = undefined;
  }

  if (!entity) {
    logger.error({
      message: `Could not convert to Entry or Asset ${JSON.stringify(
        request.body
      )}`
    });
    return response.sendStatus(500);
  }
  TagEntity(entity, market);

  // TODO: this is not right!
  await entity.update();
};
