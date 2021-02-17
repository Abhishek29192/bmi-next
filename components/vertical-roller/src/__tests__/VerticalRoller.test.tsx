import React from "react";
import { render } from "@testing-library/react";
import mockConsole from "jest-mock-console";
import mockImage from "path-to-image.png";
import mockSvg from "path-to-logo.svg";
import VerticalRoller from "../";

const slides = [
  {
    title: "Approved Installers",
    imageSource: mockImage,
    brandIcon: mockSvg,
    description:
      "Accredited BMI installers are masters of their craft and available all over Norway.",
    cta: {
      label: "Go to Approved Installers"
    }
  },
  {
    title: "Realiable Warranties",
    imageSource: mockImage,
    cta: {
      label: "Go to Realiable Warranties"
    }
  },
  {
    title: "Best tiles ever",
    imageSource: mockImage
  }
];

beforeAll(() => {
  mockConsole();
});

describe("VerticalRoller component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <VerticalRoller title="H2 Heading" slides={slides} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
