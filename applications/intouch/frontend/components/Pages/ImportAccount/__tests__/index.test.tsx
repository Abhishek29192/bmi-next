import React from "react";
import { waitFor } from "@testing-library/react";
import {
  fireEvent,
  renderWithUserProvider,
  screen
} from "../../../../lib/tests/utils";
import ApolloProvider from "../../../../lib/tests/fixtures/apollo";
import AccountContextWrapper from "../../../../lib/tests/fixtures/account";
import ImportAccount from "../index";
import { generateAccount } from "../../../../lib/tests/factories/account";
import { generateCompany } from "../../../../lib/tests/factories/company";

const mockImport = jest.fn();
const mockImportOnError = jest.fn();
jest.mock("../../../../graphql/generated/hooks", () => ({
  __esModule: true,
  useImportAccountsCompaniesFromCvsMutation: ({ onError }) => {
    mockImportOnError.mockImplementation((data) => onError(data));
    return [mockImport, { loading: false }];
  }
}));

describe("ImportAccount Component", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it("render correctly", () => {
    const { container } = renderWithUserProvider(
      <ApolloProvider>
        <AccountContextWrapper>
          <ImportAccount />
        </AccountContextWrapper>
      </ApolloProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("success on execution dryRun", async () => {
    renderWithUserProvider(
      <ApolloProvider>
        <AccountContextWrapper>
          <ImportAccount />
        </AccountContextWrapper>
      </ApolloProvider>
    );

    const account = generateAccount();

    const company = generateCompany({
      companyMembers: null,
      registeredAddress: null
    });

    const data = {
      importAccountsCompaniesFromCVS: {
        accounts: [account],
        companies: [company],
        auth0Job: [{ id: 1 }]
      }
    };

    const uploadDocument = screen.getByTestId("add-account-documents");
    expect(uploadDocument).toBeTruthy();

    const files = [
      new File([], "en-accounts", { type: "csv" }),
      new File([], "en-companies", { type: "csv" })
    ];
    fireEvent.click(uploadDocument);
    fireEvent.change(uploadDocument, {
      target: {
        files
      }
    });

    mockImport.mockResolvedValueOnce({ data: data });

    const dryRunButton = screen.getByText("dryRun");
    await waitFor(() => {
      dryRunButton.click();
    });

    const alertBanner = screen.getByTestId("alert-banner");
    expect(alertBanner).toBeTruthy();
    expect(mockImport).toBeCalledTimes(1);
  });
  it("success on execution submit", async () => {
    renderWithUserProvider(
      <ApolloProvider>
        <AccountContextWrapper>
          <ImportAccount />
        </AccountContextWrapper>
      </ApolloProvider>
    );

    const account = generateAccount();
    const companyMembers = {
      nodes: [
        {
          account: account
        }
      ]
    };
    const company = generateCompany({
      companyMembers: companyMembers
    });

    const data = {
      importAccountsCompaniesFromCVS: {
        accounts: [account],
        companies: [company],
        auth0Job: [{ id: 1 }]
      }
    };

    const uploadDocument = screen.getByTestId("add-account-documents");
    expect(uploadDocument).toBeTruthy();

    const files = [
      new File([], "en-accounts", { type: "csv" }),
      new File([], "en-companies", { type: "csv" })
    ];
    fireEvent.change(uploadDocument, {
      target: {
        files
      }
    });

    mockImport.mockResolvedValueOnce({ data: data });

    const submitButton = screen.getByText("submit");
    await waitFor(() => {
      submitButton.click();
    });

    const alertBanner = screen.getByTestId("alert-banner");
    expect(alertBanner).toBeTruthy();
    expect(mockImport).toBeCalledTimes(1);
  });

  it("success on execution submit without companyMembers account", async () => {
    renderWithUserProvider(
      <ApolloProvider>
        <AccountContextWrapper>
          <ImportAccount />
        </AccountContextWrapper>
      </ApolloProvider>
    );

    const company = generateCompany({
      companyMembers: {
        nodes: [{ account: null }]
      },
      registeredAddress: {
        firstLine: "firstLine",
        secondLine: "firstLine"
      }
    });

    const data = {
      importAccountsCompaniesFromCVS: {
        accounts: [{ id: 1 }],
        companies: [company],
        auth0Job: [{ id: 1 }]
      }
    };

    const uploadDocument = screen.getByTestId("add-account-documents");
    const files = [
      new File([], "en-accounts", { type: "csv" }),
      new File([], "en-companies", { type: "csv" })
    ];
    fireEvent.change(uploadDocument, {
      target: {
        files
      }
    });
    mockImport.mockResolvedValueOnce({ data: data });
    await waitFor(() => {
      screen.getByText("submit").click();
    });

    expect(mockImport).toBeCalledTimes(1);
  });

  it("negative cases or missing data flow", async () => {
    renderWithUserProvider(
      <ApolloProvider>
        <AccountContextWrapper>
          <ImportAccount />
        </AccountContextWrapper>
      </ApolloProvider>
    );

    const uploadDocument = screen.getByTestId("add-account-documents");

    const data = {
      importAccountsCompaniesFromCVS: {
        accounts: [],
        companies: [],
        auth0Job: []
      }
    };

    const files = [];
    fireEvent.change(uploadDocument, {
      target: {
        files
      }
    });

    mockImport.mockResolvedValueOnce({ data: data });

    const dryRunButton = screen.getByText("dryRun");
    await waitFor(() => {
      dryRunButton.click();
    });
    expect(mockImport).toBeCalledTimes(0);
  });

  it("error on execution", async () => {
    renderWithUserProvider(
      <ApolloProvider>
        <AccountContextWrapper>
          <ImportAccount />
        </AccountContextWrapper>
      </ApolloProvider>
    );

    mockImport.mockRejectedValueOnce(
      mockImportOnError({
        graphQLErrors: [
          {
            message: "error",
            extensions: {
              exception: {
                detail: "Key (email)=(name@mail.me) already exists."
              }
            }
          }
        ]
      })
    );
    expect(mockImportOnError).toBeCalledTimes(1);
  });
  it("error on execution with empty details", async () => {
    renderWithUserProvider(
      <ApolloProvider>
        <AccountContextWrapper>
          <ImportAccount />
        </AccountContextWrapper>
      </ApolloProvider>
    );

    mockImport.mockRejectedValueOnce(
      mockImportOnError({
        graphQLErrors: [
          {
            message: "error"
          }
        ]
      })
    );
    expect(mockImportOnError).toBeCalledTimes(1);
  });
});
