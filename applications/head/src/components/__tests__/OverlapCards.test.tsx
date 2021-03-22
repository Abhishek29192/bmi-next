import React from "react";
import { render } from "@testing-library/react";
import mockConsole from "jest-mock-console";
import OverlapCards, { Data } from "../OverlapCards";
import { SiteContext } from "../Site";

const MockSiteContext = ({ children }: { children: React.ReactNode }) => {
  return (
    <SiteContext.Provider
      value={{
        node_locale: "en-UK",
        homePage: { title: "Home Page" },
        getMicroCopy: (path) => path,
        countryCode: "uk",
        scriptGRecaptchaId: "",
        scriptGRecaptchaNet: false
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

beforeAll(() => {
  mockConsole();
});

describe("OverlapCards component", () => {
  it("renders correctly", () => {
    const data: Data = [
      {
        __typename: "ContentfulSimplePage",
        title: "Call to action",
        path: "some-page",
        featuredImage: {
          resized: {
            src: "link-to-page.png"
          }
        },
        featuredVideo: null
      },
      {
        __typename: "ContentfulSimplePage",
        title: "Call to action",
        path: "some-page",
        featuredImage: {
          resized: {
            src: "link-to-page.png"
          }
        },
        featuredVideo: null
      }
    ];

    const { container } = render(
      <MockSiteContext>
        <OverlapCards data={data} />
      </MockSiteContext>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
