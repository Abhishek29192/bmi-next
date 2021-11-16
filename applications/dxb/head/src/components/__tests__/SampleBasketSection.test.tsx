import React from "react";
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

const sample: Sample = {
  name: "sample-1",
  classifications: [
    createClassification({
      code: "appearanceAttributes",
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
      <BasketContextProvider>
        <SampleBasketSection data={data} />
      </BasketContextProvider>
    );

    expect(screen.queryByText("Complete form")).toBeNull();

    fireEvent.click(screen.getByText("MC: pdp.overview.completeSampleOrder"));

    expect(container).toMatchSnapshot();

    expect(screen.queryByText("Complete form")).not.toBeNull();
    expect(
      screen.queryByText("MC: pdp.overview.completeSampleOrder")
    ).toBeNull();
  });
});

describe("SampleBasketSection with form", () => {
  it("should submit form with provided samples", async () => {
    process.env.GATSBY_GCP_FORM_SUBMIT_ENDPOINT =
      "GATSBY_GCP_FORM_SUBMIT_ENDPOINT";
    const { container } = render(
      <BasketContextProvider>
        <SampleBasketSection data={data} />
      </BasketContextProvider>
    );

    fireEvent.click(screen.getByText("MC: pdp.overview.completeSampleOrder"));

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Text" }
    });

    fireEvent.submit(container.querySelector("form"));

    await waitFor(() =>
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "GATSBY_GCP_FORM_SUBMIT_ENDPOINT",
        {
          locale: "",
          recipients: "recipient@mail.com",
          title: "Complete form",
          values: {
            samples: [
              {
                color: "green",
                id: "sample-1",
                texture: "rough",
                title: "sample-1",
                url: "sample-1-details"
              }
            ],
            text: "Text"
          }
        },
        {
          cancelToken: "this",
          headers: { "X-Recaptcha-Token": "RECAPTCHA" }
        }
      )
    );
  });
});
