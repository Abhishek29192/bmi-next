import React from "react";
import Hero from "../Hero";
import { render } from "@testing-library/react";
import testImageSource from "test-image.jpg";
import mockConsole from "jest-mock-console";

beforeAll(() => {
  mockConsole();
});

describe("Hero component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <Hero
        data={[
          {
            title: "Lorem ipsum",
            image: {
              title: "",
              file: {
                fileName: "",
                url: testImageSource
              }
            },
            cta: null
          }
        ]}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders a level 0 (carousel) Hero", () => {
    const { container } = render(
      <Hero
        data={[
          {
            title: "Lorem ipsum",
            image: null,
            cta: null
          },
          {
            title: "Lorem ipsum",
            image: {
              title: "",
              file: {
                fileName: "",
                url: testImageSource
              }
            },
            cta: null
          }
        ]}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders a level 2 Hero", () => {
    const { container } = render(
      <Hero
        data={[
          {
            title: "Lorem ipsum",
            image: null,
            cta: null
          },
          {
            title: "Lorem ipsum",
            image: {
              title: "",
              file: {
                fileName: "",
                url: testImageSource
              }
            },
            cta: null
          }
        ]}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("handles no data", () => {
    const { container } = render(<Hero />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
