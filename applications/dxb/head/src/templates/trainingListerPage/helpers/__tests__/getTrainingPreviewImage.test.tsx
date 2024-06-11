import getTrainingPreviewImage from "../getTrainingPreviewImage";

describe("getTrainingPreviewImage", () => {
  const courseName = "example-course-name";
  it("should return undefined if both the course image and default images are not provided", () => {
    expect(
      getTrainingPreviewImage(undefined, undefined, courseName)
    ).toBeUndefined();
  });

  it("should return the following image props object when the course image is provided", () => {
    const courseImage = "example-course-image";
    expect(getTrainingPreviewImage(courseImage, undefined, courseName)).toEqual(
      {
        "data-testid": "training-preview-image",
        src: courseImage,
        alt: courseName
      }
    );
  });

  it("should return the following image props object when the default image url is provided", () => {
    const defaultImageUrl = "example-course-image";
    expect(
      getTrainingPreviewImage(undefined, defaultImageUrl, courseName)
    ).toEqual({
      "data-testid": "training-preview-image",
      src: defaultImageUrl,
      alt: courseName
    });
  });
});
