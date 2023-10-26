import { transformCourseCategory } from "../transformCourseCategory";

describe("transformCourseCategory", () => {
  it("works correctly if 'Flat' category provided", () => {
    const res = transformCourseCategory({
      id: 1,
      name: "Flat"
    });

    expect(res).toBe("Flat");
  });

  it("works correctly if 'Pitched' category provided", () => {
    const res = transformCourseCategory({
      id: 1,
      name: "Pitched"
    });

    expect(res).toBe("Pitched");
  });

  it("works correctly if non-allowed category provided", () => {
    const res = transformCourseCategory({
      id: 1,
      name: "fake category"
    });

    expect(res).toBe("Other");
  });
});
