import fetch, { Request } from "node-fetch";
import { ReportRecord } from "./__tests__/helper";

const { FRONTEND_API_URL } = process.env;
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
  private request: Request;
  private constructor(bearer: string) {
    const raw = JSON.stringify({
      source: "certification-function",
      sub: ""
    });
    const userinfo = Buffer.from(raw).toString("base64");
    this.request = new Request(FRONTEND_API_URL!, {
      headers: {
        "Content-Type": "application/json",
        authorization: "bearer undefined",
        "x-api-key": bearer,
        "x-apigateway-api-userinfo": userinfo
      }
    });
  }

  public static async create(): Promise<GatewayClient> {
    const bearer = process.env.GATEWAY_API_KEY!;
    return new GatewayClient(bearer);
  }

  public async getDoceboUsers() {
    const body = {
      query: `query getDeceboUser {
        accounts(filter:{ doceboUserId: {isNull: false}}) { 
          nodes {
            doceboUserId
          }
        }
      }`
    };
    return await fetch(
      new Request(this.request, {
        method: "POST",
        body: JSON.stringify(body)
      })
    );
  }

  public async insertCertification(certificates: ReportRecord[]) {
    const body = {
      query: `mutation truncateAndInsertCertification($certificates: [DoceboCertification]) {
        truncateAndInsertCertification(input: { certificates: $certificates})
      }`,
      variables: {
        certificates
      }
    };
    return await fetch(
      new Request(this.request, {
        method: "POST",
        body: JSON.stringify(body)
      })
    );
  }
}
