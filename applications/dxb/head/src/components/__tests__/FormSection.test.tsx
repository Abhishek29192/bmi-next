import ThemeProvider from "@bmi-digital/components/theme-provider";
import { replaceSpaces } from "@bmi-digital/components/utils";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { ConfigProvider } from "../../contexts/ConfigProvider";
import FormSection, {
  Data,
  FormInputs,
  InputType,
  InputWidthType
} from "../FormSection";
import { SiteContextProvider } from "../Site";
import { DataTypeEnum } from "../link/types";
import { SourceType } from "../types/FormSectionTypes";
import { getMockSiteContext } from "./utils/SiteContextProvider";
import type { GTM } from "@bmi-digital/components/types";

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

const formId = "form-1";
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
  source: SourceType.Contentful,
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

const mockExecutRecaptcha = jest.fn();
jest.mock("react-google-recaptcha-v3", () => ({
  useGoogleReCaptcha: () => ({
    executeRecaptcha: () => mockExecutRecaptcha()
  })
}));

const onSuccess = jest.fn();

const pushMock = jest.fn();
jest.mock("next/router", () => ({
  useRouter: jest.fn().mockImplementation(() => ({
    push: (route: string, options?: string) => pushMock(route, options)
  }))
}));

const fetchMock = jest.fn();
jest.mock("node-fetch", () => {
  const original = jest.requireActual("node-fetch");
  return {
    ...original,
    __esModule: true,
    default: (...config: unknown[]) => fetchMock(...config)
  };
});

jest.mock("lodash-es/uniqueId", () => ({
  __esModule: true,
  default: (value: string) => value
}));

beforeEach(() => {
  mockExecutRecaptcha.mockReturnValue("RECAPTCHA");
});

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

describe("FormSection component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <ThemeProvider>
        <FormSection id={formId} data={data} backgroundColor="white" />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it("should use the following GTM object by default", () => {
    const defaultGTMObject: GTM = {
      id: "form-button1",
      action: data.title,
      label: "children"
    };

    render(
      <ThemeProvider>
        <FormSection id={formId} data={data} backgroundColor="white" />
      </ThemeProvider>
    );

    expect(
      screen.getByTestId(`contentful-form-section-Test-form-submit-button`)
    ).toHaveAttribute("data-gtm", JSON.stringify(defaultGTMObject));
  });

  it("should replace the action and label GTM object properties if the gtmOverride prop is defined", () => {
    render(
      <ThemeProvider>
        <FormSection
          id={formId}
          data={data}
          backgroundColor="white"
          gtmOverride={{
            action: "gtmActionOverride",
            label: "gtmLabelOverride"
          }}
        />
      </ThemeProvider>
    );

    const expectedGTMObject: GTM = {
      id: "form-button1",
      action: "gtmActionOverride",
      label: "gtmLabelOverride"
    };

    expect(
      screen.getByTestId(`contentful-form-section-Test-form-submit-button`)
    ).toHaveAttribute("data-gtm", JSON.stringify(expectedGTMObject));
  });

  it("test handleEmailValidation with incorrect email", () => {
    const specificData: Data = {
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
        <FormSection id={formId} data={specificData} backgroundColor="white" />
      </ThemeProvider>
    );

    // eslint-disable-next-line testing-library/no-container,testing-library/no-node-access -- can't set test ID on text field
    const emailInput = container.querySelector(`input[id="email"]`);
    fireEvent.change(emailInput!, {
      target: { value: "test-email" }
    });
    fireEvent.blur(emailInput!);
    expect(container).toMatchSnapshot();
  });

  it("test handleEmailValidation with correct email", () => {
    const specificData: Data = {
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
        <FormSection id={formId} data={specificData} backgroundColor="white" />
      </ThemeProvider>
    );

    // eslint-disable-next-line testing-library/no-container,testing-library/no-node-access -- can't set test ID on text field
    const emailInput = container.querySelector(`input[id="email"]`);
    fireEvent.change(emailInput!, {
      target: { value: "test@gmail.com" }
    });
    fireEvent.blur(emailInput!);
    expect(container).toMatchSnapshot();
  });

  it("test upload input with large file", async () => {
    const specificData: Data = {
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
        <FormSection id={formId} data={specificData} backgroundColor="white" />
      </ThemeProvider>
    );
    const upload = screen.getByTestId(`${formId}-upload`);
    fireEvent.change(upload, {
      target: {
        files: [{ name: "fileName", size: 10485761, type: "pdf" }]
      }
    });
    expect(container).toMatchSnapshot();
  });

  it("test upload input with small file", async () => {
    const specificData: Data = {
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
        <FormSection id={formId} data={specificData} backgroundColor="white" />
      </ThemeProvider>
    );
    const upload = screen.getByTestId(`${formId}-upload`);
    fireEvent.change(upload, {
      target: {
        files: [{ name: "fileName", size: 200, type: "pdf" }]
      }
    });
    expect(container).toMatchSnapshot();
  });

  it("test upload input with no maxSize", () => {
    const specificData: Data = {
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
        <FormSection id={formId} data={specificData} backgroundColor="white" />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("test submit when preview is on", () => {
    jest.spyOn(window, "alert").mockImplementation();
    render(
      <ThemeProvider>
        <ConfigProvider configOverride={{ isPreviewMode: true }}>
          <FormSection
            id={formId}
            data={data}
            backgroundColor="white"
            data-testid={"test-form"}
          />
        </ConfigProvider>
      </ThemeProvider>
    );
    fireEvent.submit(screen.getByTestId("test-form"));
    expect(window.alert).toHaveBeenCalledWith(
      "You cannot submit a form on a preview environment."
    );
  });

  it("test submit form with redirect url", async () => {
    const specificData: Data = {
      ...data,
      inputs: [
        {
          label: "Text",
          name: "text",
          type: "text"
        }
      ]
    };
    const pushMock = jest.fn();
    jest.mock("next/router", () => ({
      useRouter: jest.fn().mockImplementation(() => ({
        push: (route: string, options?: string) => pushMock(route, options)
      }))
    }));
    fetchMock.mockResolvedValueOnce({ ok: true });
    const { container } = render(
      <ConfigProvider
        configOverride={{
          gcpFormSubmitEndpoint: "GATSBY_GCP_FORM_SUBMIT_ENDPOINT"
        }}
      >
        <MockSiteContext>
          <FormSection
            id={formId}
            data={specificData}
            backgroundColor="white"
            onSuccess={onSuccess}
            data-testid={"test-form"}
          />
        </MockSiteContext>
      </ConfigProvider>
    );

    // eslint-disable-next-line testing-library/no-container,testing-library/no-node-access -- can't set test ID on text field
    const textInput = container.querySelector(`input[id="text"]`);
    fireEvent.change(textInput!, {
      target: { value: "text value" }
    });
    fireEvent.submit(screen.getByTestId("test-form"));

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
            "Content-Type": "application/json",
            authorization: undefined
          }
        }
      )
    );

    expect(onSuccess).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith("link-to-page");
  });

  it("test submit form with redirect url without recaptcha call", async () => {
    const mockedWindowDocumentCookie = jest.spyOn(
      window.document,
      "cookie",
      "get"
    );
    const qaAuthToken = "qaAuthToken";
    mockedWindowDocumentCookie.mockReturnValueOnce(
      `qaAuthToken=${qaAuthToken}`
    );
    const specificData: Data = {
      ...data,
      inputs: [
        {
          label: "Text",
          name: "text",
          type: "text"
        }
      ]
    };
    fetchMock.mockResolvedValueOnce({ ok: true });

    const pushMock = jest.fn();
    jest.mock("next/router", () => ({
      useRouter: jest.fn().mockImplementation(() => ({
        push: (route: string, options?: string) => pushMock(route, options)
      }))
    }));

    const { container } = render(
      <ConfigProvider
        configOverride={{
          gcpFormSubmitEndpoint: "GATSBY_GCP_FORM_SUBMIT_ENDPOINT"
        }}
      >
        <MockSiteContext>
          <FormSection
            id={formId}
            data={specificData}
            backgroundColor="white"
            onSuccess={onSuccess}
            data-testid={"test-form"}
          />
        </MockSiteContext>
      </ConfigProvider>
    );

    // eslint-disable-next-line testing-library/no-container,testing-library/no-node-access -- can't set test ID on text field
    const textInput = container.querySelector(`input[name="text"]`);
    fireEvent.change(textInput!, {
      target: { value: "text value" }
    });
    fireEvent.submit(screen.getByTestId("test-form"));

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
            "X-Recaptcha-Token": undefined,
            "Content-Type": "application/json",
            authorization: `Bearer ${qaAuthToken}`
          }
        }
      )
    );

    expect(onSuccess).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith("link-to-page");
    expect(mockExecutRecaptcha).not.toHaveBeenCalled();
  });

  it("test submit form with no redirect url", async () => {
    const specificData: Data = {
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
    fetchMock.mockResolvedValueOnce({ ok: true });
    const pushMock = jest.fn();
    jest.mock("next/router", () => ({
      useRouter: jest.fn().mockImplementation(() => ({
        push: (route: string, options?: string) => pushMock(route, options)
      }))
    }));

    const { container } = render(
      <ConfigProvider
        configOverride={{
          gcpFormSubmitEndpoint: "GATSBY_GCP_FORM_SUBMIT_ENDPOINT"
        }}
      >
        <MockSiteContext>
          <FormSection
            id={formId}
            data={specificData}
            backgroundColor="white"
            onSuccess={jest.fn()}
            data-testid={"test-form"}
          />
        </MockSiteContext>
      </ConfigProvider>
    );

    // eslint-disable-next-line testing-library/no-container,testing-library/no-node-access -- can't set test ID on text field
    const textInput = container.querySelector(`input[id="text"]`);
    fireEvent.change(textInput!, {
      target: { value: "text value" }
    });
    fireEvent.submit(screen.getByTestId("test-form"));

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
            "Content-Type": "application/json",
            authorization: undefined
          }
        }
      )
    );

    expect(pushMock).toHaveBeenCalledWith("/");
  });

  it("test submit form with no redirect url without recaptcha call", async () => {
    const mockedWindowDocumentCookie = jest.spyOn(
      window.document,
      "cookie",
      "get"
    );
    const qaAuthToken = "qaAuthToken";
    mockedWindowDocumentCookie.mockReturnValueOnce(
      `qaAuthToken=${qaAuthToken}`
    );
    const specificData: Data = {
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
    fetchMock.mockResolvedValueOnce({ ok: true });
    const pushMock = jest.fn();
    jest.mock("next/router", () => ({
      useRouter: jest.fn().mockImplementation(() => ({
        push: (route: string, options?: string) => pushMock(route, options)
      }))
    }));
    const { container } = render(
      <ConfigProvider
        configOverride={{
          gcpFormSubmitEndpoint: "GATSBY_GCP_FORM_SUBMIT_ENDPOINT"
        }}
      >
        <MockSiteContext>
          <FormSection
            id={formId}
            data={specificData}
            backgroundColor="white"
            onSuccess={jest.fn()}
            data-testid={"test-form"}
          />
        </MockSiteContext>
      </ConfigProvider>
    );

    // eslint-disable-next-line testing-library/no-container,testing-library/no-node-access -- can't set test ID on text field
    const textInput = container.querySelector(`input[name="text"]`);
    fireEvent.change(textInput!, {
      target: { value: "text value" }
    });
    fireEvent.submit(screen.getByTestId("test-form"));
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
            "X-Recaptcha-Token": undefined,
            "Content-Type": "application/json",
            authorization: `Bearer ${qaAuthToken}`
          }
        }
      )
    );

    expect(pushMock).toHaveBeenCalledWith("/");
    expect(mockExecutRecaptcha).not.toHaveBeenCalled();
  });

  it("test submit form with error", async () => {
    const specificData: Data = {
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
        <FormSection
          id={formId}
          data={specificData}
          backgroundColor="white"
          data-testid={"test-form"}
        />
      </MockSiteContext>
    );

    // eslint-disable-next-line testing-library/no-container,testing-library/no-node-access -- can't set test ID on text field
    const textInput = container.querySelector(`input[id="text"]`);
    fireEvent.change(textInput!, {
      target: { value: "text value" }
    });
    fireEvent.submit(screen.getByTestId("test-form"));

    fetchMock.mockRejectedValueOnce(new Error("Async error"));
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    expect(consoleSpy).toHaveBeenCalled();
  });

  it("test convertMarkdownLinksToAnchorLinks function with no label", () => {
    const specificData: Data = {
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
        <FormSection id={formId} data={specificData} backgroundColor="white" />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("test convertMarkdownLinksToAnchorLinks function with link in label", () => {
    const specificData: Data = {
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
            "I agree with BMI's [Another Data Protection Policy](https://www.bmigroup.com)",
          name: "checkbox-wih-link",
          type: "checkbox"
        }
      ]
    };
    const { container } = render(
      <ThemeProvider>
        <FormSection id={formId} data={specificData} backgroundColor="white" />
      </ThemeProvider>
    );
    const externalLink = screen.getByTestId(
      "label-Data-Protection-Policy-anchor-link"
    );
    const internalLink = screen.getByTestId(
      "label-Another-Data-Protection-Policy-anchor-link"
    );
    expect(externalLink).toHaveAttribute("href", "https://google.co.uk");
    expect(externalLink).toHaveAttribute("rel", "noreferrer");
    expect(externalLink).toHaveAttribute("referrerpolicy", "no-referrer");
    expect(internalLink).toHaveAttribute("href", "https://www.bmigroup.com");
    expect(internalLink).not.toHaveAttribute("rel");
    expect(internalLink).not.toHaveAttribute("referrerpolicy");
    expect(container).toMatchSnapshot();
  });

  it("test options in a Select", () => {
    const specificData: InputType[] = [
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
    const select = screen.getByRole("combobox");
    fireEvent.mouseDown(select);

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent("MC: form.none.selection");
    expect(options[1]).toHaveTextContent("Option1");
  });

  it("test multiply options in a checkbox group", async () => {
    const specificData: InputType[] = [
      {
        label: "Pizza",
        name: "pizza",
        options: "Parma, Caprize, Margarita",
        type: "checkboxGroup"
      }
    ];

    const { container } = render(
      <ConfigProvider
        configOverride={{
          gcpFormSubmitEndpoint: "GATSBY_GCP_FORM_SUBMIT_ENDPOINT"
        }}
      >
        <MockSiteContext>
          <FormSection
            id={formId}
            data={{ ...data, inputs: specificData }}
            backgroundColor="white"
            onSuccess={jest.fn()}
            data-testid={"test-form"}
          />
        </MockSiteContext>
      </ConfigProvider>
    );

    // eslint-disable-next-line testing-library/no-container,testing-library/no-node-access -- can't set test ID on checkbox
    const checkboxes = container.querySelectorAll(`input[type="checkbox"]`);
    expect(container).toMatchSnapshot();
    fireEvent.click(checkboxes[2]);
    fireEvent.click(checkboxes[0]);
    fireEvent.submit(screen.getByTestId("test-form"));
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
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
            "Content-Type": "application/json",
            authorization: undefined
          }
        }
      )
    );
  });

  it("test multiply options in a checkbox group without recaptcha call", async () => {
    const mockedWindowDocumentCookie = jest.spyOn(
      window.document,
      "cookie",
      "get"
    );
    const qaAuthToken = "qaAuthToken";
    mockedWindowDocumentCookie.mockReturnValueOnce(
      `qaAuthToken=${qaAuthToken}`
    );
    const specificData: InputType[] = [
      {
        label: "Pizza",
        name: "pizza",
        options: "Parma, Caprize, Margarita",
        type: "checkboxGroup"
      }
    ];

    const { container } = render(
      <ConfigProvider
        configOverride={{
          gcpFormSubmitEndpoint: "GATSBY_GCP_FORM_SUBMIT_ENDPOINT"
        }}
      >
        <MockSiteContext>
          <FormSection
            id={formId}
            data={{ ...data, inputs: specificData }}
            backgroundColor="white"
            onSuccess={jest.fn()}
            data-testid={"test-form"}
          />
        </MockSiteContext>
      </ConfigProvider>
    );

    // eslint-disable-next-line testing-library/no-container,testing-library/no-node-access -- can't set test ID on checkbox
    const checkboxes = container.querySelectorAll(`input[type="checkbox"]`);
    expect(container).toMatchSnapshot();
    fireEvent.click(checkboxes[2]);
    fireEvent.click(checkboxes[0]);
    fireEvent.submit(screen.getByTestId("test-form"));
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
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
            "X-Recaptcha-Token": undefined,
            "Content-Type": "application/json",
            authorization: `Bearer ${qaAuthToken}`
          }
        }
      )
    );
  });

  describe("Hubspot FormSection component", () => {
    it("renders correctly", () => {
      const { container } = render(
        <ThemeProvider>
          <FormSection id={formId} data={dataHubSpot} backgroundColor="white" />
        </ThemeProvider>
      );

      expect(screen.getByTestId("hubspot-form-Test-form")).toHaveAttribute(
        "id",
        "bmi-hubspot-form-form-1"
      );
      expect(container).toMatchSnapshot();
    });

    it("generates hubspot form id using the title when empty id passed", () => {
      render(
        <ThemeProvider>
          <FormSection id="" data={dataHubSpot} backgroundColor="white" />
        </ThemeProvider>
      );
      expect(screen.getByTestId("hubspot-form-Test-form")).toHaveAttribute(
        "id",
        "bmi-hubspot-form-Test-form"
      );
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
            id={formId}
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
          <FormSection id={formId} data={dataHubSpot} backgroundColor="white" />
        </ThemeProvider>
      );
      expect(container).toMatchSnapshot();
    });
  });

  it("calls onSuccess function", () => {
    render(
      <ThemeProvider>
        <FormSection
          id={formId}
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
          id={formId}
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
          id={formId}
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
        <FormSection
          id="section-1"
          data={dataHubSpot}
          backgroundColor="white"
          isDialog
        />
      </ThemeProvider>
    );
    expect(
      screen.queryByTestId(
        `contentful-form-section-${replaceSpaces(dataHubSpot.title)}`
      )
    ).not.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it("renders HubSpot form with the correct Id if it exists", () => {
    render(
      <ThemeProvider>
        <FormSection
          data={dataHubSpot}
          id="fake-form-id"
          backgroundColor="white"
          isDialog
        />
      </ThemeProvider>
    );

    expect(screen.getByTestId("hubspot-form-Test-form")).toHaveAttribute(
      "id",
      "bmi-hubspot-form-fake-form-id"
    );
  });
});
