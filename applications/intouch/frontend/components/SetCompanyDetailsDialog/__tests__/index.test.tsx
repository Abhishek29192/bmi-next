import React from "react";
import { SetCompanyDetailsDialog } from "..";
import {
  fireEvent,
  renderWithUserProvider,
  screen,
  waitFor,
  createEvent
} from "../../../lib/tests/utils";
import AccountContextWrapper from "../../../lib/tests/fixtures/account";
import MarketContextWrapper from "../../../lib/tests/fixtures/market";

const useGetTierBenefitQuerySpy = jest.fn();
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
          />
        </AccountContextWrapper>
      </MarketContextWrapper>
    );
    expect(baseElement).toMatchSnapshot();
  });

  it("profile picture upload", async () => {
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
          />
        </AccountContextWrapper>
      </MarketContextWrapper>
    );

    await waitFor(() => {
      fireEvent.change(baseElement.querySelector("input[name='photoUpload']"), {
        target: {
          files: [
            new File(["(⌐□_□)"], "chucknorris.png", { type: "image/png" })
          ]
        }
      });
    });
    fireEvent.submit(screen.getByTestId("company-details-form"));
    expect(onSubmitSpy).toHaveBeenCalledTimes(1);
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
          />
        </AccountContextWrapper>
      </MarketContextWrapper>
    );
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
