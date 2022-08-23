import { argv } from "process";
import fs from "fs";
import toml from "toml";
import fetch from "node-fetch";
import { parseStringPromise } from "xml2js";

type Redirect = { from: string; to: string; force?: string; status?: number };

const failedRedirects: Redirect[] = [];
const redundantRedirects: Redirect[] = [];
const brokenRedirects: Redirect[] = [];

const main = async (host?: string, redirectsFile?: string) => {
  if (!host || !redirectsFile) {
    throw new Error(
      "Please pass in the host and the path to the redirects file."
    );
  }

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const redirectsContent = fs.readFileSync(redirectsFile, "utf8");
  const redirects: {
    redirects: Redirect[];
  } = toml.parse(redirectsContent);
  await Promise.allSettled(
    redirects.redirects.map(async (redirect: Redirect) => {
      const fromUrl = redirect.from.startsWith("https://")
        ? redirect.from
        : `${host}${redirect.from}`;
      const response = await fetch(fromUrl);
      if (
        response.status !== (redirect.status || 301) &&
        response.status !== 200
      ) {
        console.error(
          `${redirect.from} didn't return an acceptable status code`
        );
        failedRedirects.push(redirect);
        return;
      }

      const body = await response.text();
      const parsedBody = await parseStringPromise(body);
      const normalisedRedirectTo = redirect.to.endsWith("/")
        ? redirect.to
        : `${redirect.to}/`;

      // Should be a meta redirect
      if (response.status === 200) {
        const meta = parsedBody.meta;
        const content: string[] = meta.$.content?.split(";");

        // Destination is an actual page, not a meta redirect
        if (meta?.$["http-equiv"] !== "refresh" || !content) {
          redundantRedirects.push(redirect);
        }

        const redirectUrl = content[1]?.split("URL='")[1]?.replace(/'/g, "");
        // Handle Gatsby appending '/' to the end of paths
        const redirectTo = redirectUrl.endsWith("/")
          ? redirect.to.endsWith("/")
            ? redirect.to
            : `${redirect.to}/`
          : redirect.to;
        if (redirectUrl !== redirectTo) {
          console.error(
            `${redirect.from} didn't redirect to ${redirect.to}. Instead it is redirecting to ${redirectUrl}.`
          );
          failedRedirects.push(redirect);
        }
      } else if (response.status === 301 || response.status === 302) {
        const locationHeader = response.headers.get("Location");
        if (!locationHeader || locationHeader !== normalisedRedirectTo) {
          console.error(
            `${redirect.from} didn't redirect to ${redirect.to}. Instead it is redirecting to ${locationHeader}`
          );
          failedRedirects.push(redirect);
        }
      } else {
        console.error(
          `${redirect.from} didn't redirect to ${redirect.to} as it could not be found.`
        );
        failedRedirects.push(redirect);
      }

      const redirectResponse = await fetch(
        normalisedRedirectTo.startsWith("https://")
          ? normalisedRedirectTo
          : `${host}${normalisedRedirectTo}`
      );
      if (redirectResponse.status !== 200) {
        brokenRedirects.push(redirect);
      }
    })
  );

  console.log("");
  console.log("Redundant redirects (should be removed):");
  redundantRedirects.forEach((redirect) => console.log(redirect.from));
  console.log("");
  console.log(
    "Unexpected redirects (trying to redirect to somewhere other than configured):"
  );
  failedRedirects.forEach((redirect) =>
    console.log(`${redirect.from} -> ${redirect.to}`)
  );
  console.log("");
  console.log("Broken redirects (destination doesn't exist):");
  brokenRedirects.forEach((redirect) =>
    console.log(`${redirect.from} -> ${redirect.to}`)
  );
};

main(argv[2], argv[3]).catch((error) => {
  console.error(error);
  process.exit(1);
});
