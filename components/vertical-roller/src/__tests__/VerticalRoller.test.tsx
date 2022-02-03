import React from "react";
import { fireEvent, render } from "@testing-library/react";
import mockConsole from "jest-mock-console";
import mockImage from "path-to-image.png";
import mockSvg from "path-to-logo.svg";
import snapshotDiff from "snapshot-diff";
import VerticalRoller from "../";

const slides = [
  {
    title: "Approved Installers",
    brandIcon: mockSvg,
    description:
      "Accredited BMI installers are masters of their craft and available all over Norway.",
    cta: {
      label: "Go to Approved Installers"
    }
  },
  {
    title: "Realiable Warranties",
    media: <img src={mockImage} alt="Lorem ipsum" />,
    cta: {
      label: "Go to Realiable Warranties"
    }
  },
  {
    title: "slide 3",
    cta: {
      label: "Go to side 3"
    }
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
    expect(container).toMatchSnapshot();
  });
  it("renders correctly on onClick", () => {
    const { container, getByText } = render(
      <VerticalRoller title="H2 Heading" slides={slides} />
    );
    const slide = getByText("Approved Installers");
    fireEvent.click(slide);
    expect(container).toMatchSnapshot();
  });
  it("navigates to next page", () => {
    const nextLabel = "next";
    const { container, getByLabelText } = render(
      <VerticalRoller title="something" slides={slides} />
    );
    const containerBeforeClick = container.cloneNode(true);

    fireEvent.click(getByLabelText(nextLabel));

    expect(snapshotDiff(containerBeforeClick, container)).toMatchSnapshot();
  });
  it("navigates to previous page", () => {
    const previousLabel = "previous";
    const { container, getByLabelText } = render(
      <VerticalRoller title="something" slides={slides} />
    );
    const containerBeforeClick = container.cloneNode(true);

    fireEvent.click(getByLabelText(previousLabel));

    expect(snapshotDiff(containerBeforeClick, container)).toMatchSnapshot();
  });
});
