import axios, { AxiosInstance } from "axios";
import { createToken } from "../util/JwtUtil";
import { Course } from "../types/Course";

import { IUserCreateInput } from "../type";

type CourseFilteredData = {
  courses: Course[];
  hasMoreData: boolean;
};

const { DOCEBO_API_URL, DOCEBO_API_CLIENT_ID, DOCEBO_API_USERNAME } =
  process.env;

export default class DoceboClient {
  private client: AxiosInstance;

  private constructor(accessToken: String) {
    this.client = axios.create({
      baseURL: DOCEBO_API_URL,
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    });
  }

  public static async create(): Promise<DoceboClient> {
    const { access_token } = await this.getSuperAdminApiToken();
    return new DoceboClient(access_token);
  }

  async getCourses(
    updated_from = "",
    page = 1,
    pageSize = 500
  ): Promise<Course[]> {
    const { courses, hasMoreData } = await this.getCoursesByFilter(
      updated_from,
      page,
      pageSize
    );

    if (hasMoreData) {
      return courses.concat(
        await this.getCourses(updated_from, (page = page + 1), pageSize)
      );
    } else {
      return courses;
    }
  }
  async getEnrollments(updated_from = "", page = 1, pageSize = 200) {
    const { enrollments, hasMoreData } = await this.getEnrollmentsByFilter(
      updated_from,
      page,
      pageSize
    );

    if (hasMoreData) {
      return enrollments.concat(
        await this.getEnrollments(updated_from, (page = page + 1), pageSize)
      );
    } else {
      return enrollments;
    }
  }
  async getCatalogues(page = 1, pageSize = 200) {
    const { catalogs, hasMoreData } = await this.getCataloguesByFilter(
      page,
      pageSize
    );

    if (hasMoreData) {
      return catalogs.concat(
        await this.getCatalogues((page = page + 1), pageSize)
      );
    } else {
      return catalogs;
    }
  }

  static async createSSOUrl(
    username: string,
    path: string = "/learn/mycourses"
  ) {
    const token = await this.getTokenByJWTPayload(username);
    return `${DOCEBO_API_URL}${path};type=oauth2_response;access_token=${token.access_token};expires_in=${token.expires_in};token_type=${token.token_type};scope=${token.scope}`;
  }

  /**
   *
   * @returns Super admin token
   */
  public static async getSuperAdminApiToken() {
    return this.getTokenByJWTPayload(DOCEBO_API_USERNAME);
  }
  public static async getTokenByJWTPayload(username: string) {
    const body = await getTokenPayload(username);
    const { data } = await axios({
      method: "POST",
      url: `${DOCEBO_API_URL}/oauth2/token`,
      headers: { "content-type": "application/json" },
      data: body
    });
    return data;
  }

  async createUser(input: IUserCreateInput) {
    const select_orgchart = input.select_orgchart
      ? { [`${input.select_orgchart.branch_id}`]: 1 }
      : {};
    const body = {
      ...input,
      password_retype: input.password,
      select_orgchart
    };
    const { data } = await this.client.post(`/manage/v1/user`, body);

    return data;
  }

  private async isCoursePromoted(courseId: Number) {
    const PROMOTED_COURSE_FIELD = "17";
    const {
      data: {
        data: { course_description }
      }
    } = await this.client.get(
      `/learn/v1/coursedesc/getCourseDescription?course_id=${courseId}&display_type=learner`
    );

    const additionalField = course_description.Additional_fields.find(
      (field) => field.id === PROMOTED_COURSE_FIELD
    );

    return additionalField.value === "Yes";
  }
  private async coursesPromoted(courses: any[]) {
    for (const course of courses) {
      course.promoted = await this.isCoursePromoted(course.courseId);
    }

    return courses;
  }
  private async getCoursesByFilter(
    updated_from: String,
    page: Number,
    pageSize: Number
  ): Promise<CourseFilteredData> {
    const query = this.getQueryString(updated_from, page, pageSize);

    const {
      data: {
        data: { has_more_data, items = [] }
      }
    } = await this.client.get(`/learn/v1/courses?${query}`);

    const courses = items.map((item) => ({
      courseId: item.id_course,
      technology: item.category.name,
      name: item.name,
      image: item.img_url,
      promoted: false,
      trainingType: item.course_type,
      description: item.description
    }));

    return {
      courses,
      hasMoreData: has_more_data
    };
  }
  private async getEnrollmentsByFilter(
    updated_from: String,
    page: Number,
    pageSize: Number
  ) {
    const query = this.getQueryString(updated_from, page, pageSize);
    const {
      data: {
        data: { has_more_data, items = [] }
      }
    } = await this.client.get(`/learn/v1/enrollments?${query}`);

    const enrollments = items.map((item) => ({
      userId: item.user_id,
      courseId: item.id,
      status: item.status,
      url: item.url
    }));

    return {
      enrollments,
      hasMoreData: has_more_data
    };
  }
  private async getCataloguesByFilter(page: Number, pageSize: Number) {
    const {
      data: {
        data: { has_more_data, items = [] }
      }
    } = await this.client.get(
      `/learn/v1/catalog?page=${page}&page_size=${pageSize}&show_item_list=1`
    );

    const catalogs = items.reduce((acc, curr) => {
      const enrolledCourse = curr.sub_items.map((course) => ({
        catalogueId: curr.catalogue_id,
        courseId: +course.item_id
      }));

      return [...acc, ...enrolledCourse];
    }, []);

    return {
      catalogs,
      hasMoreData: has_more_data
    };
  }
  private getQueryString(updated_from: String, page: Number, pageSize: Number) {
    let query = `page=${page}&page_size=${pageSize}`;
    if (updated_from) query += `&updated_from=${updated_from}`;
    return query;
  }
}

const getTokenPayload = async (username) => {
  const payload = {
    iss: DOCEBO_API_CLIENT_ID,
    sub: username,
    aud: DOCEBO_API_URL.replace(/^https?:\/\//, ""),
    iat: Date.now(),
    exp: Date.now() + 30 * 60 * 1000
  };
  const jwtToken = await createToken(payload);
  const body = {
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion: jwtToken
  };

  return body;
};
