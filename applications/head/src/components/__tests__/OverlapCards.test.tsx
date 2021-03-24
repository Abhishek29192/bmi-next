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
        featuredMedia: {
          type: null,
          altText: "Lorem ipsum",
          caption: null,
          focalPoint: null,
          image: {
            resize: {
              src: "link-to-page.png"
            }
          }
        },
        featuredVideo: null
      },
      {
        __typename: "ContentfulSimplePage",
        title: "Call to action",
        path: "some-page",
        featuredMedia: {
          type: null,
          altText: "Lorem ipsum",
          caption: null,
          focalPoint: null,
          image: {
            resize: {
              src: "link-to-page.png"
            }
          }
        },
        featuredVideo: null
      },
      {
        __typename: "ContentfulSimplePage",
        title: "Card with Video",
        path: "some-page",
        featuredImage: {
          resized: {
            src: "link-to-page.png"
          }
        },
        featuredVideo: {
          title: "video title",
          label: "video label",
          subtitle: "video subtitle",
          youtubeId: "TDNEwZbm_Nk",
          previewImage: {
            resize: {
              src: "link-to-page.png"
            },
            file: {
              fileName: "",
              url: ""
            }
          },
          videoRatio: null,
          className: null
        }
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
