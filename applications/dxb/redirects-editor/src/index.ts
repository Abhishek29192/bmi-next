import fs from "fs";
import { parseArgs } from "util";
import toml from "@iarna/toml";
import csv from "csvtojson";
import { Redirect } from "@bmi/head/src/utils/get-redirects";

const validCsvContents = (csvRedirects: { [x: string]: unknown }[]) =>
  csvRedirects.length > 0 &&
  csvRedirects.every(
    (csvRedirect) =>
      "from" in csvRedirect &&
      "to" in csvRedirect &&
      !!csvRedirect.from &&
      !!csvRedirect.to
  );

const getNewRedirects = async (
  csvFile?: string,
  from?: string,
  to?: string,
  status?: string
): Promise<Redirect[]> => {
  if (csvFile) {
    const csvRedirects = await csv().fromFile(csvFile);
    if (!validCsvContents(csvRedirects)) {
      throw new Error(
        "Please provide a CSV file with both the 'from' and 'to' values for all redirects."
      );
    }
    return csvRedirects.map(
      (redirect: { from: string; to: string; status?: string }) => ({
        from: redirect.from,
        to: redirect.to,
        status: redirect.status ? Number.parseInt(redirect.status) : 301
      })
    );
  }

  if (!from || !to) {
    throw new Error("Please provide a 'from' and a 'to' for the redirect.");
  } else {
    return [{ from, to, status: status ? Number.parseInt(status) : 301 }];
  }
};

/**
 * Ensures the URL conforms to the following:
 * * is only URL encoded the once
 * * does not have a `/` at the end
 * * has a `/` or `https://` at the beginning
 * * removes the host if the flag is set
 *
 * @param url the URL to format
 * @param removeHost whet to remove the host from the URL
 */
const formatUrl = (url: string, removeHost?: boolean): string => {
  let formattedUrl = url;
  while (formattedUrl.includes("%")) {
    formattedUrl = decodeURI(formattedUrl);
  }
  formattedUrl =
    formattedUrl.startsWith("https://") || formattedUrl.startsWith("/")
      ? formattedUrl
      : `/${formattedUrl}`;
  formattedUrl = formattedUrl.endsWith("/")
    ? formattedUrl.substring(0, formattedUrl.length - 1)
    : formattedUrl;
  formattedUrl =
    formattedUrl.startsWith("https://") && removeHost
      ? formattedUrl.replace(new URL(formattedUrl).origin, "")
      : formattedUrl;
  return encodeURI(formattedUrl);
};

const normaliseUrls = (redirect: Redirect, removeHost?: boolean) => ({
  ...redirect,
  from: formatUrl(redirect.from, removeHost),
  to: formatUrl(redirect.to, removeHost)
});

const dedupe = (
  reducedRedirects: Redirect[],
  redirect: Redirect
): Redirect[] => [
  ...reducedRedirects.filter(
    (existingRedirect) => existingRedirect.from !== redirect.from
  ),
  redirect
];

const removeMultipleHops = (
  correctedRedirects: Redirect[],
  redirect: Redirect
): Redirect[] => {
  const foundRedirects = correctedRedirects.filter(
    (searchRedirect) => redirect.to === searchRedirect.from
  );
  if (foundRedirects.length > 0) {
    return [
      ...correctedRedirects,
      {
        ...redirect,
        to: foundRedirects[foundRedirects.length - 1].to
      }
    ];
  }
  return [...correctedRedirects, redirect];
};

const sortBySpecificity = (redirect1: Redirect, redirect2: Redirect) =>
  redirect2.from.localeCompare(redirect1.from);

export const main = async () => {
  const {
    values: { redirectsFile, from, to, status, csvFile, removeHost }
  } = parseArgs({
    options: {
      redirectsFile: {
        type: "string",
        short: "r"
      },
      from: {
        type: "string",
        short: "f"
      },
      to: {
        type: "string",
        short: "t"
      },
      status: {
        type: "string",
        short: "s"
      },
      csvFile: {
        type: "string",
        short: "c"
      },
      removeHost: {
        type: "boolean",
        short: "h"
      }
    },
    strict: true
  });

  if (!redirectsFile) {
    throw new Error("Please pass in the path to the redirects file.");
  }

  const newRedirects = await getNewRedirects(csvFile, from, to, status);

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const redirectsContent = fs.readFileSync(redirectsFile, "utf8");
  const tomlContents = toml.parse(redirectsContent);
  const existingRedirects: Redirect[] =
    "redirects" in tomlContents ? (tomlContents.redirects as Redirect[]) : [];

  const updatedRedirects = [...existingRedirects, ...newRedirects]
    .map((redirect) => normaliseUrls(redirect, removeHost))
    .reduce(dedupe, [])
    .reverse()
    .reduce(removeMultipleHops, [])
    .sort(sortBySpecificity);

  // Write out toml
  const tomlRedirects = toml.stringify({ redirects: updatedRedirects });
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  fs.writeFileSync(redirectsFile, tomlRedirects);
};

// istanbul ignore if - can't override require.main
if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
