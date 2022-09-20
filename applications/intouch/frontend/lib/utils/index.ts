import { Request } from "express";
import { DocumentContext } from "next/dist/next-server/lib/utils";

export const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium"
  } as any).format(new Date(date.substring(0, 10)));

type MarketEnvProps = {
  currentHost: string;
  environment: string;
  market: string;
  paths: string[];
};

export const getMarketAndEnvFromReq = ({
  headers
}: Request | DocumentContext["req"]): MarketEnvProps => {
  let market = null;
  let environment = null;

  const { host } = headers;

  const paths = host.split(".");
  const subdomain = paths[0];

  if (subdomain.indexOf("-") !== -1) {
    const parts = subdomain.split("-");
    environment = parts[0];
    market = parts[1];
  } else {
    market = subdomain;
  }

  return {
    currentHost: host,
    environment,
    market,
    paths
  };
};

export const sortArrayByField = (nodes: any[], field: string) =>
  // eslint-disable-next-line security/detect-object-injection
  nodes?.sort((a, b) => a[field]?.localeCompare(b[field]));

export const getFileExtension = (
  filename: string
): { name: string; extension: string } => ({
  name: filename.substring(
    0,
    (filename.lastIndexOf(".") > -1 && filename.lastIndexOf(".")) ||
      filename.length
  ),
  extension: filename.substring(filename.lastIndexOf(".") + 1, filename.length)
});

export const getOneTrustToken = (str: string, lang: string) => {
  try {
    const marketsOneTrustMap = JSON.parse(str);
    // eslint-disable-next-line security/detect-object-injection
    return marketsOneTrustMap[lang] || null;
  } catch (e) {
    return false;
  }
};

export const parseMarketTag = (market: string) => {
  // TODO: Change tags system names in contentful in future to be same as domain. market__my
  const tags = {
    en: "market__endor",
    dk: "market__denmark",
    de: "market__germany",
    it: "market__italy",
    no: "market__norway",
    pt: "market__portugal",
    es: "market__spain",
    fi: "market__finland",
    my: "market__malaysia"
  };
  // eslint-disable-next-line security/detect-object-injection
  return tags[market] || "non_existing_tag";
};
