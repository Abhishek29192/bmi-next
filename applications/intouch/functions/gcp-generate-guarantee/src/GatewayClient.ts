import axios, { AxiosInstance } from "axios";

const { GATEWAY_API_URL } = process.env;

export interface ICourseSyncConfiguration {
  configName: string;
  configValue: string;
}

export default class GatewayClient {
  private client: AxiosInstance;

  private constructor() {
    const userinfo = Buffer.from(
      JSON.stringify({
        source: "pdf-generator-function"
      })
    ).toString("base64");

    this.client = axios.create({
      baseURL: GATEWAY_API_URL,
      headers: {
        contentType: "application/json",
        "x-apigateway-api-userinfo": userinfo
      }
    });
  }

  public static async create(): Promise<GatewayClient> {
    return new GatewayClient();
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

    const { data } = await this.client.post("", payload);

    return data;
  }
}
