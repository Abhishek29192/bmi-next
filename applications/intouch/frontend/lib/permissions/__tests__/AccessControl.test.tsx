import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import AccessControl from "../AccessControl";
import * as AccountContext from "../../../context/AccountContext";
import { generateAccount } from "../../../lib/tests/factories/account";
import { ROLES } from "../../../lib/constants";

jest.mock("../gates", () => ({
  dataModel: {
    object: {
      SUPER_ADMIN: (_, { hasExtraData }) => !!hasExtraData
    }
  }
}));

afterEach(() => jest.resetAllMocks());

describe("permission/AccessControl", () => {
  const Children = () => (
    <div data-testid="access-control-children">Children</div>
  );
  it("no account", () => {
    jest.spyOn(AccountContext, "useAccountContext").mockReturnValueOnce({
      account: null
    });
    const { container } = render(
      <AccessControl
        dataModel="dataModel"
        action="object"
        extraData={{ hasExtraData: true }}
      >
        <Children />
      </AccessControl>
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("user can access to children", () => {
    jest.spyOn(AccountContext, "useAccountContext").mockReturnValueOnce({
      account: generateAccount({ role: ROLES.SUPER_ADMIN })
    });
    const { getByTestId } = render(
      <AccessControl
        dataModel="dataModel"
        action="object"
        extraData={{ hasExtraData: true }}
      >
        <Children />
      </AccessControl>
    );

    expect(getByTestId("access-control-children")).toBeTruthy();
  });

  describe("user cannot access to children", () => {
    it("has fallbackView", () => {
      jest.spyOn(AccountContext, "useAccountContext").mockReturnValueOnce({
        account: generateAccount({ role: ROLES.SUPER_ADMIN })
      });
      const FallbackView = () => (
        <div data-testid="fallbackView">fallbackView</div>
      );
      const { getByTestId } = render(
        <AccessControl
          dataModel="dataModel"
          action="undefined"
          extraData={{ hasExtraData: true }}
          fallbackView={<FallbackView />}
        >
          <Children />
        </AccessControl>
      );

      expect(getByTestId("fallbackView")).toBeTruthy();
    });

    it("has no fallbackView but has message", () => {
      jest.spyOn(AccountContext, "useAccountContext").mockReturnValueOnce({
        account: generateAccount({ role: ROLES.SUPER_ADMIN })
      });
      const message = "test message";
      const { getByText } = render(
        <AccessControl
          dataModel="dataModel"
          action="undefined"
          extraData={{ hasExtraData: true }}
          message={message}
        >
          <Children />
        </AccessControl>
      );

      expect(getByText(message)).toBeTruthy();
    });

    it("has no fallbackView and no message", () => {
      jest.spyOn(AccountContext, "useAccountContext").mockReturnValueOnce({
        account: generateAccount({ role: ROLES.SUPER_ADMIN })
      });
      const { container } = render(
        <AccessControl
          dataModel="dataModel"
          action="undefined"
          extraData={{ hasExtraData: true }}
        >
          <Children />
        </AccessControl>
      );

      expect(container).toBeEmptyDOMElement();
    });
  });
});
