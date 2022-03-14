import { ThemeProvider } from "@bmi/components";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as Gatsby from "gatsby";
import React from "react";
import { ConfigProvider } from "../../contexts/ConfigProvider";
import FormSection, { Data, FormInputs, InputWidthType } from "../FormSection";
import { DataTypeEnum } from "../Link";
import { SiteContextProvider } from "../Site";
import { SourceType } from "../types/FormSectionTypes";
import { getMockSiteContext } from "./utils/SiteContextProvider";

const MockSiteContext = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <SiteContextProvider
        value={{
          ...getMockSiteContext("no"),
          reCaptchaKey: "1234",
          reCaptchaNet: false
        }}
      >
        {children}
      </SiteContextProvider>
    </ThemeProvider>
  );
};
const submitText = "Submit";
const data: Data = {
  __typename: "ContentfulFormSection",
  title: "Test form",
  showTitle: null,
  description: null,
  recipients: "recipient@mail.com",
  emailSubjectFormat: "emailSubjectFormat",
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
      label: "CheckboxGroup",
      name: "checkboxGroup Name",
      options: "CheckboxGroup1, CheckboxGroup2, CheckboxGroup3",
      type: "checkboxGroup"
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
  source: SourceType.HubSpot,
  hubSpotFormGuid: "abc123"
};

jest.mock("react-google-recaptcha-v3", () => ({
  useGoogleReCaptcha: () => ({
    executeRecaptcha: () => "RECAPTCHA"
  })
}));

const onSuccess = jest.fn();
jest.spyOn(Gatsby, "navigate").mockImplementation();

const fetchMock = jest.fn();
jest.mock("node-fetch", () => {
  const original = jest.requireActual("node-fetch");
  return {
    ...original,
    __esModule: true,
    default: (...config) => fetchMock(...config)
  };
});

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

describe("FormSection component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <ThemeProvider>
        <FormSection data={data} backgroundColor="white" />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it("test flow when gtm data passed from outside", () => {
    const { container } = render(
      <ThemeProvider>
        <FormSection
          data={data}
          backgroundColor="white"
          gtmOverride={{
            label: "GTM-label",
            action: "GTM-action"
          }}
        />
      </ThemeProvider>
    );

    const specificationButton = container.querySelector(
      `button[type="submit"]`
    );
    expect(specificationButton).toHaveAttribute("aria-label", "GTM-label");
    expect(specificationButton).toHaveAttribute("data-action", "GTM-action");
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
      <ThemeProvider>
        <FormSection data={specificData} backgroundColor="white" />
      </ThemeProvider>
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
      <ThemeProvider>
        <FormSection data={specificData} backgroundColor="white" />
      </ThemeProvider>
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
      <ThemeProvider>
        <FormSection data={specificData} backgroundColor="white" />
      </ThemeProvider>
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
      <ThemeProvider>
        <FormSection data={specificData} backgroundColor="white" />
      </ThemeProvider>
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
      <ThemeProvider>
        <FormSection data={specificData} backgroundColor="white" />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("test submit when preview is on", () => {
    jest.spyOn(window, "alert").mockImplementation();
    const { container } = render(
      <ThemeProvider>
        <ConfigProvider configObject={{ isPreviewMode: true }}>
          <FormSection data={data} backgroundColor="white" />
        </ConfigProvider>
      </ThemeProvider>
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
      <ConfigProvider
        configObject={{
          gcpFormSubmitEndpoint: "GATSBY_GCP_FORM_SUBMIT_ENDPOINT"
        }}
      >
        <MockSiteContext>
          <FormSection
            data={specificData}
            backgroundColor="white"
            onSuccess={onSuccess}
          />
        </MockSiteContext>
      </ConfigProvider>
    );

    const textInput = container.querySelector(`input[name="text"]`);
    fireEvent.change(textInput, {
      target: { value: "text value" }
    });
    fireEvent.submit(container.querySelector("form"));

    fetchMock.mockReturnValueOnce({ ok: true });

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        "GATSBY_GCP_FORM_SUBMIT_ENDPOINT",
        {
          method: "POST",
          body: JSON.stringify({
            locale: "en-GB",
            title: "Test form",
            recipients: "recipient@mail.com",
            values: { text: "text value" },
            emailSubjectFormat: "emailSubjectFormat"
          }),
          headers: {
            "X-Recaptcha-Token": "RECAPTCHA",
            "Content-Type": "application/json"
          }
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
      <ConfigProvider
        configObject={{
          gcpFormSubmitEndpoint: "GATSBY_GCP_FORM_SUBMIT_ENDPOINT"
        }}
      >
        <MockSiteContext>
          <FormSection
            data={specificData}
            backgroundColor="white"
            onSuccess={jest.fn()}
          />
        </MockSiteContext>
      </ConfigProvider>
    );

    const textInput = container.querySelector(`input[name="text"]`);
    fireEvent.change(textInput, {
      target: { value: "text value" }
    });
    fireEvent.submit(container.querySelector("form"));

    fetchMock.mockReturnValueOnce({ ok: true });

    expect(await waitFor(() => fetchMock)).toHaveBeenCalledWith(
      "GATSBY_GCP_FORM_SUBMIT_ENDPOINT",
      {
        method: "POST",
        body: JSON.stringify({
          locale: "en-GB",
          title: "Test form",
          recipients: "recipient@mail.com",
          values: { text: "text value" },
          emailSubjectFormat: "emailSubjectFormat"
        }),
        headers: {
          "X-Recaptcha-Token": "RECAPTCHA",
          "Content-Type": "application/json"
        }
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

    fetchMock.mockRejectedValueOnce(new Error("Async error"));
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
      <ThemeProvider>
        <FormSection data={specificData} backgroundColor="white" />
      </ThemeProvider>
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
            "I agree with BMI's [Data Protection Policy](http://www.bmigroup.com)",
          name: "checkbox-wih-link",
          type: "checkbox"
        }
      ]
    };
    const { container } = render(
      <ThemeProvider>
        <FormSection data={specificData} backgroundColor="white" />
      </ThemeProvider>
    );
    const ExternalLinkLabel = container.querySelector(
      `a[href="https://google.co.uk"]`
    );
    const InternalLinkLabel = container.querySelector(
      `a[href="http://www.bmigroup.com"]`
    );
    expect(ExternalLinkLabel).toHaveAttribute("rel");
    expect(InternalLinkLabel).not.toHaveAttribute("rel");
    expect(container).toMatchSnapshot();
  });

  it("test options in a Select", () => {
    const specificData = [
      {
        label: "Select",
        name: "select",
        options: "Option1",
        type: "select"
      }
    ];
    render(
      <ThemeProvider>
        <FormInputs inputs={specificData} />
      </ThemeProvider>
    );
    const select = screen.getByRole("button");
    fireEvent.mouseDown(select);

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent("MC: form.none.selection");
    expect(options[1]).toHaveTextContent("Option1");
  });

  it("test multiply options in a checkbox group", async () => {
    const specificData = [
      {
        label: "Pizza",
        name: "pizza",
        options: "Parma, Caprize, Margarita",
        type: "checkboxGroup"
      }
    ];

    const { container } = render(
      <ConfigProvider
        configObject={{
          gcpFormSubmitEndpoint: "GATSBY_GCP_FORM_SUBMIT_ENDPOINT"
        }}
      >
        <MockSiteContext>
          <FormSection
            data={{ ...data, inputs: specificData }}
            backgroundColor="white"
            onSuccess={jest.fn()}
          />
        </MockSiteContext>
      </ConfigProvider>
    );

    const checkboxes = container.querySelectorAll(`input[type="checkbox"]`);
    expect(container).toMatchSnapshot();
    fireEvent.click(checkboxes[2]);
    fireEvent.click(checkboxes[0]);
    fireEvent.submit(container.querySelector("form"));
    expect(await waitFor(() => fetchMock)).toHaveBeenCalledWith(
      "GATSBY_GCP_FORM_SUBMIT_ENDPOINT",
      {
        method: "POST",
        body: JSON.stringify({
          locale: "en-GB",
          title: "Test form",
          recipients: "recipient@mail.com",
          values: { pizza: ["Margarita", "Parma"] },
          emailSubjectFormat: "emailSubjectFormat"
        }),
        headers: {
          "X-Recaptcha-Token": "RECAPTCHA",
          "Content-Type": "application/json"
        }
      }
    );
  });

  describe("Hubspot FormSection component", () => {
    it("renders correctly", () => {
      const { container } = render(
        <ThemeProvider>
          <FormSection data={dataHubSpot} backgroundColor="white" />
        </ThemeProvider>
      );

      expect(container).toMatchSnapshot();
    });

    it("renders correctly with sampleIds", () => {
      const sampleIds =
        "0945848_test_prod_variant1, 0945849_test_prod_variant2";

      const onFormReadyEvent = new MessageEvent("message", {
        data: {
          type: "hsFormCallback",
          eventName: "onFormReady"
        }
      });

      const { container } = render(
        <ThemeProvider>
          <FormSection
            data={dataHubSpot}
            sampleIds={sampleIds}
            backgroundColor="white"
          />
        </ThemeProvider>
      );
      window.dispatchEvent(onFormReadyEvent);

      expect(container).toMatchSnapshot();
    });

    it("test submit when preview is on", () => {
      process.env.GATSBY_PREVIEW = "GATSBY_PREVIEW";
      jest.spyOn(window, "alert").mockImplementation();
      const { container } = render(
        <ThemeProvider>
          <FormSection data={dataHubSpot} backgroundColor="white" />
        </ThemeProvider>
      );
      expect(container).toMatchSnapshot();
    });
  });

  it("calls onSuccess function", () => {
    render(
      <ThemeProvider>
        <FormSection
          data={dataHubSpot}
          backgroundColor="white"
          onSuccess={onSuccess}
        />
      </ThemeProvider>
    );

    const onFormSubmittedEvent = new MessageEvent("message", {
      data: {
        eventName: "onFormSubmitted"
      }
    });
    window.dispatchEvent(onFormSubmittedEvent);
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it("calls onFormReady function", () => {
    const onFormReady = jest.fn();
    const onFormReadyEvent = new MessageEvent("message", {
      data: {
        type: "hsFormCallback",
        eventName: "onFormReady"
      }
    });

    render(
      <ThemeProvider>
        <FormSection
          data={dataHubSpot}
          backgroundColor="white"
          onFormReady={onFormReady}
        />
      </ThemeProvider>
    );
    window.dispatchEvent(onFormReadyEvent);
    expect(onFormReady).toHaveBeenCalledTimes(1);
  });

  it("calls onFormLoadError function", () => {
    const onFormLoadError = jest.fn();
    const onFormLoadErrorEvent = new MessageEvent("message", {
      data: {
        type: "hsFormCallback",
        eventName: "onFormDefinitionFetchError"
      }
    });

    render(
      <ThemeProvider>
        <FormSection
          data={dataHubSpot}
          backgroundColor="white"
          onFormLoadError={onFormLoadError}
        />
      </ThemeProvider>
    );
    window.dispatchEvent(onFormLoadErrorEvent);
    expect(onFormLoadError).toHaveBeenCalledTimes(1);
  });

  it("renders correctly for dialog", () => {
    const { container } = render(
      <ThemeProvider>
        <FormSection data={dataHubSpot} backgroundColor="white" isDialog />
      </ThemeProvider>
    );
    expect(container.querySelector(".Section")).toBeNull();
    expect(container).toMatchSnapshot();
  });
});
