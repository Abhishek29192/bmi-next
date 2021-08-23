import React from "react";
// import { render } from "../../../test/renderWithRouter";
import { render } from "@testing-library/react";
import Component from "../leadBlockSection";
import { Category, Feature, Classification } from "../types";
import { Data as LinkData } from "../../../components/Link";
import "@testing-library/jest-dom";

type Props = {
  name: string;
  categories: Category[];
  classifications: Classification[];
  cta?: LinkData;
  uniqueSellingPropositions?: Feature;
};

const props: Props = {
  name: "test",
  categories: [
    {
      categoryType: "Brand",
      name: "Monarflex",
      image: {
        allowedToDownload: false,
        fileSize: 1,
        mime: "mime",
        name: "image name",
        realFileName: "test",
        url: "test image Url"
      }
    }
  ],
  classifications: [
    {
      code: "systemAttributes",
      features: [
        {
          code: "bmiSystemsClassificationCatalog/1.0/systemAttributes.promotionalcontent",
          featureValues: [
            {
              value: "Sample PC value"
            }
          ],
          name: "Promotional Content"
        }
      ],
      name: "systemAttributes Classification"
    }
  ],
  uniqueSellingPropositions: {
    code: "bmiSystemsClassificationCatalog/1.0/systemAttributes.uniquesellingpropositions",
    featureValues: [
      {
        value: "Sample USP value"
      },
      {
        value: "Sample USP value 2"
      }
    ],
    name: "Unique Selling Propositions"
  }
};

describe("LeadBlock Section tests", () => {
  it("should render", () => {
    const {
      categories,
      classifications,
      uniqueSellingPropositions: { featureValues }
    } = props;
    const { container, queryAllByText } = render(<Component {...props} />);

    const systemAttributesContent = queryAllByText(featureValues[0].value);
    const promotionalContent = queryAllByText(
      classifications[0].features[0].featureValues[0].value
    );
    const brandLogo = container.querySelector(`.brandLogo`);

    expect(container).toMatchSnapshot();
    expect(systemAttributesContent.length).toBeTruthy();
    expect(promotionalContent.length).toBeTruthy();
    expect(brandLogo).toBeInTheDocument();
    expect(brandLogo).toHaveAttribute("src", categories[0].image.url);
  });

  it("should hide systemAttributes post-it Card when no uniqueSellingPropositions feature", () => {
    const { container } = render(
      <Component {...props} uniqueSellingPropositions={null} />
    );

    const systemAttributesContent = container.querySelectorAll(
      "[class*=PostItCard]"
    );

    expect(container).toMatchSnapshot();
    expect(systemAttributesContent.length).toBeFalsy();
  });
});
