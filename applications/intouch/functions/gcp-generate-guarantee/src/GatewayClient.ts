import fetch, { Request } from "node-fetch";

const { FRONTEND_API_URL, DOUBLE_ACCEPTANCE_EXPIRY_AFTER } = process.env;

export interface ICourseSyncConfiguration {
  configName: string;
  configValue: string;
}

export default class GatewayClient {
  private client: Request;

  private constructor(bearer: string, market: string) {
    const userinfo = Buffer.from(
      JSON.stringify({
        source: "pdf-generator-function",
        market: market
      })
    ).toString("base64");

    this.client = new Request(FRONTEND_API_URL, {
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
    const bearer = process.env.GATEWAY_API_KEY;
    return new GatewayClient(bearer, market);
  }

  public async updateGuaranteeFileStorage(id: number, fileStorageId: string) {
    const payload = {
      query: `mutation updateGuaranteeFileStorage($id: Int!, $fileStorageId: String!) {
        updateGuarantee(
          input: { id: $id, patch: { fileStorageId: $fileStorageId } }
        ) {
          guarantee {
            id
          }
        }
      }`,
      variables: {
        id,
        fileStorageId
      }
    };

    return await fetch(
      new Request(this.client, {
        method: "POST",
        body: JSON.stringify(payload)
      })
    );
  }

  public async createDoubleAcceptance(guaranteeId: number) {
    const expiryDate = new Date(
      new Date().setDate(
        new Date().getDate() + parseInt(DOUBLE_ACCEPTANCE_EXPIRY_AFTER)
      )
    )
      .toISOString()
      .replace("T", " ")
      .replace("Z", "")
      .toString();
    const payload = {
      query: `mutation createDoubleAcceptance($guaranteeId: Int!, $expiryDate: Datetime!) {
        createDoubleAcceptance(input: { doubleAcceptance: { guaranteeId: $guaranteeId, expiryDate: $expiryDate }}) {
          doubleAcceptance {
            id
            tempToken
          }
        }
      }`,
      variables: {
        guaranteeId,
        expiryDate
      }
    };

    return await fetch(
      new Request(this.client, {
        method: "POST",
        body: JSON.stringify(payload)
      })
    );
  }

  public async updateGuaranteeStatus(id) {
    const payload = {
      query: `mutation updateGuaranteeStatus($id: Int!) {
        updateGuarantee(
          input: { id: $id, patch: { status: ISSUED }, guaranteeEventType: BO_ACCEPTED_SOLUTION}
        ) {
          guarantee {
            id
          }
        }
      }`,
      variables: {
        id
      }
    };

    return await fetch(
      new Request(this.client, {
        method: "POST",
        body: JSON.stringify(payload)
      })
    );
  }
}
