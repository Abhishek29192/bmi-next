import fs from "fs";
import fetch from "node-fetch";
import toml from "toml";

export const getRedirects = async (
  redirectsFileName: string,
  contentfulRedirectsFileUrl?: string
) => {
  if (contentfulRedirectsFileUrl) {
    try {
      const result = await fetch(`https:${contentfulRedirectsFileUrl}`);
      const text = await result.text();
      return toml.parse(text)?.redirects;
    } catch (error) {
      console.log(
        `Could not fetch redirects file: ${redirectsFileName} from Contentful. Error: ${error.message}`
      );
    }
  }

  const defaultRedirectsFilePath = `./${redirectsFileName}`;
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  if (fs.existsSync(defaultRedirectsFilePath)) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const redirectsToml = fs.readFileSync(defaultRedirectsFilePath, "utf8");
    return toml.parse(redirectsToml)?.redirects;
  }
};
