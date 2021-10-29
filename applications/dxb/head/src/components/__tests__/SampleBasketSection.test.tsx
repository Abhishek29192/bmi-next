import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  BasketContextProvider,
  Sample
} from "../../contexts/SampleBasketContext";
import createClassification from "../../__tests__/ClassificationHelper";
import createImage from "../../__tests__/ImageHelper";
import { createVariantOption } from "../../__tests__/PimDocumentProductHelper";
import SampleBasketSection, { Data } from "../SampleBasketSection";

const samples: Sample[] = [
  {
    name: "sample-1",
    ...createVariantOption({
      code: "sample-1",
      images: [createImage()],
      path: "sample-1-details",
      classifications: [createClassification({ code: "appearanceAttributes" })]
    })
  }
];

const data: Data = {
  __typename: "SampleBasketSection",
  description: {
    raw: '{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"test rich text","marks":[],"data":{}}],"data":{}}]}',
    references: null
  },
  sections: {
    __typename: "ContentfulFormSection",
    title: "Complete form",
    showTitle: true,
    description: null,
    recipients: "recipient@mail.com",
    inputs: null,
    submitText: "Submit",
    successRedirect: null,
    source: "HubSpot",
    hubSpotFormGuid: null
  }
};

describe("SampleBasketSection component", () => {
  beforeAll(() => {
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn().mockReturnValue(JSON.stringify(samples)),
        setItem: jest.fn()
      }
    });
  });

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
