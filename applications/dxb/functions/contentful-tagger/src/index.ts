import logger from "@bmi-digital/functions-logger";
import { tagEntity } from "@bmi/contentful-tag-utility";
import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";
import {
  Asset,
  createClient,
  Entry,
  Environment,
  Space
} from "contentful-management";
import {
  findMarketRole,
  findMembership,
  findOwner,
  getMarketName
} from "./membership";

const SECRET_MIN_LENGTH = 10;

let spaceCache: Space | undefined;
const getSpace = async (): Promise<Space> => {
  if (!spaceCache) {
    const client = createClient({
      accessToken: process.env.MANAGEMENT_ACCESS_TOKEN!
    });

    spaceCache = await client.getSpace(process.env.SPACE_ID!);
  }
  return spaceCache;
};

let environmentCache: Environment | undefined;
const getEnvironment = async (space: Space): Promise<Environment> => {
  if (!environmentCache) {
    environmentCache = await space.getEnvironment(
      process.env.CONTENTFUL_ENVIRONMENT!
    );
  }
  return environmentCache;
};

export const tag: HttpFunction = async (request, response) => {
  if (!process.env.TAGGER_REQUEST) {
    logger.error({ message: "Request secret is not set." });
    return response.sendStatus(500);
  }
  if (!process.env.MANAGEMENT_ACCESS_TOKEN) {
    logger.error({ message: "Management access token is not set." });
    return response.sendStatus(500);
  }
  if (!process.env.SPACE_ID) {
    logger.error({ message: "Space id is not set." });
    return response.sendStatus(500);
  }
  if (!process.env.CONTENTFUL_ENVIRONMENT) {
    logger.error({ message: "Contentful environment is not set." });
    return response.sendStatus(500);
  }
  if (request.method !== "POST") {
    logger.warning({
      message: `Request method ${request.method} is not allowed `
    });
    return response.sendStatus(405);
  }

  const reqSecret = process.env.TAGGER_REQUEST;
  if (
    reqSecret.length < SECRET_MIN_LENGTH ||
    request.headers.authorization?.substring("Bearer ".length) !==
      process.env.TAGGER_REQUEST
  ) {
    logger.warning({ message: "Authorisation failed." });
    return response.sendStatus(401);
  }

  const owner = findOwner(request.body);
  if (!owner) {
    logger.error({
      message: `Could not find the owner from ${JSON.stringify(request.body)}`
    });
    return response.sendStatus(400);
  }

  const space = await getSpace();
  const membership = await findMembership(space, owner);

  if (!membership) {
    logger.error({
      message: `Could not find the membership for user id ${owner}`
    });
    return response.sendStatus(400);
  }

  const role = await findMarketRole(
    membership.roles.map((r) => r.sys.id),
    space
  );

  if (!role) {
    logger.error({
      message: `Could not find the market role in membership ID ${membership.sys.id}`
    });
    return response.sendStatus(400);
  }

  const market = getMarketName(role.name);
  if (!market) {
    logger.error({
      message: `Could not find the market name from role ${role.name}`
    });
    return response.sendStatus(500);
  }

  let entity: Entry | Asset | undefined;
  const environment = await getEnvironment(space);
  if (request.body?.sys?.type === "Entry") {
    entity = await environment.getEntry(request.body.sys.id);
  } else if (request.body?.sys?.type === "Asset") {
    entity = await environment.getAsset(request.body.sys.id);
  }

  if (!entity) {
    logger.error({
      message: `Could not find Entry/Asset ${JSON.stringify(request.body)}`
    });
    return response.sendStatus(500);
  }

  logger.debug({ message: `Tagging ${entity.sys.id}` });
  const taggedNow = await tagEntity(entity, market);

  if (!taggedNow) {
    logger.info({ message: `${entity.sys.id} is already tagged.` });
    return response.sendStatus(200);
  }

  try {
    await entity.update();
    return response.sendStatus(201);
  } catch (error) {
    logger.error({ message: `${error}` });
    return response.sendStatus(500);
  }
};
