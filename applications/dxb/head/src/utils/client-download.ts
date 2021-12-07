import axios from "axios";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { getValidHttpUrl } from "./url-helpers";

export type Asset = {
  href: string;
  name: string;
};

export const getDownloadLink = (url: string): string => {
  const urlWithProtocol: string = url.startsWith("http")
    ? url
    : `https://${url}`;
  return getValidHttpUrl(urlWithProtocol);
};

export const downloadAs = saveAs;

export const getExtension = (href: Asset["href"]) => href.split(".").pop();

const clientDownload = async (assets: Asset[]) => {
  let zip = new JSZip();

  await Promise.all(
    assets.map(async ({ href, name }) => {
      try {
        const response = await axios.get(href, {
          headers: { "Content-Type": "application/octet-stream" },
          responseType: "blob"
        });
        zip.file(name, response.data);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Error: ${href}`, error);
      }
    })
  );

  const zipBlob = await zip.generateAsync({ type: "blob" });
  saveAs(zipBlob, "assets.zip");
};

export default clientDownload;
