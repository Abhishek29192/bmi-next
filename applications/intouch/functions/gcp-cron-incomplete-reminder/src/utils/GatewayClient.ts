import axios, { AxiosInstance } from "axios";
import { getGCPToken } from "./google-auth";

const { GATEWAY_API_URL = "" } = process.env;
export type MarketDetails = {
  data: {
    markets: { nodes: Market[] };
  };
};
type Market = {
  id: number;
  domain: string;
};
export default class GatewayClient {
  private client: AxiosInstance;
  private constructor(bearer: string) {
    const userinfo = Buffer.from(
      JSON.stringify({
        source: "incomplete-reminder-function"
      })
    ).toString("base64");

    this.client = axios.create({
      baseURL: GATEWAY_API_URL,
      headers: {
        contentType: "application/json",
        authorization: bearer,
        "x-apigateway-api-userinfo": userinfo
      }
    });
  }

  public static async create(): Promise<GatewayClient> {
    const bearer = await getGCPToken(GATEWAY_API_URL);
    return new GatewayClient(bearer);
  }

  async sendReminder(market: string) {
    const payload = {
      query: `mutation sendReminder {
        sendReminderToIncompleteCompanyProfile
      }`
    };
    const { data } = await this.client.post("", payload, {
      headers: {
        "x-request-market-domain": market
      }
    });
    return data;
  }
  async getMarkets(): Promise<MarketDetails> {
    const payload = {
      query: `query markets{
        markets{
          nodes{
            id
            domain
          }
        }
      }`
    };
    const { data } = await this.client.post<MarketDetails>("", payload);
    return data;
  }
}
