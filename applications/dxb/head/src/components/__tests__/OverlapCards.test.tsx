import ThemeProvider from "@bmi-digital/components/theme-provider";
import { render } from "@testing-library/react";
import React from "react";
import createImageData from "../../__tests__/helpers/ImageDataHelper";
import {
  Data,
  default as IntegratedOverlapCards,
  default as OverlapCards
} from "../OverlapCards";
import { SiteContextProvider } from "../Site";
import { getMockSiteContext } from "./utils/SiteContextProvider";

const MockSiteContext = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <SiteContextProvider
        value={{
          ...getMockSiteContext("uk", "en-UK"),
          homePage: { title: "Home Page" },
          getMicroCopy: (path) => path,
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
    title: "Call to action",
    path: "some-page",
    featuredMedia: createImageData(),
    featuredVideo: null
  },
  {
    title: "Call to action",
    path: "some-page",
    featuredMedia: createImageData(),
    featuredVideo: null
  },
  {
    title: "Card with Video",
    path: "some-page",
    featuredMedia: null,
    featuredVideo: {
      __typename: "Video",
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
