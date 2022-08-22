import { argv } from "process";
import fs from "fs";
import toml from "toml";
import fetch from "node-fetch";
import { parseStringPromise } from "xml2js";

type Redirect = { from: string; to: string; force?: string; status?: number };

const failedRedirects: string[] = [];
const redundantRedirects: string[] = [];
const brokenRedirects: string[] = [];

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
        failedRedirects.push(redirect.from);
        return;
      }

      const body = await response.text();
      const parsedBody = await parseStringPromise(body);
      const meta = parsedBody.meta;
      const content: string[] = meta.$.content?.split(";");

      if (meta?.$["http-equiv"] !== "refresh" || !content) {
        redundantRedirects.push(redirect.from);
      }

      const redirectUrl = content[1]?.split("=")[1]?.replace(/'/g, "");
      const redirectTo =
        redirectUrl.endsWith("/") && redirect.to.endsWith("/")
          ? redirect.to
          : `${redirect.to}/`;
      if (redirectUrl !== redirectTo) {
        console.error(`${redirect.from} didn't redirect to ${redirect.to}`);
        failedRedirects.push(redirect.from);
      }

      const redirectResponse = await fetch(
        redirectTo.startsWith("https://") ? redirectTo : `${host}${redirectTo}`
      );
      if (redirectResponse.status !== 200) {
        brokenRedirects.push(redirect.from);
      }
    })
  );

  console.log("");
  console.log("Redundant redirects:");
  redundantRedirects.forEach((redirect) => console.log(redirect));
  console.log("");
  console.log("Failed redirects:");
  failedRedirects.forEach((redirect) => console.log(redirect));
  console.log("");
  console.log("Broken redirects:");
  brokenRedirects.forEach((redirect) => console.log(redirect));
};

main(argv[2], argv[3]).catch((error) => {
  console.error(error);
  process.exit(1);
});
