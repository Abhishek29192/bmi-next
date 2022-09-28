import { saveAs } from "file-saver";

export type Asset = {
  href: string;
  name: string;
};

export const getDownloadLink = (url: string): string => {
  const urlWithProtocol: string = url.startsWith("http")
    ? url
    : `https://${url}`;

  return new URL(urlWithProtocol)?.href;
};

export const downloadAs = saveAs;

export const getExtension = (href: Asset["href"]) => href.split(".").pop();
