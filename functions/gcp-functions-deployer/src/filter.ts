import { DownloadResponse } from "@google-cloud/storage/build/src/file";
import { FunctionMetadata } from "./types";

export function filterFunctionMetadata(
  content: DownloadResponse,
  sourceName: string
): FunctionMetadata[] {
  // eslint-disable-next-line no-console
  console.log(`sourceName:${sourceName}`);
  if (!content || !content[0].length) {
    return null;
  }
  const allFunctionMetadata = JSON.parse(content[0].toString());
  const curerntFunctionsMetadata: FunctionMetadata[] =
    allFunctionMetadata.filter(function (el) {
      return el.source_archive_object === sourceName;
    });

  if (!curerntFunctionsMetadata || !curerntFunctionsMetadata.length) {
    // eslint-disable-next-line no-console
    console.warn(`Metadata not found for source : ${sourceName}`);
    return null;
  }
  return curerntFunctionsMetadata;
}
