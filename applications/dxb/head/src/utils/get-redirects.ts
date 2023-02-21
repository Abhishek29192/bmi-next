import fs from "fs";
import fetch from "node-fetch";
import toml from "toml";

export type Redirect = {
  from: string;
  to: string;
  force?: boolean;
  status?: string;
};

export const getRedirects = async (
  redirectsFileName: string,
  contentfulRedirectsFileUrl?: string
): Promise<Redirect[]> => {
  if (contentfulRedirectsFileUrl) {
    try {
      const result = await fetch(`https:${contentfulRedirectsFileUrl}`);
      if (result.ok) {
        const text = await result.text();
        return toml.parse(text)?.redirects;
      }
    } catch (error) {
      console.log(
        `Could not fetch redirects file: ${redirectsFileName} from Contentful. Error: ${error.message}`
      );
    }
  }

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  if (fs.existsSync(redirectsFileName)) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const redirectsToml = fs.readFileSync(redirectsFileName, "utf8");
    return toml.parse(redirectsToml)?.redirects;
  }

  return [];
};
