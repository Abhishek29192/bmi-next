import React from "react";
import { SetCompanyDetailsDialog, MAX_FILE_SIZE } from "..";
import {
  fireEvent,
  renderWithUserProvider,
  screen,
  createEvent,
  waitFor
} from "../../../lib/tests/utils";
import AccountContextWrapper from "../../../lib/tests/fixtures/account";
import MarketContextWrapper from "../../../lib/tests/fixtures/market";
import { generateCompany } from "../../../lib/tests/factories/company";
import { generateTierBenefitItem } from "../../../lib/tests/factories/contentful/tierBenefitCollection";
import { generateAccount } from "../../../lib/tests/factories/account";

const useGetTierBenefitQuerySpy = jest.fn().mockImplementation(() => ({
  tierBenefitCollection: {
    items: [
      generateTierBenefitItem({ tier: "T1" }),
      generateTierBenefitItem({ name: "tier benefit T2", tier: "T2" })
    ]
  }
}));
jest.mock("../../../graphql/generated/hooks", () => {
  const original = jest.requireActual("../../../graphql/generated/hooks");
  return {
    ...original,
    useGetTierBenefitQuery: () => ({
      data: useGetTierBenefitQuerySpy()
    })
  };
});
const onSubmitSpy = jest.fn();
jest.mock("../../../context/CompanyPageContext", () => ({
  useCompanyPageContext: jest.fn().mockImplementation(() => ({
    operationTypes: [
      {
        type: "FLAT",
        displayName: "Flat"
      }
    ]
  }))
}));

describe("SetCompanyDetailsDialog component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("render normally", async () => {
    const { baseElement } = renderWithUserProvider(
      <MarketContextWrapper>
        <AccountContextWrapper>
          <SetCompanyDetailsDialog
            title={"title"}
            isOpen={true}
            onCloseClick={() => {}}
            onSubmit={() => {}}
            errorMessage={null}
            loading={false}
            mapsApiKey={null}
            company={{
              ...generateCompany(),
              status: "NEW"
            }}
          />
        </AccountContextWrapper>
      </MarketContextWrapper>
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.queryByText("title")).toBeTruthy();
    expect(
      screen.queryByText("edit_dialog.form.fields.logo.label")
    ).toBeTruthy();
    expect(screen.queryByText("edit_dialog.form.actions.cancel")).toBeFalsy();
  });

  it("show cancel button if edit company", async () => {
    renderWithUserProvider(
      <MarketContextWrapper>
        <AccountContextWrapper>
          <SetCompanyDetailsDialog
            title={"title"}
            isOpen={true}
            onCloseClick={() => {}}
            onSubmit={() => {}}
            errorMessage={null}
            loading={false}
            mapsApiKey={null}
            company={{
              ...generateCompany(),
              status: "ACTIVE"
            }}
          />
        </AccountContextWrapper>
      </MarketContextWrapper>
    );
    expect(screen.queryByText("edit_dialog.form.actions.cancel")).toBeTruthy();
  });

  it("change coordinates", async () => {
    const { baseElement } = renderWithUserProvider(
      <MarketContextWrapper>
        <AccountContextWrapper>
          <SetCompanyDetailsDialog
            title={"title"}
            isOpen={true}
            onCloseClick={() => {}}
            onSubmit={onSubmitSpy}
            errorMessage={null}
            loading={false}
            mapsApiKey={null}
            company={{
              ...generateCompany()
            }}
          />
        </AccountContextWrapper>
      </MarketContextWrapper>
    );
    const form = screen.getByTestId("company-details-form");
    fireEvent.change(
      baseElement.querySelector("input[name='tradingAddress.coordinates.x']"),
      {
        target: {
          value: 1
        }
      }
    );
    fireEvent.submit(form);
    expect(onSubmitSpy).toHaveBeenCalledTimes(1);
  });

  it("change contract status", async () => {
    const { baseElement } = renderWithUserProvider(
      <MarketContextWrapper>
        <AccountContextWrapper>
          <SetCompanyDetailsDialog
            title={"title"}
            isOpen={true}
            onCloseClick={() => {}}
            onSubmit={onSubmitSpy}
            errorMessage={null}
            loading={false}
            mapsApiKey={null}
            company={{
              ...generateCompany()
            }}
          />
        </AccountContextWrapper>
      </MarketContextWrapper>
    );
    const form = screen.getByTestId("company-details-form");
    const status = baseElement.querySelector("input[name='contractStatus']");
    fireEvent.click(status);
    fireEvent.change(baseElement.querySelector("input[name='renewalDate']"), {
      target: { value: "2022-11-30" }
    });
    fireEvent.submit(form);
    expect(onSubmitSpy).toHaveBeenCalledTimes(1);
  });

  it("hide dialog is isopen is false", async () => {
    renderWithUserProvider(
      <MarketContextWrapper>
        <AccountContextWrapper>
          <SetCompanyDetailsDialog
            title={"title"}
            isOpen={false}
            onCloseClick={() => {}}
            onSubmit={() => {}}
            errorMessage={null}
            loading={false}
            mapsApiKey={null}
            company={generateCompany()}
          />
        </AccountContextWrapper>
      </MarketContextWrapper>
    );
    expect(screen.queryByText("title")).toBeFalsy();
  });

  it("prevent submit when pressed enter", async () => {
    renderWithUserProvider(
      <MarketContextWrapper>
        <AccountContextWrapper>
          <SetCompanyDetailsDialog
            title={"title"}
            isOpen={true}
            onCloseClick={() => {}}
            onSubmit={onSubmitSpy}
            errorMessage={null}
            loading={false}
            mapsApiKey={null}
            company={generateCompany()}
          />
        </AccountContextWrapper>
      </MarketContextWrapper>
    );
    const form = screen.getByTestId("company-details-form");
    const keydown = createEvent.keyDown(form, {
      key: "Enter"
    });

    fireEvent(form, keydown);
    expect(keydown.defaultPrevented).toBeTruthy();
    expect(onSubmitSpy).toHaveBeenCalledTimes(0);
  });

  it("should show error message", async () => {
    const errorMessage = "errorMessage";
    renderWithUserProvider(
      <MarketContextWrapper>
        <AccountContextWrapper>
          <SetCompanyDetailsDialog
            title={"title"}
            isOpen={true}
            onCloseClick={() => {}}
            onSubmit={() => {}}
            errorMessage={errorMessage}
            loading={false}
            mapsApiKey={null}
            company={generateCompany()}
          />
        </AccountContextWrapper>
      </MarketContextWrapper>
    );
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("should show contract and renewal fields", async () => {
    renderWithUserProvider(
      <MarketContextWrapper>
        <AccountContextWrapper>
          <SetCompanyDetailsDialog
            title={"title"}
            isOpen={true}
            onCloseClick={() => {}}
            onSubmit={() => {}}
            errorMessage={null}
            loading={false}
            mapsApiKey={null}
            company={generateCompany({
              contractStatus: true,
              renewalDate: "2020-11-04 08:23:58"
            })}
          />
        </AccountContextWrapper>
      </MarketContextWrapper>
    );
    expect(
      screen.queryByText("edit_dialog.sections.contract_status")
    ).toBeTruthy();
  });

  it("do not have a company", async () => {
    const errorMessage = "errorMessage";
    renderWithUserProvider(
      <MarketContextWrapper>
        <AccountContextWrapper>
          <SetCompanyDetailsDialog
            title={"title"}
            isOpen={true}
            onCloseClick={() => {}}
            onSubmit={() => {}}
            errorMessage={errorMessage}
            loading={false}
            mapsApiKey={null}
            company={null}
          />
        </AccountContextWrapper>
      </MarketContextWrapper>
    );
    expect(screen.queryByText("edit_dialog.form.fields.tier")).toBeFalsy();
  });

  it("do not get any Tier Benefit", async () => {
    useGetTierBenefitQuerySpy.mockImplementationOnce(() => null);
    renderWithUserProvider(
      <MarketContextWrapper>
        <AccountContextWrapper>
          <SetCompanyDetailsDialog
            title={"title"}
            isOpen={true}
            onCloseClick={() => {}}
            onSubmit={() => {}}
            errorMessage={null}
            loading={false}
            mapsApiKey={null}
            company={null}
          />
        </AccountContextWrapper>
      </MarketContextWrapper>
    );
    expect(screen.queryByText("edit_dialog.form.fields.tier")).toBeFalsy();
  });

  describe("file upload", () => {
    it("profile picture upload", async () => {
      const file = new File(["(⌐□_□)"], "chucknorris.png", {
        type: "image/png"
      });
      const { baseElement } = renderWithUserProvider(
        <MarketContextWrapper>
          <AccountContextWrapper>
            <SetCompanyDetailsDialog
              title={"title"}
              isOpen={true}
              onCloseClick={() => {}}
              onSubmit={onSubmitSpy}
              errorMessage={null}
              loading={false}
              mapsApiKey={null}
              company={generateCompany()}
            />
          </AccountContextWrapper>
        </MarketContextWrapper>
      );

      await waitFor(() => {
        fireEvent.change(
          baseElement.querySelector("input[name='photoUpload']"),
          {
            target: {
              files: [file]
            }
          }
        );
      });
      fireEvent.submit(await screen.findByTestId("company-details-form"));
      expect(onSubmitSpy.mock.calls[0][0].logoUpload).toBe(file);
    });

    it("file exceeded limit", async () => {
      const file = new File(["(⌐□_□)"], "chucknorris.png", {
        type: "image/png"
      });
      Object.defineProperty(file, "size", {
        value: MAX_FILE_SIZE * 1024 * 1024 + 1
      });
      const { baseElement } = renderWithUserProvider(
        <MarketContextWrapper>
          <AccountContextWrapper>
            <SetCompanyDetailsDialog
              title={"title"}
              isOpen={true}
              onCloseClick={() => {}}
              onSubmit={onSubmitSpy}
              errorMessage={null}
              loading={false}
              mapsApiKey={null}
              company={generateCompany()}
            />
          </AccountContextWrapper>
        </MarketContextWrapper>
      );

      await waitFor(() => {
        fireEvent.change(
          baseElement.querySelector("input[name='photoUpload']"),
          {
            target: {
              files: [file]
            }
          }
        );
      });
      fireEvent.submit(await screen.findByTestId("company-details-form"));
      expect(
        screen.queryByText(
          `edit_dialog.form.fields.logo.fileSizeValidationMessage ${MAX_FILE_SIZE}MB`
        )
      ).toBeTruthy();
    }, 10000);
  });

  it("User cannot editOperations", () => {
    renderWithUserProvider(
      <MarketContextWrapper>
        <AccountContextWrapper account={generateAccount({ role: "INSTALLER" })}>
          <SetCompanyDetailsDialog
            title={"title"}
            isOpen={true}
            onCloseClick={() => {}}
            onSubmit={() => {}}
            errorMessage={null}
            loading={false}
            mapsApiKey={null}
            company={{
              ...generateCompany({
                companyOperationsByCompany: {
                  nodes: [{ operation: "FLAT" }]
                }
              }),
              status: "NEW"
            }}
          />
        </AccountContextWrapper>
      </MarketContextWrapper>
    );

    expect(
      screen.queryByText("edit_dialog.form.fields.operationTypes")
    ).toBeTruthy();
    expect(screen.queryByText("Flat companyOperationsSuffix")).toBeTruthy();
  });
});
