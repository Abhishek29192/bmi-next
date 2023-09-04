import logger from "@bmi-digital/functions-logger";
import { transformProduct } from "@bmi/pim-transformation";
import { fetchDataByCode } from "@bmi/pim-api";
import { PimTypes, Product as PimProduct } from "@bmi/pim-types";
import { setItemsInFirestore } from "./db";
import type { HttpFunction } from "@google-cloud/functions-framework";

/**
 *
 * @param {express.Request} req - HTTP request context
 * @param {string} req.query.productcodes - "product-code-1,product-code-2,product-code-3,..."
 * @param {express.Response} res - HTTP response context
 */
export const handlePreviewProducts: HttpFunction = async (req, res) => {
  const { LOCALE } = process.env;

  if (!process.env.GCP_PROJECT_ID) {
    logger.error({
      message: "GCP_PROJECT_ID has not been set"
    });
    return res.sendStatus(500);
  }

  if (!process.env.FIRESTORE_ROOT_COLLECTION) {
    logger.error({
      message: "FIRESTORE_ROOT_COLLECTION has not been set"
    });
    return res.sendStatus(500);
  }

  if (!LOCALE) {
    logger.error({
      message: "LOCALE has not been set"
    });
    return res.sendStatus(500);
  }

  if (!process.env.PIM_HOST) {
    logger.error({
      message: "PIM_HOST has not been set"
    });
    return res.sendStatus(500);
  }

  if (!process.env.PIM_CLIENT_ID) {
    logger.error({
      message: "PIM_CLIENT_ID has not been set"
    });
    return res.sendStatus(500);
  }

  if (!process.env.PIM_OAUTH_CLIENT_SECRET) {
    logger.error({
      message: "PIM_OAUTH_CLIENT_SECRET has not been set"
    });
    return res.sendStatus(500);
  }

  if (!process.env.PIM_CATALOG_NAME) {
    logger.error({
      message: "PIM_CATALOG_NAME has not been set"
    });
    return res.sendStatus(500);
  }

  res.set("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "GET");
    res.set("Access-Control-Allow-Headers", [
      "Content-Type",
      "Access-Control-Allow-Origin"
    ]);
    res.set("Access-Control-Max-Age", "3600");
    return res.sendStatus(204);
  }
  res.set("Content-Type", "application/json");

  const productCodes = req.query.productcodes as string | undefined;
  if (!productCodes) {
    logger.error({ message: "Product codes are missing" });
    return res.status(400).send({ message: "Product codes are missing" });
  }

  const parsedProductCodes = productCodes.split(",");
  try {
    const promises = await Promise.allSettled(
      parsedProductCodes.map((productCode) =>
        fetchDataByCode(PimTypes.Products, LOCALE, productCode, "Staged", true)
      )
    );

    const fulfilledRequests = promises.filter(
      (promise) => promise.status === "fulfilled"
    ) as PromiseFulfilledResult<PimProduct>[];

    if (!fulfilledRequests.length) {
      return res.status(500).send({ message: "Please try again later" });
    }

    const transformedProducts = fulfilledRequests.flatMap((request) =>
      transformProduct(request.value, true)
    );

    logger.info({
      message: `Transformed products: ${JSON.stringify(transformedProducts)}`
    });
    await setItemsInFirestore(transformedProducts);
    return res.status(201).send(transformedProducts);
  } catch (err) {
    logger.error({ message: (err as Error).message });
    return res.status(500).send({
      message: "Something went wrong, try again later."
    });
  }
};
