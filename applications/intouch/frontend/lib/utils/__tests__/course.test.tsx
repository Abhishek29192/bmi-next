import { technologyNames, getTechnology, sortCourses } from "../course";

describe("course utility", () => {
  it("returns technology names correctly", () => {
    expect(technologyNames["FLAT"]).toEqual("technology.FLAT");
    expect(technologyNames["PITCHED"]).toEqual("technology.PITCHED");
    expect(technologyNames["OTHER"]).toEqual("technology.OTHER");
  });
  it("returns technology correctly", () => {
    expect(getTechnology("FLAT")).toEqual("FLAT");
    expect(getTechnology("PITCHED")).toEqual("PITCHED");
    expect(getTechnology("OTHER")).toEqual("OTHER");
    expect(getTechnology("undefined")).toEqual(undefined);
  });

  it("returns courses correctly sorted", () => {
    const courses = [
      {
        course: {
          name: "Pitch Course",
          technology: "PITCH",
          trainingType: "classroom",
          courseEnrollments: {
            nodes: []
          }
        }
      },
      {
        course: {
          name: "Flat Course",
          technology: "FLAT",
          trainingType: "classroom",
          courseEnrollments: {
            nodes: []
          }
        }
      },
      {
        course: {
          name: "Flat Course",
          technology: "FLAT",
          trainingType: "elearning",
          courseEnrollments: {
            nodes: []
          }
        }
      }
    ];
    const expectedCourses = [
      {
        course: {
          name: "Flat Course",
          technology: "FLAT",
          trainingType: "classroom",
          courseEnrollments: {
            nodes: []
          }
        }
      },
      {
        course: {
          name: "Pitch Course",
          technology: "PITCH",
          trainingType: "classroom",
          courseEnrollments: {
            nodes: []
          }
        }
      },
      {
        course: {
          name: "Flat Course",
          technology: "FLAT",
          trainingType: "elearning",
          courseEnrollments: {
            nodes: []
          }
        }
      }
    ];

    expect(sortCourses(courses)).toEqual(expectedCourses);
  });
});
