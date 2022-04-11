import React from "react";
import { fireEvent, render } from "@testing-library/react";
import mockConsole from "jest-mock-console";
import { microCopy } from "../../constants/microCopies";
import { Data as LinkData, DataTypeEnum, NavigationData } from "../Link";
import { Data as PromoData } from "../Promo";
import { fallbackGetMicroCopy as getMicroCopy } from "../MicroCopy";
import Header from "../Header";
import { Data as PageInfoData } from "../PageInfo";
import BasketContext from "../../contexts/SampleBasketContext";

beforeAll(() => {
  mockConsole();
});

const regions = [
  {
    label: "Europe",
    menu: [
      { code: "al", label: "Albania", icon: "/icons/flags/al.svg" },
      { code: "at", label: "Österreich", icon: "/icons/flags/at.svg" },
      { code: "gb", label: "United Kingdom", icon: "/icons/flags/uk.svg" }
    ]
  }
];

const card1: PromoData = {
  __typename: "ContentfulPromo",
  id: "card1",
  name: "cardTitle1",
  title: "cardTitle1",
  subtitle: null,
  body: null,
  brandLogo: null,
  tags: null,
  featuredMedia: {
    __typename: "ContentfulImage",
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
                "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=237&h=180&q=50&fm=webp 237w,\n//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=474&h=360&q=50&fm=webp 474w,\n//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=948&h=720&q=50&fm=webp 948w",
              sizes: "(min-width: 948px) 948px, 100vw",
              type: "image/webp"
            }
          ],
          fallback: {
            src: "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=948&h=720&q=50&fm=png",
            srcSet:
              "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=237&h=180&q=50&fm=png 237w,\n//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=474&h=360&q=50&fm=png 474w,\n//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=948&h=720&q=50&fm=png 948w",
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
      src: "//images.asset.jpg",
      file: {
        fileName: "Lorem ipsum",
        url: "//images.asset.jpg"
      }
    }
  },
  cta: null,
  featuredVideo: null,
  backgroundColor: null
};
const card2: PromoData = {
  __typename: "ContentfulPromo",
  id: "card2",
  name: "cardName2",
  title: null,
  subtitle: null,
  body: null,
  brandLogo: null,
  tags: null,
  featuredMedia: {
    __typename: "ContentfulImage",
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
                "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=237&h=180&q=50&fm=webp 237w,\n//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=474&h=360&q=50&fm=webp 474w,\n//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=948&h=720&q=50&fm=webp 948w",
              sizes: "(min-width: 948px) 948px, 100vw",
              type: "image/webp"
            }
          ],
          fallback: {
            src: "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=948&h=720&q=50&fm=png",
            srcSet:
              "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=237&h=180&q=50&fm=png 237w,\n//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=474&h=360&q=50&fm=png 474w,\n//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=948&h=720&q=50&fm=png 948w",
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
      src: "//images.asset.jpg",
      file: {
        fileName: "Lorem ipsum",
        url: "//images.asset.jpg"
      }
    }
  },
  cta: null,
  featuredVideo: null,
  backgroundColor: null
};
const promos: PromoData[] = [card1, card2];

const linkData: LinkData = {
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
};

const navigationData: NavigationData = {
  __typename: "ContentfulNavigation",
  label: "Main",
  link: null,
  links: [
    {
      __typename: "ContentfulNavigation",
      label: "Get in touch",
      link: null,
      links: [
        {
          __typename: "ContentfulLink",
          id: "",
          label: "+44 (0) 1234567890",
          url: "tel:+4401234567890",
          isLabelHidden: null,
          icon: "Phone",
          linkedPage: null,
          type: DataTypeEnum.External,
          parameters: null,
          dialogContent: null,
          hubSpotCTAID: null
        }
      ],
      promos
    },
    {
      __typename: "ContentfulNavigationItem",
      type: "Separator",
      value: "separator"
    },
    {
      __typename: "ContentfulNavigation",
      label: "About BMI",
      link: null,
      links: [
        {
          __typename: "ContentfulLink",
          id: "",
          label: "Our story",
          url: null,
          isLabelHidden: null,
          icon: null,
          linkedPage: {
            path: "landing-page"
          },
          type: DataTypeEnum.Internal,
          parameters: null,
          dialogContent: null,
          hubSpotCTAID: null
        }
      ]
    },
    linkData
  ]
};

const utilitiesData: NavigationData = {
  __typename: "ContentfulNavigation",
  label: "About BMI",
  link: null,
  links: [
    {
      __typename: "ContentfulLink",
      id: "",
      label: "Our story",
      url: null,
      isLabelHidden: null,
      icon: null,
      linkedPage: {
        path: "landing-page"
      },
      type: DataTypeEnum.Internal,
      parameters: null,
      dialogContent: null,
      hubSpotCTAID: null
    }
  ]
};

const sampleBasketLinkInfo: PageInfoData = {
  id: "test",
  title: "test",
  __typename: "ContentfulSimplePage",
  slug: "sample-basket",
  path: "sample-basket/",
  subtitle: null,
  brandLogo: null,
  featuredMedia: null,
  featuredVideo: null,
  date: null,
  tags: null
};

const sampleBasketProducts: any = {
  basketState: {
    products: [
      {
        name: "test product",
        code: "S",
        path: "s",
        image: "S"
      }
    ]
  }
};

describe("Header component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <Header
        activeLabel="Main"
        countryCode="gb"
        navigationData={navigationData}
        utilitiesData={utilitiesData}
        regions={regions}
      />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders correctly when flag doesn't exist", () => {
    const { container } = render(
      <Header
        activeLabel="Main"
        countryCode="grp"
        navigationData={navigationData}
        utilitiesData={utilitiesData}
        regions={regions}
      />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders without navigation props", () => {
    const { container } = render(
      <Header
        activeLabel="Main"
        countryCode="gb"
        navigationData={null}
        utilitiesData={null}
        regions={regions}
      />
    );
    expect(container).toMatchSnapshot();
  });
  it("toggles search", () => {
    const { container, getByLabelText } = render(
      <Header
        activeLabel="Main"
        countryCode="gb"
        navigationData={navigationData}
        utilitiesData={utilitiesData}
        regions={regions}
      />
    );

    const searchLabel = getMicroCopy(microCopy.SEARCH_LABEL);

    const searchButton = getByLabelText(searchLabel);

    expect(searchButton).toBeTruthy();

    fireEvent.click(searchButton);

    expect(container).toMatchSnapshot();
  });

  it("shows sample basket icon", () => {
    const { container, getByLabelText } = render(
      <BasketContext.Provider value={sampleBasketProducts}>
        <Header
          activeLabel="Main"
          countryCode="gb"
          navigationData={navigationData}
          utilitiesData={utilitiesData}
          regions={regions}
          sampleBasketLink={sampleBasketLinkInfo}
        />
      </BasketContext.Provider>
    );

    const basketLabel = getMicroCopy(microCopy.BASKET_LABEL);
    const basketButton = getByLabelText(basketLabel);

    expect(basketButton).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
});
