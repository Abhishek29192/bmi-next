import fetch, { Request } from "node-fetch";
import { getSecret } from "@bmi-digital/functions-secret-client";

const { GATEWAY_API_URL } = process.env;

export interface ICourseSyncConfiguration {
  configName: string;
  configValue: string;
}

export default class GatewayClient {
  private client: Request;

  private constructor(bearer: string) {
    const userinfo = Buffer.from(
      JSON.stringify({
        source: "pdf-generator-function"
      })
    ).toString("base64");

    this.client = new Request(GATEWAY_API_URL, {
      headers: {
        "Content-Type": "application/json",
        "x-apigateway-api-userinfo": userinfo,
        authorization: bearer
      }
    });
  }

  public static async create(): Promise<GatewayClient> {
    const bearer = await getSecret("GATEWAY_API_KEY");
    return new GatewayClient(bearer);
  }

  async updateGuaranteeFileStorage(id: number, fileStorageId: string) {
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
}
