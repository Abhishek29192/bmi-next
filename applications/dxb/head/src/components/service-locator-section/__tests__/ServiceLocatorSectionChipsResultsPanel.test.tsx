import React from "react";
import ServiceLocatorSection, {
  Data as serviceLocatorDataType
} from "../index";
import {
  rooferTypes,
  branchTypes,
  merchantTypes,
  EntryTypeEnum
} from "../../Service";
import createService from "../../../__tests__/ServiceHelper";
import { renderWithRouter } from "../../../test/renderWithRouter";

jest.mock("@reach/router", () => ({
  ...(jest.requireActual("@reach/router") as {}),
  useLocation: jest.fn(() => ({
    search: `?chip=${rooferTypes[0]}`
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
          type: [...rooferTypes],
          branchType: [...branchTypes],
          merchantType: [...merchantTypes]
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
