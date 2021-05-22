import axios, { AxiosInstance } from "axios";
import { Course } from "./common/types";

type CourseFilteredData = {
  courses: Course[];
  hasMoreData: boolean;
};

const {
  DOCEBO_API_URL,
  DOCEBO_API_CLIENT_ID,
  DOCEBO_API_CLIENT_SECRET,
  DOCEBO_API_USERNAME,
  DOCEBO_API_PASSWORD
} = process.env;

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
    const { access_token } = await this.getTokenByUserInfo();
    return new DoceboClient(access_token);
  }

  private static async getTokenByUserInfo() {
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

  async getCourses(updated_from, page = 1, pageSize = 500): Promise<Course[]> {
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
  async getEnrollments(updated_from, page = 1, pageSize = 200) {
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

  private async isCoursePromoted(courseId: Number) {
    const {
      data: {
        data: { course_description }
      }
    } = await this.client.get(
      `/learn/v1/coursedesc/getCourseDescription?course_id=${courseId}&display_type=learner`
    );

    const additionalField = course_description.Additional_fields.find(
      (field) => field.id === "17"
    );

    return additionalField.value === "Yes";
  }
  private async coursesPromoted(courses: any[]) {
    for (const course of courses) {
      course.promoted = await this.isCoursePromoted(course.course_id);
    }

    return courses;
  }
  private async getCoursesByFilter(
    updated_from: String,
    page: Number,
    pageSize: Number
  ): Promise<CourseFilteredData> {
    const {
      data: {
        data: { has_more_data, items = [] }
      }
    } = await this.client.get(
      `/learn/v1/courses?page=${page}&page_size=${pageSize}&updated_from=${updated_from}`
    );

    const courses = items.map((item) => ({
      course_id: item.id_course,
      technology: item.category.name,
      name: item.name,
      image: item.img_url,
      promoted: false,
      training_type: item.course_type,
      description: item.description
    }));

    await this.coursesPromoted(courses);

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
    const {
      data: {
        data: { has_more_data, items = [] }
      }
    } = await this.client.get(
      `/learn/v1/enrollments?page=${page}&page_size=${pageSize}&updated_from=${updated_from}`
    );

    const enrollments = items.map((item) => ({
      user_id: item.user_id,
      course_id: item.id,
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
        catalogue_id: curr.catalogue_id,
        course_id: course.item_id
      }));

      return [...acc, ...enrolledCourse];
    }, []);

    return {
      catalogs,
      hasMoreData: has_more_data
    };
  }
}
