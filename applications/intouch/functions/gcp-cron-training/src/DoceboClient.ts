import axios from "axios";

const {
  DOCEBO_API_URL,
  DOCEBO_API_CLIENT_ID,
  DOCEBO_API_CLIENT_SECRET,
  DOCEBO_API_USERNAME,
  DOCEBO_API_PASSWORD
} = process.env;

export default class DoceboClient {
  private async getTokenByUserInfo() {
    const { data } = await axios({
      method: "POST",
      url: `${DOCEBO_API_URL}/oauth2/token`,
      headers: { "content-type": "application/json" },
      data: {
        grant_type: "password",
        client_id: DOCEBO_API_CLIENT_ID,
        client_secret: DOCEBO_API_CLIENT_SECRET,
        username: DOCEBO_API_USERNAME,
        password: DOCEBO_API_PASSWORD
      }
    });
    return data;
  }

  async getCourses(updated_from) {
    const { access_token } = await this.getTokenByUserInfo();
    const {
      data: {
        data: { items = [] }
      }
    } = await axios({
      method: "GET",
      url: `${DOCEBO_API_URL}/learn/v1/courses?page_size=200&updated_from=${updated_from}`,
      headers: {
        authorization: `Bearer ${access_token}`
      }
    });

    return items.map((item) => ({
      course_id: item.id_course,
      technology: item.category.name,
      name: item.name,
      image: item.img_url,
      promoted: false,
      training_type: item.course_type,
      description: item.description
    }));
  }
}
