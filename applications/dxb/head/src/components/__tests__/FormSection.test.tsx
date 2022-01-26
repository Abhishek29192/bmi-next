import "@testing-library/jest-dom";
import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import axios from "axios";
import * as Gatsby from "gatsby";
import FormSection, { Data, InputWidthType } from "../FormSection";
import { DataTypeEnum } from "../Link";
import { SiteContextProvider } from "../Site";
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
      label: "Textarea",
      name: "textarea",
      type: "textarea"
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
      type: "upload",
      width: "full"
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
const dataHubSpot: Data = {
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

jest.mock("react-google-recaptcha-v3", () => ({
  useGoogleReCaptcha: () => ({
    executeRecaptcha: () => "RECAPTCHA"
  })
}));

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

process.env.GATSBY_GCP_FORM_SUBMIT_ENDPOINT = "GATSBY_GCP_FORM_SUBMIT_ENDPOINT";
const onSuccess = jest.fn();
jest.spyOn(Gatsby, "navigate").mockImplementation();
axios.CancelToken.source = jest.fn().mockReturnValue({
  token: "this",
  cancel: () => {}
});

afterEach(() => {
  jest.restoreAllMocks();
  delete process.env.GATSBY_PREVIEW;
});

describe("FormSection component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <FormSection data={data} backgroundColor="white" />
    );

    expect(container).toMatchSnapshot();
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

  it("test handleEmailValidation with incorrect email", () => {
    const specificData = {
      ...data,
      inputs: [
        {
          label: "Email",
          name: "email",
          required: true,
          type: "email",
          width: "full" as InputWidthType
        }
      ]
    };
    const { container } = render(
      <FormSection data={specificData} backgroundColor="white" />
    );
    const emailInput = container.querySelector(`input[name="email"]`);
    fireEvent.change(emailInput, {
      target: { value: "test-email" }
    });
    fireEvent.blur(emailInput);
    expect(container).toMatchSnapshot();
  });

  it("test handleEmailValidation with correct email", () => {
    const specificData = {
      ...data,
      inputs: [
        {
          label: "Email",
          name: "email",
          required: true,
          type: "email",
          width: "half" as InputWidthType
        }
      ]
    };
    const { container } = render(
      <FormSection data={specificData} backgroundColor="white" />
    );
    const emailInput = container.querySelector(`input[name="email"]`);
    fireEvent.change(emailInput, {
      target: { value: "test@gmail.com" }
    });
    fireEvent.blur(emailInput);
    expect(container).toMatchSnapshot();
  });

  it("test upload input with large file", async () => {
    const specificData = {
      ...data,
      inputs: [
        {
          accept: ".pdf, .jpg, .jpeg, .png",
          label: "Upload",
          maxSize: 1,
          name: "upload",
          type: "upload"
        }
      ]
    };
    const { container, getByTestId } = render(
      <FormSection data={specificData} backgroundColor="white" />
    );
    const upload = getByTestId("upload");
    fireEvent.change(upload, {
      target: {
        files: [{ name: "fileName", size: 10485761, type: "pdf" }]
      }
    });
    expect(await waitFor(() => container)).toMatchSnapshot();
  });

  it("test upload input with small file", async () => {
    const specificData = {
      ...data,
      inputs: [
        {
          accept: ".pdf, .jpg, .jpeg, .png",
          label: "Upload",
          maxSize: 1,
          name: "upload",
          type: "upload"
        }
      ]
    };
    const { container, getByTestId } = render(
      <FormSection data={specificData} backgroundColor="white" />
    );
    const upload = getByTestId("upload");
    fireEvent.change(upload, {
      target: {
        files: [{ name: "fileName", size: 200, type: "pdf" }]
      }
    });
    expect(await waitFor(() => container)).toMatchSnapshot();
  });

  it("test upload input with no maxSize", () => {
    const specificData = {
      ...data,
      inputs: [
        {
          accept: ".pdf, .jpg, .jpeg, .png",
          label: "Upload",
          maxSize: 1,
          name: "upload",
          type: "upload"
        }
      ]
    };
    const { container } = render(
      <FormSection data={specificData} backgroundColor="white" />
    );
    expect(container).toMatchSnapshot();
  });

  it("test submit when preview is on", () => {
    process.env.GATSBY_PREVIEW = "GATSBY_PREVIEW";
    jest.spyOn(window, "alert").mockImplementation();
    const { container } = render(
      <FormSection data={data} backgroundColor="white" />
    );
    fireEvent.submit(container.querySelector("form"));
    expect(window.alert).toHaveBeenCalledWith(
      "You cannot submit a form on a preview environment."
    );
  });

  it("test submit form with redirect url", async () => {
    const specificData = {
      ...data,
      inputs: [
        {
          label: "Text",
          name: "text",
          type: "text"
        }
      ]
    };
    jest.spyOn(Gatsby, "navigate").mockImplementation();
    const { container } = render(
      <MockSiteContext>
        <FormSection
          data={specificData}
          backgroundColor="white"
          onSuccess={onSuccess}
        />
      </MockSiteContext>
    );

    const textInput = container.querySelector(`input[name="text"]`);
    fireEvent.change(textInput, {
      target: { value: "text value" }
    });
    fireEvent.submit(container.querySelector("form"));

    await waitFor(() =>
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "GATSBY_GCP_FORM_SUBMIT_ENDPOINT",
        {
          locale: "en-GB",
          recipients: "recipient@mail.com",
          title: "Test form",
          values: { text: "text value" }
        },
        {
          cancelToken: "this",
          headers: { "X-Recaptcha-Token": "RECAPTCHA" }
        }
      )
    );
    expect(onSuccess).toHaveBeenCalled();
    expect(Gatsby.navigate).toBeCalledWith("link-to-page");
  });

  it("test submit form with no redirect url", async () => {
    const specificData = {
      ...data,
      inputs: [
        {
          label: "Text",
          name: "text",
          type: "text"
        }
      ],
      successRedirect: null
    };
    jest.spyOn(Gatsby, "navigate").mockImplementation();
    const { container } = render(
      <MockSiteContext>
        <FormSection
          data={specificData}
          backgroundColor="white"
          onSuccess={jest.fn()}
        />
      </MockSiteContext>
    );

    const textInput = container.querySelector(`input[name="text"]`);
    fireEvent.change(textInput, {
      target: { value: "text value" }
    });
    fireEvent.submit(container.querySelector("form"));

    expect(await waitFor(() => mockedAxios.post)).toHaveBeenCalledWith(
      "GATSBY_GCP_FORM_SUBMIT_ENDPOINT",
      {
        locale: "en-GB",
        recipients: "recipient@mail.com",
        title: "Test form",
        values: { text: "text value" }
      },
      {
        cancelToken: "this",
        headers: { "X-Recaptcha-Token": "RECAPTCHA" }
      }
    );

    expect(Gatsby.navigate).toBeCalledWith("/");
  });

  it("test submit form with error", async () => {
    const specificData = {
      ...data,
      inputs: [
        {
          label: "Text",
          name: "text",
          type: "text"
        }
      ],
      successRedirect: null
    };
    const { container } = render(
      <MockSiteContext>
        <FormSection data={specificData} backgroundColor="white" />
      </MockSiteContext>
    );

    const textInput = container.querySelector(`input[name="text"]`);
    fireEvent.change(textInput, {
      target: { value: "text value" }
    });
    fireEvent.submit(container.querySelector("form"));

    mockedAxios.post.mockRejectedValueOnce(new Error("Async error"));
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    expect(consoleSpy).toHaveBeenCalled();
  });

  it("test convertMarkdownLinksToAnchorLinks function with no label", () => {
    const specificData = {
      ...data,
      inputs: [
        {
          label: "",
          name: "checkbox-null-label",
          type: "checkbox"
        }
      ]
    };
    const { container } = render(
      <FormSection data={specificData} backgroundColor="white" />
    );
    expect(container).toMatchSnapshot();
  });

  it("test convertMarkdownLinksToAnchorLinks function with link in label", () => {
    const specificData = {
      ...data,
      inputs: [
        {
          label:
            "I agree with BMI's [Data Protection Policy](https://google.co.uk)",
          name: "checkbox-wih-link",
          type: "checkbox"
        },
        {
          label:
            "I agree with BMI's [Data Protection Policy](http://localhost/co.uk)",
          name: "checkbox-wih-link",
          type: "checkbox"
        }
      ]
    };
    const { container } = render(
      <FormSection data={specificData} backgroundColor="white" />
    );
    const ExternalLinkLabel = container.querySelector(
      `a[href="https://google.co.uk"]`
    );
    const InternalLinkLabel = container.querySelector(
      `a[href="http://localhost/co.uk"]`
    );
    expect(ExternalLinkLabel).toHaveAttribute("rel");
    expect(InternalLinkLabel).not.toHaveAttribute("rel");
    expect(container).toMatchSnapshot();
  });
});

describe("Hubspot FormSection component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <FormSection data={dataHubSpot} backgroundColor="white" />
    );

    expect(container).toMatchSnapshot();
  });

  it("test submit when preview is on", () => {
    process.env.GATSBY_PREVIEW = "GATSBY_PREVIEW";
    jest.spyOn(window, "alert").mockImplementation();
    const { container } = render(
      <FormSection data={dataHubSpot} backgroundColor="white" />
    );
    expect(container).toMatchSnapshot();
  });
});
