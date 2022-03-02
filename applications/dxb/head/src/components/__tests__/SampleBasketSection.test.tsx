import React from "react";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import {
  BasketContextProvider,
  Sample
} from "../../contexts/SampleBasketContext";
import createClassification from "../../__tests__/ClassificationHelper";
import createImage from "../../__tests__/ImageHelper";
import SampleBasketSection, { Data } from "../SampleBasketSection";
import { local } from "../../utils/storage";
import { SiteContextProvider } from "../Site";
import * as BasketContextUtils from "../../contexts/SampleBasketContext";
import { ClassificationCodeEnum } from "../types/pim";
import { getMockSiteContext } from "./utils/SiteContextProvider";

const MockSiteContext = ({ children }: { children: React.ReactNode }) => {
  return (
    <SiteContextProvider
      value={{
        ...getMockSiteContext("no"),
        reCaptchaKey: "1234",
        reCaptchaNet: false
      }}
    >
      {children}
    </SiteContextProvider>
  );
};

const sample: Sample = {
  name: "sample-1",
  classifications: [
    createClassification({
      code: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
      features: [
        {
          code: "colour",
          featureValues: [{ value: "green" }],
          name: "colour"
        },
        {
          code: "texturefamily",
          featureValues: [{ value: "rough" }],
          name: "texturefamily"
        }
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
    source: "Contentful",
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

axios.CancelToken.source = jest
  .fn()
  .mockReturnValue({ token: "this", cancel: () => {} });

jest.mock("react-google-recaptcha-v3", () => ({
  useGoogleReCaptcha: () => ({
    executeRecaptcha: () => "RECAPTCHA"
  })
}));

jest.spyOn(local, "getItem").mockReturnValue(JSON.stringify([sample]));
jest.spyOn(local, "setItem");

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
      '[{"name":"sample-1","classifications":[{"name":"appearanceAttributes","code":"appearanceAttributes","features":[{"code":"colour","featureValues":[{"value":"green"}],"name":"colour"},{"code":"texturefamily","featureValues":[{"value":"rough"}],"name":"texturefamily"}]}],"code":"sample-1","image":"http://localhost:8000/image-real-file-name.jpg","path":"sample-1-details"}]'
    );
  });
});

describe("SampleBasketSection with form", () => {
  it("should submit form with provided samples", async () => {
    process.env.GATSBY_GCP_FORM_SUBMIT_ENDPOINT =
      "GATSBY_GCP_FORM_SUBMIT_ENDPOINT";
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
              "id: sample-1<br>title: sample-1<br>url: http://localhost/no/sample-1-details<br>color: green<br>texture: rough",
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