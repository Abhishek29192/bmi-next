import {
  CourseCategory,
  createCertification,
  createCourse,
  createSession
} from "@bmi/docebo-types";
import { transformCourseCategory } from "@bmi/docebo-api";
import { nodeBuilder, Props, transformCourse } from "../utils";
import { NODE_TYPES } from "../types/index";
import type { SourceNodesArgs } from "gatsby";

const mockGatsbyApi = {
  actions: {
    createNode: jest.fn()
  },
  createNodeId: jest.fn(),
  createContentDigest: jest.fn()
} as unknown as SourceNodesArgs;

const certification = createCertification();

const mockInput = {
  type: NODE_TYPES.Certifications,
  data: certification
};
const props: Props = {
  gatsbyApi: mockGatsbyApi,
  input: mockInput,
  itemId: certification.id_cert
};

jest.mock("@bmi/docebo-api", () => ({
  transformCourseCategory: jest
    .fn()
    .mockImplementation((category: CourseCategory) => category.name)
}));

describe("nodeBuilder", () => {
  it("works correctly", () => {
    nodeBuilder(props);
    const expectedId = `${mockInput.type}-${mockInput.data.id_cert}`;

    expect(mockGatsbyApi.createNodeId).toHaveBeenCalledWith(expectedId);
    expect(mockGatsbyApi.createContentDigest).toHaveBeenCalledWith(
      props.input.data
    );
    expect(mockGatsbyApi.actions.createNode).toHaveBeenCalledWith({
      ...props.input.data,
      id: mockGatsbyApi.createNodeId(expectedId),
      parent: null,
      children: [],
      internal: {
        type: props.input.type,
        contentDigest: mockGatsbyApi.createContentDigest(props.input.data)
      }
    });
  });
});

describe("transformCourse", () => {
  it("transforms course correctly", () => {
    const session = createSession();
    const course = createCourse();
    const transformedCourse = transformCourse({
      ...course,
      currency_currency: "EUR",
      currency_symbol: "€",
      sessions: [session]
    });

    expect(transformCourseCategory).toHaveBeenCalledWith(course.category);
    expect(transformedCourse).toEqual({
      available_seats: [],
      can_rate: false,
      can_self_unenroll: false,
      categoryName: "Pitched",
      code: "IT_TEST_01",
      course_type: "classroom",
      credits: 0,
      current_rating: 0,
      date_last_updated: "1693586500594",
      description: "<p>Test Course Description</p>",
      duration: 0,
      end_date: "1768156200000",
      enrollment_policy: 2,
      id_course: 1,
      image: "",
      img_url: "",
      is_affiliate: false,
      is_new: "0",
      is_opened: "1",
      language: "italian",
      language_label: "Italian",
      name: "Italian Test Course",
      price: "0",
      rating_option: "only_completed",
      selling: false,
      sessions: [
        {
          additional_fields: [
            {
              id: "5",
              mandatory: false,
              name: "Description for Certificate",
              type: "textarea",
              value: ""
            }
          ],
          attendance_details: {
            flexible: 0,
            online: 0,
            onsite: 1
          },
          attendance_type: "onsite",
          code: "Test code",
          created_by: "13194",
          date_end: "2025-10-10 16:00:00",
          date_start: "2023-10-10 07:00:00",
          enrolled: "2",
          events: "1",
          events_with_sync_failed: "0",
          externally_managed: false,
          hours: "8:45",
          id: 1,
          instructors: "0",
          instructors_emails_number: 0,
          location: {
            address: "BMI Academy Holger Danske Vej 23C 8960 Randers SØ",
            count: 1,
            id: 3,
            name: "BMI Academy DK"
          },
          max_enroll: "30",
          name: "Test course session",
          uid_session: "BJVR10V",
          waiting: "0"
        }
      ],
      slug_name: "italian-test-course",
      start_date: "1693586500594",
      uidCourse: "I-KVOYX1",
      currency: "EUR",
      currencySymbol: "€"
    });
  });
});
