import fetch, { Request } from "node-fetch";

const { FRONTEND_API_URL } = process.env;

export default class GatewayClient {
  private request: Request;
  private constructor(bearer: string, market: string) {
    const raw = JSON.stringify({
      source: "annual-inspection-function",
      sub: "",
      market: market
    });
    const userinfo = Buffer.from(raw).toString("base64");
    this.request = new Request(FRONTEND_API_URL!, {
      headers: {
        "Content-Type": "application/json",
        authorization: "bearer undefined",
        "x-api-key": bearer,
        "x-apigateway-api-userinfo": userinfo,
        "x-request-market-domain": market
      }
    });
  }

  public static async create(market: string): Promise<GatewayClient> {
    const bearer = process.env.GATEWAY_API_KEY!;
    return new GatewayClient(bearer, market);
  }

  async annualInspection() {
    const body = {
      query: `mutation annualProjectsInspection {
        annualProjectsInspection
      }`
    };
    return await fetch(
      new Request(this.request, {
        method: "POST",
        body: JSON.stringify(body)
      })
    );
  }
}
