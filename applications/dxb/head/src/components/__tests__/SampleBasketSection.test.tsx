import { ThemeProvider } from "@bmi-digital/components";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { ConfigProvider, EnvConfig } from "../../contexts/ConfigProvider";
import * as BasketContextUtils from "../../contexts/SampleBasketContext";
import {
  BasketContextProvider,
  Sample
} from "../../contexts/SampleBasketContext";
import { local } from "../../utils/storage";
import { Data } from "../SampleBasketBase";
import SampleBasketSection from "../SampleBasketSection";
import { SiteContextProvider } from "../Site";
import { SourceType } from "../types/FormSectionTypes";
import { getMockSiteContext } from "./utils/SiteContextProvider";

const MockSiteContext = ({
  mockEnvConfig = { gcpFormSubmitEndpoint: "GATSBY_GCP_FORM_SUBMIT_ENDPOINT" },
  children
}: {
  mockEnvConfig?: EnvConfig["config"];
  children: React.ReactNode;
}) => {
  return (
    <ThemeProvider>
      <ConfigProvider configObject={mockEnvConfig}>
        <SiteContextProvider
          value={{
            ...getMockSiteContext("no"),
            reCaptchaKey: "1234",
            reCaptchaNet: false
          }}
        >
          {children}
        </SiteContextProvider>
      </ConfigProvider>
    </ThemeProvider>
  );
};

const sample: Sample = {
  name: "sample-1",
  code: "sample-1",
  path: "sample-1-details",
  colour: "green",
  textureFamily: "rough",
  measurements: "1x2x3 mm",
  image: "http://localhost:8000/image-real-file-name.jpg"
};

const data: Data = {
  __typename: "SampleBasketSection",
  description: {
    raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
    references: null
  },
  checkoutFormSection: {
    __typename: "ContentfulFormSection",
    title: "Complete form",
    showTitle: true,
    description: null,
    recipients: "recipient@mail.com",
    inputs: [
      {
        label: "Text",
        name: "text",
        type: "text"
      }
    ],
    submitText: "Submit",
    successRedirect: null,
    source: SourceType.Contentful,
    hubSpotFormGuid: null
  },
  emptyBasketMessage: {
    raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"your basket is empty.","marks":[],"data":{}}],"data":{}}]}',
    references: null
  },
  browseProductsCTALabel: "browse all products",
  browseProductsCTA: {
    id: "5bcc3b0f-fcba-54b6-9ddb-2be3f4fc7fae",
    __typename: "ContentfulProductListerPage",
    title: "torvtak",
    subtitle: "sub-title",
    brandLogo: null,
    slug: "torvtak",
    path: "zanda-brand/torvtak/",
    featuredMedia: null,
    date: null,
    tags: null,
    featuredVideo: null
  }
};

const mockedWindowDocumentCookie = jest.spyOn(window.document, "cookie", "get");
const qaAuthToken = "qaAuthToken";

const fetchMock = jest.fn().mockResolvedValue({ ok: true });
jest.mock("node-fetch", () => {
  const original = jest.requireActual("node-fetch");
  return {
    ...original,
    __esModule: true,
    default: (...config) => fetchMock(...config)
  };
});

jest.mock("react-google-recaptcha-v3", () => ({
  useGoogleReCaptcha: () => ({
    executeRecaptcha: () => "RECAPTCHA"
  })
}));

jest.spyOn(local, "getItem").mockReturnValue(JSON.stringify([sample]));
jest.spyOn(local, "setItem");

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe("SampleBasketSection component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <ThemeProvider>
        <BasketContextProvider>
          <SampleBasketSection data={data} />
        </BasketContextProvider>
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it("should render form after complete button press", () => {
    const { container } = render(
      <MockSiteContext>
        <BasketContextProvider>
          <SampleBasketSection data={data} />
        </BasketContextProvider>
      </MockSiteContext>
    );

    expect(screen.queryByText("Complete form")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("MC: pdp.overview.completeSampleOrder"));

    expect(container).toMatchSnapshot();

    expect(screen.getByText("Complete form")).toBeInTheDocument();
    expect(
      screen.queryByText("MC: pdp.overview.completeSampleOrder")
    ).not.toBeInTheDocument();
    expect(local.getItem).lastCalledWith("no-basketItems");
    expect(local.setItem).lastCalledWith(
      "no-basketItems",
      '[{"name":"sample-1","code":"sample-1","path":"sample-1-details","colour":"green","textureFamily":"rough","measurements":"1x2x3 mm","image":"http://localhost:8000/image-real-file-name.jpg"}]'
    );
  });
});

describe("SampleBasketSection with form", () => {
  it("should submit form with provided samples", async () => {
    render(
      <MockSiteContext>
        <BasketContextProvider>
          <SampleBasketSection data={data} />
        </BasketContextProvider>
      </MockSiteContext>
    );

    jest.spyOn(BasketContextUtils, "basketReducer");

    fireEvent.click(screen.getByText("MC: pdp.overview.completeSampleOrder"));

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Text" }
    });

    fireEvent.submit(screen.getByTestId("sample-basket-section-checkout-form"));

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        "GATSBY_GCP_FORM_SUBMIT_ENDPOINT",
        {
          method: "POST",
          body: JSON.stringify({
            locale: "en-GB",
            title: "Complete form",
            recipients: "recipient@mail.com",
            values: {
              text: "Text",
              samples:
                "id: sample-1<br>title: sample-1<br>url: http://localhost/no/sample-1-details/<br>color: green<br>texture: rough<br>measurements: 1x2x3 mm"
            }
          }),
          headers: {
            "X-Recaptcha-Token": "RECAPTCHA",
            "Content-Type": "application/json",
            authorization: undefined
          }
        }
      )
    );

    expect(BasketContextUtils.basketReducer).toHaveBeenCalledWith(
      { products: [sample] },
      { type: BasketContextUtils.ACTION_TYPES.BASKET_CLEAR }
    );
    expect(local.getItem).lastCalledWith("no-basketItems");
    await waitFor(() =>
      expect(local.setItem).lastCalledWith("no-basketItems", "[]")
    );
  });

  it("should submit form with provided samples without recaptcha call", async () => {
    mockedWindowDocumentCookie.mockReturnValueOnce(
      `qaAuthToken=${qaAuthToken}`
    );
    render(
      <MockSiteContext>
        <BasketContextProvider>
          <SampleBasketSection data={data} />
        </BasketContextProvider>
      </MockSiteContext>
    );

    jest.spyOn(BasketContextUtils, "basketReducer");

    fireEvent.click(screen.getByText("MC: pdp.overview.completeSampleOrder"));

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Text" }
    });

    fireEvent.submit(screen.getByTestId("sample-basket-section-checkout-form"));

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        "GATSBY_GCP_FORM_SUBMIT_ENDPOINT",
        {
          method: "POST",
          body: JSON.stringify({
            locale: "en-GB",
            title: "Complete form",
            recipients: "recipient@mail.com",
            values: {
              text: "Text",
              samples:
                "id: sample-1<br>title: sample-1<br>url: http://localhost/no/sample-1-details/<br>color: green<br>texture: rough<br>measurements: 1x2x3 mm"
            }
          }),
          headers: {
            "X-Recaptcha-Token": undefined,
            "Content-Type": "application/json",
            authorization: `Bearer ${qaAuthToken}`
          }
        }
      )
    );

    expect(BasketContextUtils.basketReducer).toHaveBeenCalledWith(
      { products: [sample] },
      { type: BasketContextUtils.ACTION_TYPES.BASKET_CLEAR }
    );
    expect(local.getItem).lastCalledWith("no-basketItems");
    await waitFor(() =>
      expect(local.setItem).lastCalledWith("no-basketItems", "[]")
    );
  });

  it("should submit form with provided samples, ignoring null values", async () => {
    const sample: Sample = {
      name: "sample-1",
      code: "sample-1",
      path: "sample-1-details",
      colour: null,
      textureFamily: null,
      measurements: null
    };

    jest.spyOn(local, "getItem").mockReturnValueOnce(JSON.stringify([sample]));

    render(
      <MockSiteContext>
        <BasketContextProvider>
          <SampleBasketSection data={data} />
        </BasketContextProvider>
      </MockSiteContext>
    );

    jest.spyOn(BasketContextUtils, "basketReducer");

    fireEvent.click(screen.getByText("MC: pdp.overview.completeSampleOrder"));

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Text" }
    });

    fireEvent.submit(screen.getByTestId("sample-basket-section-checkout-form"));

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        "GATSBY_GCP_FORM_SUBMIT_ENDPOINT",
        {
          method: "POST",
          body: JSON.stringify({
            locale: "en-GB",
            title: "Complete form",
            recipients: "recipient@mail.com",
            values: {
              text: "Text",
              samples:
                "id: sample-1<br>title: sample-1<br>url: http://localhost/no/sample-1-details/"
            }
          }),
          headers: {
            "X-Recaptcha-Token": "RECAPTCHA",
            "Content-Type": "application/json",
            authorization: undefined
          }
        }
      )
    );

    expect(BasketContextUtils.basketReducer).toHaveBeenCalledWith(
      { products: [sample] },
      { type: BasketContextUtils.ACTION_TYPES.BASKET_CLEAR }
    );
    expect(local.getItem).lastCalledWith("no-basketItems");
    await waitFor(() =>
      expect(local.setItem).lastCalledWith("no-basketItems", "[]")
    );
  });

  it("should submit form with provided samples, ignoring null values without recaptcha call", async () => {
    mockedWindowDocumentCookie.mockReturnValueOnce(
      `qaAuthToken=${qaAuthToken}`
    );
    const sample: Sample = {
      name: "sample-1",
      code: "sample-1",
      path: "sample-1-details",
      colour: null,
      textureFamily: null,
      measurements: null
    };

    jest.spyOn(local, "getItem").mockReturnValueOnce(JSON.stringify([sample]));

    render(
      <MockSiteContext>
        <BasketContextProvider>
          <SampleBasketSection data={data} />
        </BasketContextProvider>
      </MockSiteContext>
    );

    jest.spyOn(BasketContextUtils, "basketReducer");

    fireEvent.click(screen.getByText("MC: pdp.overview.completeSampleOrder"));

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Text" }
    });

    fireEvent.submit(screen.getByTestId("sample-basket-section-checkout-form"));

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        "GATSBY_GCP_FORM_SUBMIT_ENDPOINT",
        {
          method: "POST",
          body: JSON.stringify({
            locale: "en-GB",
            title: "Complete form",
            recipients: "recipient@mail.com",
            values: {
              text: "Text",
              samples:
                "id: sample-1<br>title: sample-1<br>url: http://localhost/no/sample-1-details/"
            }
          }),
          headers: {
            "X-Recaptcha-Token": undefined,
            "Content-Type": "application/json",
            authorization: `Bearer ${qaAuthToken}`
          }
        }
      )
    );

    expect(BasketContextUtils.basketReducer).toHaveBeenCalledWith(
      { products: [sample] },
      { type: BasketContextUtils.ACTION_TYPES.BASKET_CLEAR }
    );
    expect(local.getItem).lastCalledWith("no-basketItems");
    await waitFor(() =>
      expect(local.setItem).lastCalledWith("no-basketItems", "[]")
    );
  });
});

describe("SampleBasketSection remove sample from basket", () => {
  describe("when all samples are removed", () => {
    it("renders empty basket content and `browse all products` button", async () => {
      render(
        <MockSiteContext>
          <BasketContextProvider>
            <SampleBasketSection data={data} />
          </BasketContextProvider>
        </MockSiteContext>
      );

      fireEvent.click(screen.getByText("MC: pdp.overview.removeSample"));

      const browseAllButton = screen.getByText("browse all products");

      expect(screen.getByText("your basket is empty.")).toBeInTheDocument();
      expect(browseAllButton).toHaveAttribute(
        "href",
        "/no/zanda-brand/torvtak/"
      );
      expect(local.getItem).lastCalledWith("no-basketItems");
      await waitFor(() =>
        expect(local.setItem).lastCalledWith("no-basketItems", "[]")
      );
    });
  });
});
