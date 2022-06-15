import React from "react";
import ServiceLocatorSection, {
  Data as serviceLocatorDataType
} from "../index";
import { EntryTypeEnum } from "../../Service";
import createService from "../../../__tests__/helpers/ServiceHelper";
import { renderWithRouter } from "../../../test/renderWithRouter";

jest.mock("@reach/router", () => ({
  ...(jest.requireActual("@reach/router") as Record<string, unknown>),
  useLocation: jest.fn(() => ({
    search: `?chip=Pitched+Roof`
  }))
}));

describe("ServiceLocatorSection resulst list pannel component", () => {
  it("should render results list panel on page load if at list one chip exists in query params", () => {
    const data: serviceLocatorDataType = {
      __typename: "ContentfulServiceLocatorSection",
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
            { __typename: "ContentfulServiceType", name: "Flat Roof" },
            { __typename: "ContentfulServiceType", name: "Pitched Roof" },
            { __typename: "ContentfulServiceType", name: "Flat Roof 1" },
            { __typename: "ContentfulServiceType", name: "Pitched Roof 2" }
          ]
        })
      ]
    };

    const wrapper = renderWithRouter(<ServiceLocatorSection data={data} />);
    const text = wrapper.getByText("MC: findARoofer.listLabel");
    expect(
      wrapper.container.querySelector(".tabs .tab-panel .list")
    ).toBeTruthy();
    expect(text).toBeTruthy();
    expect(wrapper.container).toMatchSnapshot();
  });
});
