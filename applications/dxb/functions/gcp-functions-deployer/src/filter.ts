import logger from "@bmi-digital/functions-logger";
import type { DownloadResponse } from "@google-cloud/storage";
import type { FunctionMetadata } from "./types";

export function filterFunctionMetadata(
  content: DownloadResponse,
  sourceName: string
): FunctionMetadata[] | null {
  logger.info({ message: `sourceName:${sourceName}` });
  if (!content || !content[0].length) {
    return null;
  }
  const allFunctionMetadata = JSON.parse(content[0].toString());
  const curerntFunctionsMetadata: FunctionMetadata[] =
    allFunctionMetadata.filter(function (el: FunctionMetadata) {
      return el.source_archive_object === sourceName;
    });

  if (!curerntFunctionsMetadata || !curerntFunctionsMetadata.length) {
    logger.warning({
      message: `Metadata not found for source : ${sourceName}`
    });
    return null;
  }
  return curerntFunctionsMetadata;
}
