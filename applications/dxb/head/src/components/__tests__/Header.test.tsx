import { RegionCode, ThemeProvider } from "@bmi-digital/components";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { microCopy } from "../../constants/microCopies";
import BasketContext from "../../contexts/SampleBasketContext";
import createImageData from "../../__tests__/helpers/ImageDataHelper";
import Header from "../Header";
import { Data as LinkData, DataTypeEnum, NavigationData } from "../Link";
import { fallbackGetMicroCopy as getMicroCopy } from "../MicroCopy";
import { Data as PageInfoData } from "../PageInfo";
import { Data as PromoData } from "../Promo";

let isSpaEnabled;
let isGatsbyDisabledElasticSearch;
let isSampleOrderingEnabled;
jest.mock("../../contexts/ConfigProvider", () => ({
  useConfig: () => ({
    isSpaEnabled,
    isGatsbyDisabledElasticSearch,
    isSampleOrderingEnabled
  })
}));

beforeEach(() => {
  jest.useFakeTimers();
  isSpaEnabled = false;
  isGatsbyDisabledElasticSearch = false;
  isSampleOrderingEnabled = true;
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

const regions = [
  {
    label: "Europe",
    regionCode: RegionCode.Europe,
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
  featuredMedia: createImageData(),
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
  featuredMedia: createImageData(),
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
  tags: null,
  sections: [
    {
      title: "Basket title"
    }
  ]
};

const sampleBasketProducts: any = {
  basketState: {
    products: [
      {
        name: "test product",
        code: "S",
        path: "s",
        image: "S",
        classifications: []
      }
    ]
  }
};

describe("Header component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <ThemeProvider>
        <Header
          activeLabel="Main"
          countryCode="gb"
          navigationData={navigationData}
          utilitiesData={utilitiesData}
          regions={regions}
          maximumSamples={3}
        />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders correctly when flag doesn't exist", () => {
    const { container } = render(
      <ThemeProvider>
        <Header
          activeLabel="Main"
          countryCode="grp"
          navigationData={navigationData}
          utilitiesData={utilitiesData}
          regions={regions}
          maximumSamples={3}
        />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders without navigation props", () => {
    const { container } = render(
      <ThemeProvider>
        <Header
          activeLabel="Main"
          countryCode="gb"
          navigationData={null}
          utilitiesData={null}
          regions={regions}
          maximumSamples={3}
        />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("toggles search", () => {
    const { container } = render(
      <ThemeProvider>
        <Header
          activeLabel="Main"
          countryCode="gb"
          navigationData={navigationData}
          utilitiesData={utilitiesData}
          regions={regions}
          maximumSamples={3}
        />
      </ThemeProvider>
    );

    const searchLabel = getMicroCopy(microCopy.SEARCH_LABEL);

    const searchButton = screen.getByLabelText(searchLabel);

    expect(searchButton).toBeTruthy();

    fireEvent.click(searchButton);
    jest.runAllTimers();

    expect(container).toMatchSnapshot();
  });

  it("hides search button if disableSearch is true", () => {
    render(
      <ThemeProvider>
        <Header
          activeLabel="Main"
          countryCode="gb"
          navigationData={navigationData}
          utilitiesData={utilitiesData}
          regions={regions}
          maximumSamples={3}
          disableSearch={true}
        />
      </ThemeProvider>
    );

    expect(screen.queryByTestId("search-button")).not.toBeInTheDocument();
  });

  it("shows sample basket icon", () => {
    const { container } = render(
      <ThemeProvider>
        <BasketContext.Provider value={sampleBasketProducts}>
          <Header
            activeLabel="Main"
            countryCode="gb"
            navigationData={navigationData}
            utilitiesData={utilitiesData}
            regions={regions}
            sampleBasketLink={sampleBasketLinkInfo}
            maximumSamples={3}
          />
        </BasketContext.Provider>
      </ThemeProvider>
    );

    const basketButton = screen.queryByLabelText(
      getMicroCopy(microCopy.BASKET_LABEL)
    );

    expect(basketButton).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it("shows sample basket dialog on clicking on basket and hide it clicking on close", async () => {
    render(
      <BasketContext.Provider value={sampleBasketProducts}>
        <ThemeProvider>
          <Header
            activeLabel="Main"
            countryCode="gb"
            navigationData={navigationData}
            utilitiesData={utilitiesData}
            regions={regions}
            maximumSamples={3}
            sampleBasketLink={sampleBasketLinkInfo}
          />
        </ThemeProvider>
      </BasketContext.Provider>
    );
    expect(screen.getByTestId("shopping-cart-dialog")).not.toBeVisible();
    const basketButton = screen.getByLabelText(
      getMicroCopy(microCopy.BASKET_LABEL)
    );
    fireEvent.click(basketButton);
    jest.runAllTimers();
    expect(screen.getByTestId("shopping-cart-dialog")).toBeVisible();

    fireEvent.click(
      screen.getByLabelText(getMicroCopy(microCopy.DIALOG_CLOSE))
    );
    jest.runAllTimers();
    await waitFor(() =>
      expect(screen.getByTestId("shopping-cart-dialog")).not.toBeVisible()
    );
  });
});
