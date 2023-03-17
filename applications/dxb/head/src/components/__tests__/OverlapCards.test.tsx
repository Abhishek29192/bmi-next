import { ThemeProvider } from "@bmi-digital/components";
import { render } from "@testing-library/react";
import React from "react";
import createImageData from "../../__tests__/helpers/ImageDataHelper";
import {
  Data,
  default as IntegratedOverlapCards,
  default as OverlapCards
} from "../OverlapCards";
import { SiteContextProvider } from "../Site";

const MockSiteContext = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <SiteContextProvider
        value={{
          node_locale: "en-UK",
          homePage: { title: "Home Page" },
          getMicroCopy: (path) => path,
          countryCode: "uk",
          reCaptchaKey: "1234",
          reCaptchaNet: false
        }}
      >
        {children}
      </SiteContextProvider>
    </ThemeProvider>
  );
};

const data: Data = [
  {
    __typename: "ContentfulSimplePage",
    title: "Call to action",
    path: "some-page",
    featuredMedia: createImageData(),
    featuredVideo: null
  },
  {
    __typename: "ContentfulSimplePage",
    title: "Call to action",
    path: "some-page",
    featuredMedia: createImageData(),
    featuredVideo: null
  },
  {
    __typename: "ContentfulSimplePage",
    title: "Card with Video",
    path: "some-page",
    featuredMedia: createImageData(),
    featuredVideo: {
      __typename: "ContentfulVideo",
      title: "video title",
      label: "video label",
      subtitle: "video subtitle",
      videoUrl: "https://www.youtube.com/watch?v=TDNEwZbm_Nk",
      previewMedia: createImageData(),
      defaultYouTubePreviewImage:
        "https://i.ytimg.com/vi/TDNEwZbm_Nk/maxresdefault.jpg",
      videoRatio: null
    }
  }
];

describe("OverlapCards component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <MockSiteContext>
        <OverlapCards data={data} />
      </MockSiteContext>
    );
    expect(container).toMatchSnapshot();
  });

  describe("IntegratedOverlapCards component", () => {
    it("renders correctly", () => {
      const { container } = render(
        <MockSiteContext>
          <IntegratedOverlapCards data={data} />
        </MockSiteContext>
      );

      expect(container).toMatchSnapshot();
    });
  });
});
