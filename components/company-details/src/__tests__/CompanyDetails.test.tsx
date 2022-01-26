import React from "react";
import { render } from "@testing-library/react";
import CompanyDetails from "../";

describe("CompanyDetails component", () => {
  it("renders with no details", () => {
    const { container } = render(
      <CompanyDetails name="Name of the company" details={[]}>
        <p>Summary</p>
      </CompanyDetails>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders with no details and no name", () => {
    const { container } = render(
      <CompanyDetails details={[]}>
        <p>Summary</p>
      </CompanyDetails>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders all types of details", () => {
    const { container } = render(
      <CompanyDetails
        name="Name of the company"
        details={[
          {
            type: "address",
            text: "full address",
            label: "Address"
          },
          {
            type: "address",
            text: "full address",
            textStyle: "bold",
            label: "Address"
          },
          {
            type: "address",
            text: "full address",
            label: "Address",
            display: "contentOnly"
          },
          {
            type: "address",
            text: "full address",
            label: "Address",
            display: "icon"
          },
          {
            type: "address",
            text: "full address",
            label: "Address",
            display: "label"
          },
          {
            type: "distance",
            text: "12.56km",
            label: "Distance"
          },
          {
            type: "cta",
            text: "Get directions",
            action: { model: "htmlLink", href: "https://google.com" },
            label: "Get directions"
          },
          {
            type: "phone",
            text: "67 97 90 99",
            action: { model: "htmlLink", href: "tel:000000000000" },
            label: "Telephone"
          },
          {
            type: "email",
            text: "hello@roofingcompany.com",
            action: {
              model: "htmlLink",
              href: "mailto:hello@roofingcompany.com"
            },
            label: "Email"
          },
          {
            type: "website",
            text: "Visit website",
            action: { model: "htmlLink", href: "https://roofingcompany.com" },
            label: "Website"
          },
          {
            type: "content",
            label: "Type of roof",
            text: <b>Flat</b>
          },
          {
            type: "roofProLevel",
            label: "BMI RoofPro Level",
            level: "expert"
          },
          {
            type: "roofProLevel",
            label: "BMI RoofPro Level",
            level: "elite"
          },
          {
            type: "roofProLevel",
            label: "BMI RoofPro Level",
            level: "partner"
          },
          {
            type: "roofProLevel",
            label: "BMI RoofPro Level",
            level: "invalid-level"
          }
        ]}
      >
        <p>Summary</p>
      </CompanyDetails>
    );
    expect(container).toMatchSnapshot();
  });
});
