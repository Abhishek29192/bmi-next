import axios, { AxiosInstance } from "axios";
import { getGCPToken } from "./utils/google-auth";

const { TRAINING_API_URL } = process.env;

export interface ICourseSyncConfiguration {
  configName: string;
  configValue: string;
}

export default class TrainingClient {
  private client: AxiosInstance;

  private constructor(bearer: string) {
    this.client = axios.create({
      baseURL: TRAINING_API_URL,
      headers: {
        contentType: "application/json",
        authorization: bearer
      }
    });
  }

  public static async create(): Promise<TrainingClient> {
    const bearer = await getGCPToken(TRAINING_API_URL);

    return new TrainingClient(bearer);
  }

  async getLastUpdatedDate(): Promise<ICourseSyncConfiguration> {
    const payload = {
      query: `query lastUpdateDate{
        courseSyncConfigurationByConfigName(configName:"last_update_date"){
          configName
          configValue
        } 
        }`,
      variables: {}
    };

    const {
      data: {
        data: { courseSyncConfigurationByConfigName }
      }
    } = await this.client.post("", payload);

    return courseSyncConfigurationByConfigName;
  }
  async setLastUpdatedDate(
    lastUpdateDate: string
  ): Promise<ICourseSyncConfiguration> {
    const payload = {
      query: `mutation updateLastUpdateDate($lastUpdateDate:String!){
        updateCourseSyncConfigurationByConfigName(input:{patch:{
          configValue:$lastUpdateDate
        },configName:"last_update_date"}){
          courseSyncConfiguration{
            configName
            configValue
          }
        }
      }`,
      variables: {
        lastUpdateDate
      }
    };

    const {
      data: {
        data: {
          updateCourseSyncConfigurationByConfigName: { courseSyncConfiguration }
        }
      }
    } = await this.client.post("", payload);

    return courseSyncConfiguration;
  }

  async updateTrainingDB(lastUpdateDate?: string) {
    const payload = {
      query: `mutation updateTrainingDB($lastUpdateDate:String) {
        updateTraining(lastUpdateDate:$lastUpdateDate)
      }`,
      variables: {
        lastUpdateDate
      }
    };

    const { data } = await this.client.post("", payload);

    return data;
  }
}
