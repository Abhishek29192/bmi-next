import { TrainingQuery } from "../../../graphql/generated/operations";

export const generateCourse = (
  courseDetail = {},
  courseEnrollmentDetail = {},
  courseEnrollments = []
): TrainingQuery["courseCatalogues"]["nodes"][0] => ({
  course: {
    name: "Flat Course",
    technology: "FLAT",
    courseId: 1,
    courseEnrollments: {
      nodes: [
        {
          id: 1,
          courseId: 1,
          url: "",
          status: "enrolled",
          ...courseEnrollmentDetail
        },
        ...courseEnrollments
      ]
    },
    ...courseDetail
  }
});

export const generateTrainingCourseCatalogues = (
  courses: TrainingQuery["courseCatalogues"]["nodes"] = []
): TrainingQuery["courseCatalogues"] => ({
  nodes: [
    generateCourse(),
    generateCourse(
      { name: "Pitch Course", technology: "PITCH", courseId: 2 },
      { id: 2, courseId: 2, url: "", status: "enrolled" }
    ),
    generateCourse(
      { name: "Other Course", technology: "OTHER", courseId: 3 },
      { id: 3, courseId: 3, url: "", status: "enrolled" }
    ),
    ...courses
  ]
});

export const generateTrainingContentCollection = (
  items: TrainingQuery["trainingContentCollection"]["items"] = []
): TrainingQuery["trainingContentCollection"] => ({
  items: [
    {
      pageHeading: "pageHeading",
      description: "description",
      lmsCtaLabel: "lmsCtaLabel",
      pageSubHeading: "pageSubHeading",
      step1Heading: "step1Heading",
      step1SubHeading: "step1SubHeading",
      step1Description: "step1Description",
      step2Heading: "step2Heading",
      step2SubHeading: "step2SubHeading",
      step2Description: "step2Description",
      step3Heading: "step3Heading",
      step3SubHeading: "step3SubHeading",
      step3Description: "step3Description",
      live: "live",
      image: {
        url: "url"
      }
    },
    ...items
  ]
});
