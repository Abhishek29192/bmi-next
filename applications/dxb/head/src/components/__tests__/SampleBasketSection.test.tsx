import {
  createFeature,
  createFeatureUnit,
  createFeatureValue
} from "@bmi/pim-types";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import mockConsole from "jest-mock-console";
import React from "react";
import { ConfigProvider, EnvConfig } from "../../contexts/ConfigProvider";
import * as BasketContextUtils from "../../contexts/SampleBasketContext";
import {
  BasketContextProvider,
  Sample
} from "../../contexts/SampleBasketContext";
import { local } from "../../utils/storage";
import createClassification from "../../__tests__/ClassificationHelper";
import createImage from "../../__tests__/ImageHelper";
import SampleBasketSection, { Data } from "../SampleBasketSection";
import { SiteContextProvider } from "../Site";
import { SourceType } from "../types/FormSectionTypes";
import { ClassificationCodeEnum, FeatureCodeEnum } from "../types/pim";
import { getMockSiteContext } from "./utils/SiteContextProvider";

const MockSiteContext = ({
  mockEnvConfig = { gcpFormSubmitEndpoint: "GATSBY_GCP_FORM_SUBMIT_ENDPOINT" },
  children
}: {
  mockEnvConfig?: EnvConfig["config"];
  children: React.ReactNode;
}) => {
  return (
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
  );
};

const sample: Sample = {
  name: "sample-1",
  classifications: [
    createClassification({
      code: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
      features: [
        createFeature({
          code: `${process.env.PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/${ClassificationCodeEnum.APPEARANCE_ATTRIBUTE}.${FeatureCodeEnum.COLOUR}`,
          featureValues: [createFeatureValue({ value: "green" })]
        }),
        createFeature({
          code: `${process.env.PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/${ClassificationCodeEnum.APPEARANCE_ATTRIBUTE}.${FeatureCodeEnum.TEXTURE_FAMILY}`,
          featureValues: [createFeatureValue({ value: "rough" })]
        })
      ]
    }),
    createClassification({
      name: ClassificationCodeEnum.MEASUREMENTS,
      code: ClassificationCodeEnum.MEASUREMENTS,
      features: [
        createFeature({
          code: `${process.env.PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/${ClassificationCodeEnum.MEASUREMENTS}.${FeatureCodeEnum.WIDTH}`,
          featureValues: [createFeatureValue({ value: "1" })],
          featureUnit: createFeatureUnit({
            symbol: "mm"
          })
        }),
        createFeature({
          code: `${process.env.PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/${ClassificationCodeEnum.MEASUREMENTS}.${FeatureCodeEnum.LENGTH}`,
          featureValues: [createFeatureValue({ value: "2" })],
          featureUnit: createFeatureUnit({
            symbol: "mm"
          })
        }),
        createFeature({
          code: `${process.env.PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/${ClassificationCodeEnum.MEASUREMENTS}.${FeatureCodeEnum.HEIGHT}`,
          featureValues: [createFeatureValue({ value: "3" })],
          featureUnit: createFeatureUnit({
            symbol: "mm"
          })
        })
      ]
    })
  ],
  code: "sample-1",
  image: createImage().url,
  path: "sample-1-details"
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

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

axios.CancelToken.source = jest.fn().mockReturnValue({
  token: "this",
  cancel: () => {}
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
  mockConsole();
});

describe("SampleBasketSection component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <BasketContextProvider>
        <SampleBasketSection data={data} />
      </BasketContextProvider>
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

    expect(screen.queryByText("Complete form")).toBeNull();

    fireEvent.click(screen.getByText("MC: pdp.overview.completeSampleOrder"));

    expect(container).toMatchSnapshot();

    expect(screen.queryByText("Complete form")).not.toBeNull();
    expect(
      screen.queryByText("MC: pdp.overview.completeSampleOrder")
    ).toBeNull();
    expect(local.getItem).lastCalledWith("no-basketItems");
    expect(local.setItem).lastCalledWith(
      "no-basketItems",
      '[{"name":"sample-1","classifications":[{"name":"appearanceAttributes","code":"appearanceAttributes","features":[{"code":"bmiClassificationCatalog/1.0/appearanceAttributes.colour","featureValues":[{"value":"green","code":"code"}],"featureUnit":{"name":"unit-name","symbol":"symbol","unitType":"unit-type"},"name":"name"},{"code":"bmiClassificationCatalog/1.0/appearanceAttributes.texturefamily","featureValues":[{"value":"rough","code":"code"}],"featureUnit":{"name":"unit-name","symbol":"symbol","unitType":"unit-type"},"name":"name"}]},{"name":"measurements","code":"measurements","features":[{"code":"bmiClassificationCatalog/1.0/measurements.width","featureValues":[{"value":"1","code":"code"}],"featureUnit":{"name":"name","symbol":"mm","unitType":"unit-type"},"name":"name"},{"code":"bmiClassificationCatalog/1.0/measurements.length","featureValues":[{"value":"2","code":"code"}],"featureUnit":{"name":"name","symbol":"mm","unitType":"unit-type"},"name":"name"},{"code":"bmiClassificationCatalog/1.0/measurements.height","featureValues":[{"value":"3","code":"code"}],"featureUnit":{"name":"name","symbol":"mm","unitType":"unit-type"},"name":"name"}]}],"code":"sample-1","image":"http://localhost:8000/image-real-file-name.jpg","path":"sample-1-details"}]'
    );
  });
});

describe("SampleBasketSection with form", () => {
  it("should submit form with provided samples", async () => {
    const { container } = render(
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

    fireEvent.submit(container.querySelector("form"));

    await waitFor(() =>
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "GATSBY_GCP_FORM_SUBMIT_ENDPOINT",
        {
          locale: "en-GB",
          recipients: "recipient@mail.com",
          title: "Complete form",
          values: {
            samples:
              "id: sample-1<br>title: sample-1<br>url: http://localhost/no/sample-1-details/<br>color: green<br>texture: rough<br>measurements: 1x2x3 mm",
            text: "Text"
          }
        },
        {
          cancelToken: "this",
          headers: { "X-Recaptcha-Token": "RECAPTCHA" }
        }
      )
    );

    expect(BasketContextUtils.basketReducer).toHaveBeenCalledWith(
      { products: [sample] },
      { type: BasketContextUtils.ACTION_TYPES.BASKET_CLEAR }
    );
    expect(local.getItem).lastCalledWith("no-basketItems");
    expect(local.setItem).lastCalledWith("no-basketItems", "[]");
  });

  it("should submit form with provided samples, ignoring undefined values", async () => {
    const sample: Sample = {
      name: "sample-1",
      classifications: [
        createClassification({
          code: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
          features: [
            createFeature({
              code: `${process.env.PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/${ClassificationCodeEnum.APPEARANCE_ATTRIBUTE}.${FeatureCodeEnum.COLOUR}`,
              featureValues: []
            }),
            createFeature({
              code: `${process.env.PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/${ClassificationCodeEnum.APPEARANCE_ATTRIBUTE}.${FeatureCodeEnum.TEXTURE_FAMILY}`,
              featureValues: [createFeatureValue({ value: "rough" })]
            })
          ]
        })
      ],
      code: "sample-1",
      image: createImage().url,
      path: "sample-1-details"
    };

    jest.spyOn(local, "getItem").mockReturnValueOnce(JSON.stringify([sample]));

    const { container } = render(
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

    fireEvent.submit(container.querySelector("form"));

    await waitFor(() =>
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "GATSBY_GCP_FORM_SUBMIT_ENDPOINT",
        {
          locale: "en-GB",
          recipients: "recipient@mail.com",
          title: "Complete form",
          values: {
            samples:
              "id: sample-1<br>title: sample-1<br>url: http://localhost/no/sample-1-details/<br>texture: rough",
            text: "Text"
          }
        },
        {
          cancelToken: "this",
          headers: { "X-Recaptcha-Token": "RECAPTCHA" }
        }
      )
    );

    expect(BasketContextUtils.basketReducer).toHaveBeenCalledWith(
      { products: [sample] },
      { type: BasketContextUtils.ACTION_TYPES.BASKET_CLEAR }
    );
    expect(local.getItem).lastCalledWith("no-basketItems");
    expect(local.setItem).lastCalledWith("no-basketItems", "[]");
  });

  it("should submit form with provided samples, with partial measurements", async () => {
    const sample: Sample = {
      name: "sample-1",
      classifications: [
        createClassification({
          code: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
          features: [
            createFeature({
              code: `${process.env.PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/${ClassificationCodeEnum.APPEARANCE_ATTRIBUTE}.${FeatureCodeEnum.COLOUR}`,
              featureValues: [createFeatureValue({ value: "green" })]
            }),
            createFeature({
              code: `${process.env.PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/${ClassificationCodeEnum.APPEARANCE_ATTRIBUTE}.${FeatureCodeEnum.TEXTURE_FAMILY}`,
              featureValues: [createFeatureValue({ value: "rough" })]
            })
          ]
        }),
        createClassification({
          code: ClassificationCodeEnum.MEASUREMENTS,
          features: [
            createFeature({
              code: `${process.env.PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/${ClassificationCodeEnum.MEASUREMENTS}.${FeatureCodeEnum.WIDTH}`,
              featureValues: [createFeatureValue({ value: "1" })],
              featureUnit: createFeatureUnit({ symbol: "mm" })
            }),
            createFeature({
              code: `${process.env.PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/${ClassificationCodeEnum.MEASUREMENTS}.${FeatureCodeEnum.HEIGHT}`,
              featureValues: [createFeatureValue({ value: "3" })],
              featureUnit: createFeatureUnit({ symbol: "mm" })
            })
          ]
        })
      ],
      code: "sample-1",
      image: createImage().url,
      path: "sample-1-details"
    };

    jest.spyOn(local, "getItem").mockReturnValueOnce(JSON.stringify([sample]));

    const { container } = render(
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

    fireEvent.submit(container.querySelector("form"));

    await waitFor(() =>
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "GATSBY_GCP_FORM_SUBMIT_ENDPOINT",
        {
          locale: "en-GB",
          recipients: "recipient@mail.com",
          title: "Complete form",
          values: {
            samples:
              "id: sample-1<br>title: sample-1<br>url: http://localhost/no/sample-1-details/<br>color: green<br>texture: rough<br>measurements: 1x3 mm",
            text: "Text"
          }
        },
        {
          cancelToken: "this",
          headers: { "X-Recaptcha-Token": "RECAPTCHA" }
        }
      )
    );

    expect(BasketContextUtils.basketReducer).toHaveBeenCalledWith(
      { products: [sample] },
      { type: BasketContextUtils.ACTION_TYPES.BASKET_CLEAR }
    );
    expect(local.getItem).lastCalledWith("no-basketItems");
    expect(local.setItem).lastCalledWith("no-basketItems", "[]");
  });

  it("should submit form with provided samples, with measurements without unit", async () => {
    const sample: Sample = {
      name: "sample-1",
      classifications: [
        createClassification({
          code: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
          features: [
            createFeature({
              code: `${process.env.PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/${ClassificationCodeEnum.APPEARANCE_ATTRIBUTE}.${FeatureCodeEnum.COLOUR}`,
              featureValues: [createFeatureValue({ value: "green" })]
            }),
            createFeature({
              code: `${process.env.PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/${ClassificationCodeEnum.APPEARANCE_ATTRIBUTE}.${FeatureCodeEnum.TEXTURE_FAMILY}`,
              featureValues: [createFeatureValue({ value: "rough" })]
            })
          ]
        }),
        createClassification({
          code: ClassificationCodeEnum.MEASUREMENTS,
          features: [
            createFeature({
              code: `${process.env.PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/${ClassificationCodeEnum.MEASUREMENTS}.${FeatureCodeEnum.WIDTH}`,
              featureValues: [createFeatureValue({ value: "1" })],
              featureUnit: null
            }),
            createFeature({
              code: `${process.env.PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/${ClassificationCodeEnum.MEASUREMENTS}.${FeatureCodeEnum.LENGTH}`,
              featureValues: [createFeatureValue({ value: "2" })],
              featureUnit: null
            }),
            createFeature({
              code: `${process.env.PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/${ClassificationCodeEnum.MEASUREMENTS}.${FeatureCodeEnum.HEIGHT}`,
              featureValues: [createFeatureValue({ value: "3" })],
              featureUnit: null
            })
          ]
        })
      ],
      code: "sample-1",
      image: createImage().url,
      path: "sample-1-details"
    };

    jest.spyOn(local, "getItem").mockReturnValueOnce(JSON.stringify([sample]));

    const { container } = render(
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

    fireEvent.submit(container.querySelector("form"));

    await waitFor(() =>
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "GATSBY_GCP_FORM_SUBMIT_ENDPOINT",
        {
          locale: "en-GB",
          recipients: "recipient@mail.com",
          title: "Complete form",
          values: {
            samples:
              "id: sample-1<br>title: sample-1<br>url: http://localhost/no/sample-1-details/<br>color: green<br>texture: rough<br>measurements: 1x2x3",
            text: "Text"
          }
        },
        {
          cancelToken: "this",
          headers: { "X-Recaptcha-Token": "RECAPTCHA" }
        }
      )
    );

    expect(BasketContextUtils.basketReducer).toHaveBeenCalledWith(
      { products: [sample] },
      { type: BasketContextUtils.ACTION_TYPES.BASKET_CLEAR }
    );
    expect(local.getItem).lastCalledWith("no-basketItems");
    expect(local.setItem).lastCalledWith("no-basketItems", "[]");
  });
});
describe("SampleBasketSection remove sample from basket", () => {
  describe("when all samples are removed", () => {
    it("renders empty basket content and `browse all products` button", async () => {
      const { container } = render(
        <MockSiteContext>
          <BasketContextProvider>
            <SampleBasketSection data={data} />
          </BasketContextProvider>
        </MockSiteContext>
      );

      await waitFor(() =>
        fireEvent.click(screen.getByText("MC: pdp.overview.removeSample"))
      );

      const browseAllButton = screen.getByRole("button", {
        name: "browse all products"
      });

      expect(container).toMatchSnapshot();
      expect(screen.queryByText("your basket is empty.")).not.toBeNull();
      expect(browseAllButton).not.toBeNull();
      expect(browseAllButton).toHaveAttribute(
        "href",
        "/no/zanda-brand/torvtak/"
      );
      expect(local.getItem).lastCalledWith("no-basketItems");
      expect(local.setItem).lastCalledWith("no-basketItems", "[]");
    });
  });
});
