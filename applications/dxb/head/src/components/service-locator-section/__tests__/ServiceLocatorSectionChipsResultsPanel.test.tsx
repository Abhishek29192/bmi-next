import ThemeProvider from "@bmi-digital/components/theme-provider";
import { screen } from "@testing-library/react";
import React from "react";
import createService from "../../../__tests__/helpers/ServiceHelper";
import { renderWithRouter } from "../../../test/renderWithRouter";
import { EntryTypeEnum } from "../../Service";
import ServiceLocatorSection, {
  Data as serviceLocatorDataType
} from "../index";

jest.mock("@reach/router", () => ({
  ...(jest.requireActual("@reach/router") as Record<string, unknown>),
  useLocation: jest.fn(() => ({
    search: `?chip=Pitched+Roof`
  }))
}));

describe("ServiceLocatorSection resulst list pannel component", () => {
  it("should render results list panel on page load if at list one chip exists in query params", () => {
    const data: serviceLocatorDataType = {
      __typename: "ServiceLocatorSection",
      type: EntryTypeEnum.ROOFER_TYPE,
      showDefaultResultList: false,
      title: "service locator section",
      label: "Main",
      body: null,
      position: 1,
      centre: null,
      zoom: 8,
      services: [
        createService({
          id: "roofer_1",
          name: "roofer 1",
          serviceTypes: [
            { __typename: "ServiceType", name: "Flat Roof" },
            { __typename: "ServiceType", name: "Pitched Roof" },
            { __typename: "ServiceType", name: "Flat Roof 1" },
            { __typename: "ServiceType", name: "Pitched Roof 2" }
          ]
        })
      ]
    };

    const { container } = renderWithRouter(
      <ThemeProvider>
        <ServiceLocatorSection data={data} />
      </ThemeProvider>
    );
    const text = screen.getByText("MC: findARoofer.listLabel");
    expect(screen.getByTestId("results-list-section")).toBeTruthy();
    expect(text).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
});
