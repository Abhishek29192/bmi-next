import { DownloadResponse } from "@google-cloud/storage/build/src/file";

export function filterFunctionMetadata(
  content: DownloadResponse,
  sourceName: string
): string {
  // eslint-disable-next-line no-console
  console.log(`sourceName:${sourceName}`);
  // console.log(`Download response: ${content}`);
  if (!content) {
    return null;
  }
  var allFunctionMetadata = JSON.parse(content[0].toString());
  var curerntFunctionMetadata = allFunctionMetadata.filter(function (el) {
    return el.source_archive_object === sourceName;
  });
  if (curerntFunctionMetadata.length >= 1) {
    return curerntFunctionMetadata[0];
  }
  return null;
}
