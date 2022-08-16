import fetch, { Request } from "node-fetch";

const { FRONTEND_API_URL } = process.env;

export default class GatewayMarketsClient {
  private readonly request: Request;
  private constructor(bearer: string) {
    const raw = JSON.stringify({
      source: "annual-inspection-function",
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

  public static async create(): Promise<GatewayMarketsClient> {
    const bearer = process.env.GATEWAY_API_KEY!;
    return new GatewayMarketsClient(bearer);
  }

  public async getMarkets() {
    const body = {
      query: `query markets{
        markets{
          nodes{
            id
            domain
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
}
