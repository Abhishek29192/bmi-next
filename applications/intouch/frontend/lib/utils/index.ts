import { Request } from "express";
import { DocumentContext } from "next/dist/next-server/lib/utils";

export const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium"
  } as any).format(new Date(date?.substring(0, 10)));

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
  nodes?.sort((a, b) => a?.[field]?.localeCompare(b?.[field]));
