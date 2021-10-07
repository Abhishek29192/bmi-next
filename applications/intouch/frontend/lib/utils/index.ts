import { Request } from "express";

export const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium"
  } as any).format(new Date(date?.substring(0, 10)));

type MarketEnvProps = {
  currentHost: string;
  environment: string;
  market: string;
};

export const getMarketAndEnvFromReq = ({
  headers
}: Request): MarketEnvProps => {
  let market = null;
  let environment = null;

  const { host } = headers;

  const [subdomain] = host.split(".");

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
    market
  };
};
