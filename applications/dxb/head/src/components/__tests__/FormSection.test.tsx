import "@testing-library/jest-dom";
import React from "react";
import { render } from "@testing-library/react";
import FormSection, { Data } from "../FormSection";
import { DataTypeEnum } from "../Link";

const submitText = "Submit";
const data: Data = {
  __typename: "ContentfulFormSection",
  title: "Test form",
  showTitle: null,
  description: null,
  recipients: "recipient@mail.com",
  inputs: [
    {
      label: "Text",
      name: "text",
      type: "text"
    },
    {
      label: "Email",
      name: "email",
      required: true,
      type: "email",
      width: "half"
    },
    {
      label: "Checkbox",
      name: "checkbox",
      type: "checkbox"
    },
    {
      label: "Radio",
      name: "radio",
      options: "Option1, Option2, Option3",
      type: "radio"
    },
    {
      label: "Select",
      name: "select",
      options: "Option1, Option2=value2, Option3",
      type: "select"
    },
    {
      accept: ".pdf, .jpg, .jpeg, .png",
      label: "Upload",
      maxSize: 5,
      name: "upload",
      type: "upload"
    },
    {
      label: "Hubspot text",
      name: "hubspot-text",
      type: "hubspot-text"
    },
    {
      label: "Hubspot hidden",
      name: "hubspot-hidden",
      type: "hubspot-hidden"
    },
    {
      label: "Hubspot checkbox",
      name: "hubspot-checkbox",
      type: "hubspot-checkbox"
    },
    {
      label: "Hubspot checkbox",
      name: "hubspot-checkbox",
      type: "hubspot-checkbox"
    }
  ],
  submitText,
  successRedirect: {
    __typename: "ContentfulLink",
    id: "link",
    label: "Thank you",
    icon: null,
    isLabelHidden: false,
    url: "link-to-page",
    linkedPage: null,
    type: DataTypeEnum.Internal,
    parameters: null,
    dialogContent: null,
    hubSpotCTAID: null
  },
  source: null,
  hubSpotFormGuid: null
};
describe("FormSection component", () => {
  it("renders correctly", () => {
    const setState = jest.fn();

    const wrapper = render(<FormSection data={data} backgroundColor="white" />);

    expect(wrapper.container.firstChild).toMatchSnapshot();
  });
  it("test flow when gtm data passed from outside", () => {
    const { container } = render(
      <FormSection
        data={data}
        backgroundColor="white"
        gtmOverride={{
          label: "GTM-label",
          action: "GTM-action"
        }}
      />
    );

    const specificationButton = container.querySelector(
      `button[type="submit"]`
    );
    expect(specificationButton).toHaveAttribute("aria-label", "GTM-label");
    expect(specificationButton).toHaveAttribute("aria-action", "GTM-action");
  });
});

describe("Hubspot FormSection component", () => {
  it("renders correctly", () => {
    const data: Data = {
      __typename: "ContentfulFormSection",
      title: "Test form",
      showTitle: null,
      description: null,
      recipients: "recipient@mail.com",
      inputs: null,
      submitText: "Submit",
      successRedirect: {
        __typename: "ContentfulLink",
        id: "link",
        label: "Thank you",
        icon: null,
        isLabelHidden: false,
        url: "link-to-page",
        linkedPage: null,
        type: DataTypeEnum.Internal,
        parameters: null,
        dialogContent: null,
        hubSpotCTAID: null
      },
      source: "HubSpot",
      hubSpotFormGuid: "abc123"
    };

    const { container } = render(
      <FormSection data={data} backgroundColor="white" />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
