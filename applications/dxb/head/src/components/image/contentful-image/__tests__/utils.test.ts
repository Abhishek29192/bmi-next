import { describe, expect, it } from "@jest/globals";
import { getPosition, getSizes, loader, typeToObjectFitMap } from "../utils";

describe("typeToObjectFitMap", () => {
  it("should return 'cover' for 'Decorative'", () => {
    expect(typeToObjectFitMap["Decorative"]).toEqual("cover");
  });

  it("should return 'contain' for 'Descriptive'", () => {
    expect(typeToObjectFitMap["Descriptive"]).toEqual("contain");
  });
});

describe("getPosition", () => {
  it("should return position as-is if provided", () => {
    expect(getPosition({ position: "provided-position" })).toEqual(
      "provided-position"
    );
  });

  it("should return provided focalPoint if position is not provided, it is not mobile and size is cover", () => {
    expect(
      getPosition({
        isMobile: false,
        size: "cover",
        focalPoint: { x: 1, y: 2 }
      })
    ).toEqual("1% 2%");
  });

  it("should return 'center' if position is not provided, it is mobile, size is cover and focalPoint is provided", () => {
    expect(
      getPosition({
        isMobile: true,
        size: "cover",
        focalPoint: { x: 1, y: 2 }
      })
    ).toEqual("center");
  });

  it("should return 'center' if position is not provided, it is not mobile, size is contain and focalPoint is provided", () => {
    expect(
      getPosition({
        isMobile: false,
        size: "contain",
        focalPoint: { x: 1, y: 2 }
      })
    ).toEqual("center");
  });

  it("should return 'center' if position is not provided, it is not mobile, size is cover and focalPoint is not provided", () => {
    expect(
      getPosition({
        isMobile: false,
        size: "cover"
      })
    ).toEqual("center");
  });
});

describe("loader", () => {
  it("should append the provided width and quality of 50 to the provided src", () => {
    expect(loader({ src: "http://localhost/image.jpg", width: 1 })).toEqual(
      "http://localhost/image.jpg?w=1&q=50"
    );
  });
});

describe("getSizes", () => {
  it("should set provided widths into the different device width breakpoints", () => {
    expect(getSizes([5, 4, 3, 2, 1])).toEqual(
      "(max-width: 599px) 5px, (max-width: 719px) 4px, (max-width: 839px) 3px, (max-width: 1439px) 2px, 1px"
    );
  });
});
