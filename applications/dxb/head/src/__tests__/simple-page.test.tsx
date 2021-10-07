import React from "react";
import { render } from "@testing-library/react";
import SimplePage, { Data } from "../templates/simple-page";
import { DataTypeEnum } from "../components/Link";

describe("ExploreBarSection component", () => {
  const data: { contentfulSimplePage: Data; contentfulSite: any } = {
    contentfulSimplePage: {
      __typename: "ContentfulSimplePage",
      brandLogo: "Zanda",
      breadcrumbs: [],
      cta: {
        __typename: "ContentfulLink",
        id: "string",
        label: "string",
        icon: null,
        isLabelHidden: null,
        url: "https://www.external.co.uk",
        linkedPage: null,
        type: DataTypeEnum.External,
        parameters: null,
        dialogContent: null,
        hubSpotCTAID: null
      },
      date: null,
      exploreBar: {
        label: "Explore bar",
        links: []
      },
      featuredMedia: {
        type: null,
        altText: "Lorem ipsum",
        caption: null,
        focalPoint: null,
        image: {
          gatsbyImageData: {
            images: {
              sources: [
                {
                  srcSet:
                    "//images.asset.png?w=237&h=180&q=50&fm=webp 237w,\n//images.asset.png?w=474&h=360&q=50&fm=webp 474w,\n//images.asset.png?w=948&h=720&q=50&fm=webp 948w",
                  sizes: "(min-width: 948px) 948px, 100vw",
                  type: "image/webp"
                }
              ],
              fallback: {
                src: "//images.asset.png?w=948&h=720&q=50&fm=png",
                srcSet:
                  "//images.asset.png?w=237&h=180&q=50&fm=png 237w,\n//images.asset.png?w=474&h=360&q=50&fm=png 474w,\n//images.asset.png?w=948&h=720&q=50&fm=png 948w",
                sizes: "(min-width: 948px) 948px, 100vw"
              }
            },
            layout: "constrained",
            backgroundColor: "#484848",
            width: 948,
            height: 720
          },
          file: {
            fileName: "Lorem ipsum",
            url: "//images.asset.jpg"
          }
        },
        thumbnail: {
          src: "//image.asset.jpg"
        }
      },
      featuredVideo: null,
      heroType: "Level 1",
      id: "e75cdf16-352f-5a27-8b4d-066a6cb4393c",
      inputBanner: {
        title: "Sign up for our newsletter",
        description: { description: "String" },
        inputLabel: "Email address",
        submitButtonLabel: "Sign up",
        additionalInputs: [],
        confirmationButtonLabel: null,
        thankYouMessage: "Thank you",
        allowRetry: null,
        errorTitle: null,
        errorBody: null,
        retryButtonLabel: null
      },
      leadBlock: {
        __typename: "ContentfulLeadBlockSection",
        title: "Test for Spacing ",
        text: {
          raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
          references: null
        },
        link: null,
        postItCard: null
      },
      linkColumns: {
        __typename: "ContentfulLinkColumnsSection",
        title: "Frequently Asked Questions",
        columns: []
      },
      nextBestActions: [],
      path: "testing-simple-page/",
      sections: [],
      seo: null,
      shareWidget: {
        __typename: "ShareWidgetSection",
        title: "Share",
        message: null,
        clipboardSuccessMessage: null,
        clipboardErrorMessage: null,
        isLeftAligned: null,
        copy: null,
        email: null,
        facebook: null,
        linkedin: null,
        pinterest: null,
        twitter: null
      },
      slug: "testing-simple-page",
      subtitle: "Testing Simple page ",
      tags: null,
      title: "Testing Simple Page",
      parentPage: {
        __typename: "ContentfulSimplePage",
        id: "123",
        title: "Parent",
        subtitle: null,
        brandLogo: null,
        slug: "parent",
        path: "parent",
        date: null,
        tags: null,
        // TODO: Move Video as option of Media.
        featuredMedia: null,
        featuredVideo: null
      }
    },
    contentfulSite: {
      countryCode: "no",
      footerMainNavigation: { label: "Get in touch", links: [] },
      footerSecondaryNavigation: {
        label: "Secondary Navigation ",
        links: []
      },
      headScripts: { headScripts: " " },
      homePage: { title: "Home Page" },
      menuNavigation: {
        __typename: "ContentfulNavigation",
        label: "Main navigation",
        links: []
      },
      menuUtilities: { label: "label", links: [] },
      node_locale: "it",
      // resources: {microCopy: Array(106), pdpSidebarItems: null, pdpCardsTitle: "Information & Tips", pdpCards: Array(4), pdpExploreBar: {…}, …},
      scriptGA: null,
      scriptGOptLoad: null,
      scriptGRecaptchaId: "6LfCQEcaAAAAAOwkNDcGUzn4B1h2fh6f1SmwzXRS",
      scriptGRecaptchaNet: false,
      scriptGTM: "GTM-KXFK8MC",
      scriptHotJar: "1721463",
      scriptOnetrust: "89a0b9fc-cd35-42fb-8fe1-4a27a48628f6-test"
    }
  };

  it("renders correctly", () => {
    const { container } = render(
      <SimplePage data={data} pageContext={{ variantCodeToPathMap: {} }} />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders correctly with spotlight", () => {
    const { container } = render(
      <SimplePage
        data={{
          contentfulSimplePage: {
            ...data.contentfulSimplePage,
            heroType: "Spotlight"
          },
          contentfulSite: data.contentfulSite
        }}
        pageContext={{ variantCodeToPathMap: {} }}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
