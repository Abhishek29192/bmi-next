import { DownloadResponse } from "@google-cloud/storage/build/src/file";

export function filterFunctionMetadata(
  content: DownloadResponse,
  sourceName: string
): string {
  // eslint-disable-next-line no-console
  console.log(`sourceName:${sourceName}`);
  if (!content) {
    return null;
  }
  const allFunctionMetadata = JSON.parse(content[0].toString());
  const curerntFunctionMetadata = allFunctionMetadata.find(function (el) {
    return el.source_archive_object === sourceName;
  });

  if (!curerntFunctionMetadata) {
    // eslint-disable-next-line no-console
    console.warn(`Metadata not found for source : ${sourceName}`);
    return null;
  }
  return curerntFunctionMetadata;
}
