import axios, { AxiosInstance } from "axios";

const { TRAINING_API_URL } = process.env;

export interface ICourseSyncConfiguration {
  configName: string;
  configValue: string;
}

export default class TrainingClient {
  private client: AxiosInstance;

  private constructor() {
    this.client = axios.create({
      baseURL: TRAINING_API_URL,
      headers: {
        contentType: "application/json"
      }
    });
  }

  public static async create(): Promise<TrainingClient> {
    return new TrainingClient();
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
    lastUpdateDate: String
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

  async updateTrainingDB(lastUpdateDate?: String) {
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
