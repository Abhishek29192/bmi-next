import React from "react";
import { camelCase } from "lodash";
import { render, fireEvent, act } from "@testing-library/react";
import ServiceLocatorSection, {
  Data as serviceLocatorDataType
} from "../ServiceLocatorSection";
import { serviceTypes } from "../Service";
import createService from "../../__tests__/ServiceHelper";

let callMarkerOnClick;

jest.mock("@bmi/google-map", () => {
  const GoogleMap = jest
    .fn()
    .mockImplementation(({ children, onMarkerClick }) => {
      callMarkerOnClick = onMarkerClick;
      return (
        <div className="GoogleMap">
          <div className="map"></div>
          {children && <div className="popup">{children}</div>}
        </div>
      );
    });

  return {
    __esModule: true,
    default: GoogleMap
  };
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("ServiceLocatorSection component", () => {
  it("renders correctly with NO service", () => {
    const data: serviceLocatorDataType = {
      __typename: "ContentfulServiceLocatorSection",
      type: "Roofer",
      title: "service locator section",
      label: "Main",
      body: null,
      position: 1,
      centre: null,
      zoom: 8,
      services: null
    };

    const { container } = render(<ServiceLocatorSection data={data} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  describe("renders single service", () => {
    it("with No service type", () => {
      const data: serviceLocatorDataType = {
        __typename: "ContentfulServiceLocatorSection",
        type: "Roofer",
        title: "service locator section",
        label: "Main",
        body: null,
        position: 1,
        centre: null,
        zoom: 8,
        services: [createService()]
      };

      const { container } = render(<ServiceLocatorSection data={data} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it("with empty service type", () => {
      const data: serviceLocatorDataType = {
        __typename: "ContentfulServiceLocatorSection",
        type: "Roofer",
        title: "service locator section",
        label: "Main",
        body: null,
        position: 1,
        centre: null,
        zoom: 8,
        services: [createService({ type: [] })]
      };

      const { container } = render(<ServiceLocatorSection data={data} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it("with single service type", () => {
      const data: serviceLocatorDataType = {
        __typename: "ContentfulServiceLocatorSection",
        type: "Roofer",
        title: "service locator section",
        label: "Main",
        body: null,
        position: 1,
        centre: null,
        zoom: 8,
        services: [createService({ type: [serviceTypes[0]] })]
      };

      const { container } = render(<ServiceLocatorSection data={data} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it("with multiple service type", () => {
      const data: serviceLocatorDataType = {
        __typename: "ContentfulServiceLocatorSection",
        type: "Roofer",
        title: "service locator section",
        label: "Main",
        body: null,
        position: 1,
        centre: null,
        zoom: 8,
        services: [createService({ type: [serviceTypes[0], serviceTypes[0]] })]
      };

      const { container } = render(<ServiceLocatorSection data={data} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe("renders multiple services", () => {
    it("with No service type", () => {
      const data: serviceLocatorDataType = {
        __typename: "ContentfulServiceLocatorSection",
        type: "Roofer",
        title: "service locator section",
        label: "Main",
        body: null,
        position: 1,
        centre: null,
        zoom: 8,
        services: [
          createService({ id: "roofer_1", name: "roofer 1" }),
          createService({ id: "roofer_2", name: "roofer 1" })
        ]
      };

      const { container } = render(<ServiceLocatorSection data={data} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it("with single service type", () => {
      const data: serviceLocatorDataType = {
        __typename: "ContentfulServiceLocatorSection",
        type: "Roofer",
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
            type: [serviceTypes[0]]
          }),
          createService({
            id: "roofer_2",
            name: "roofer 2",
            type: [serviceTypes[0]]
          })
        ]
      };

      const { container } = render(<ServiceLocatorSection data={data} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it("for Branches", () => {
      const data: serviceLocatorDataType = {
        __typename: "ContentfulServiceLocatorSection",
        type: "Branch",
        title: "service locator section",
        label: "Main",
        body: null,
        position: 1,
        centre: null,
        zoom: 8,
        services: [
          createService({
            entryType: "Branch",
            id: "roofer_7",
            name: "roofer 7",
            type: [],
            branchType: [serviceTypes[7]],
            fax: "222222"
          }),
          createService({
            entryType: "Branch",
            id: "roofer_8",
            name: "roofer 8",
            type: [],
            branchType: [serviceTypes[8]]
          })
        ]
      };

      const { container } = render(<ServiceLocatorSection data={data} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it("for Branches with invalid service type", () => {
      const data: serviceLocatorDataType = {
        __typename: "ContentfulServiceLocatorSection",
        type: "Branch",
        title: "service locator section",
        label: "Main",
        body: null,
        position: 1,
        centre: null,
        zoom: 8,
        services: [
          createService({
            entryType: "Branch",
            id: "roofer_7",
            name: "roofer 7",
            fax: "222222"
          }),
          createService({
            entryType: "Branch",
            id: "roofer_8",
            name: "roofer 8"
          })
        ]
      };

      const { container } = render(<ServiceLocatorSection data={data} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it("for Merchants", () => {
      const data: serviceLocatorDataType = {
        __typename: "ContentfulServiceLocatorSection",
        type: "Merchant",
        title: "service locator section",
        label: "Main",
        body: null,
        position: 1,
        centre: null,
        zoom: 8,
        services: [
          createService({
            entryType: "Merchant",
            id: "roofer_1",
            name: "roofer 1",
            type: [serviceTypes[0]]
          }),
          createService({
            entryType: "Merchant",
            id: "roofer_2",
            name: "roofer 2",
            type: [serviceTypes[0]]
          })
        ]
      };

      const { container } = render(<ServiceLocatorSection data={data} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it("with no fields for invalid type", () => {
      const data: serviceLocatorDataType = {
        __typename: "ContentfulServiceLocatorSection",
        // @ts-expect-error
        type: "Invalid type",
        title: "service locator section",
        label: "Main",
        body: null,
        position: 1,
        centre: null,
        zoom: 8,
        services: [
          createService({
            entryType: "Merchant",
            id: "roofer_1",
            name: "roofer 1",
            type: [serviceTypes[0]]
          }),
          createService({
            entryType: "Merchant",
            id: "roofer_2",
            name: "roofer 2",
            type: [serviceTypes[0]]
          })
        ]
      };

      const { container } = render(<ServiceLocatorSection data={data} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it("with multiple service type", () => {
      const data: serviceLocatorDataType = {
        __typename: "ContentfulServiceLocatorSection",
        type: "Roofer",
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
            type: [serviceTypes[0], serviceTypes[1]]
          }),
          createService({
            id: "roofer_2",
            name: "roofer 2",
            type: [serviceTypes[0], serviceTypes[1]]
          })
        ]
      };

      const { container } = render(<ServiceLocatorSection data={data} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it("with ALL service type", () => {
      const data: serviceLocatorDataType = {
        __typename: "ContentfulServiceLocatorSection",
        type: "Roofer",
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
            type: [
              serviceTypes[0],
              serviceTypes[1],
              serviceTypes[2],
              serviceTypes[3],
              serviceTypes[4]
            ]
          }),
          createService({
            id: "roofer_2",
            name: "roofer 2",
            type: [
              serviceTypes[0],
              serviceTypes[1],
              serviceTypes[2],
              serviceTypes[3],
              serviceTypes[4]
            ]
          })
        ]
      };

      const { container } = render(<ServiceLocatorSection data={data} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  it("searchs for a service", () => {
    const data: serviceLocatorDataType = {
      __typename: "ContentfulServiceLocatorSection",
      type: "Roofer",
      title: "service locator section",
      label: "Main",
      body: null,
      position: 1,
      centre: null,
      zoom: 8,
      services: [
        createService({ name: "roofer 1" }),
        createService({ name: "some other name" })
      ]
    };

    const wrapper = render(<ServiceLocatorSection data={data} />);
    const nameInput = wrapper.container.querySelector("#company-autocomplete");

    fireEvent.change(nameInput, { target: { value: "roofer" } });

    expect(wrapper.container.parentElement).toMatchSnapshot(
      "Filtered option list"
    );

    const option0 = wrapper.container.parentElement.querySelector(
      "#company-autocomplete-option-0"
    );

    fireEvent.click(option0);

    expect(wrapper.container.parentElement).toMatchSnapshot(
      "Filtered main list"
    );
  });

  it("doesn't search on entring the first letter", () => {
    const data: serviceLocatorDataType = {
      __typename: "ContentfulServiceLocatorSection",
      type: "Roofer",
      title: "service locator section",
      label: "Main",
      body: null,
      position: 1,
      centre: null,
      zoom: 8,
      services: [createService({ name: "roofer 1" })]
    };

    const wrapper = render(<ServiceLocatorSection data={data} />);
    const nameInput = wrapper.container.querySelector("#company-autocomplete");

    fireEvent.change(nameInput, { target: { value: "r" } });

    expect(wrapper.container.parentElement).toMatchSnapshot();
  });

  it("sets current location", () => {
    Object.defineProperty(global.navigator, "geolocation", {
      value: {
        getCurrentPosition: jest.fn().mockImplementation((success) =>
          act(() =>
            success({
              coords: {
                latitude: 60,
                longitude: 20
              }
            })
          )
        )
      },
      configurable: true
    });

    const data: serviceLocatorDataType = {
      __typename: "ContentfulServiceLocatorSection",
      type: "Roofer",
      title: "service locator section",
      label: "Main",
      body: null,
      position: 1,
      centre: null,
      zoom: 8,
      services: [createService({ name: "roofer 1" })]
    };

    const wrapper = render(<ServiceLocatorSection data={data} />);

    const geolocationButton = wrapper.getByRole("button", {
      name: `MC: findARoofer.geolocationButton`
    });

    fireEvent.click(geolocationButton);

    expect(wrapper.container.parentElement).toMatchSnapshot();

    Object.defineProperty(global.navigator, "geolocation", {
      value: undefined,
      configurable: true
    });
  });

  it("changes selected service with marker click", () => {
    const roofer1 = createService({ name: "roofer 1" });
    const roofer2 = createService({ name: "roofer 2" });

    const data: serviceLocatorDataType = {
      __typename: "ContentfulServiceLocatorSection",
      type: "Roofer",
      title: "service locator section",
      label: "Main",
      body: null,
      position: 1,
      centre: null,
      zoom: 8,
      services: [roofer1, roofer2]
    };

    const wrapper = render(<ServiceLocatorSection data={data} />);

    act(() => {
      callMarkerOnClick(roofer2);
    });

    expect(wrapper.container.parentElement).toMatchSnapshot();
  });

  it("selects service", () => {
    const data: serviceLocatorDataType = {
      __typename: "ContentfulServiceLocatorSection",
      type: "Roofer",
      title: "service locator section",
      label: "Main",
      body: null,
      position: 1,
      centre: null,
      zoom: 8,
      services: [createService({ name: "roofer 1" })]
    };

    const wrapper = render(<ServiceLocatorSection data={data} />);
    const rooferButton = wrapper.getByText("roofer 1");
    rooferButton.click();
    expect(wrapper.container.firstChild).toMatchSnapshot();
  });

  it("selects and unselects service", () => {
    const data: serviceLocatorDataType = {
      __typename: "ContentfulServiceLocatorSection",
      type: "Roofer",
      title: "service locator section",
      label: "Main",
      body: null,
      position: 1,
      centre: null,
      zoom: 8,
      services: [createService({ name: "roofer 1" })]
    };

    const wrapper = render(<ServiceLocatorSection data={data} />);
    const rooferButton = wrapper.getByText("roofer 1");
    rooferButton.click();
    rooferButton.click();
    expect(wrapper.container.firstChild).toMatchSnapshot();
  });

  it("filters roofers using chip click", () => {
    const data: serviceLocatorDataType = {
      __typename: "ContentfulServiceLocatorSection",
      type: "Roofer",
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
          distance: 10,
          type: [serviceTypes[0]]
        }),
        createService({
          id: "roofer_2",
          name: "roofer 2",
          distance: 5,
          type: [serviceTypes[1]]
        }),
        createService({
          id: "roofer_3",
          name: "roofer 3",
          distance: 15,
          type: [null]
        })
      ]
    };

    const wrapper = render(<ServiceLocatorSection data={data} />);
    const chipButton = wrapper.getByRole("button", {
      name: `MC: findARoofer.filters.${camelCase(serviceTypes[0])}`
    });
    chipButton.click();
    expect(wrapper.container.firstChild).toMatchSnapshot();
  });

  it("filters branch using chip click", () => {
    const data: serviceLocatorDataType = {
      __typename: "ContentfulServiceLocatorSection",
      type: "Branch",
      title: "service locator section",
      label: "Main",
      body: null,
      position: 1,
      centre: null,
      zoom: 8,
      services: [
        createService({
          entryType: "Branch",
          id: "roofer_9",
          name: "roofer 9",
          distance: 10,
          branchType: [serviceTypes[6]]
        }),
        createService({
          entryType: "Branch",
          id: "roofer_10",
          name: "roofer 10",
          distance: 5,
          branchType: [serviceTypes[7]]
        })
      ]
    };

    const wrapper = render(<ServiceLocatorSection data={data} />);
    const chipButton = wrapper.getByRole("button", {
      name: `MC: findABranch.filters.${camelCase(serviceTypes[6])}`
    });
    chipButton.click();
    expect(wrapper.container.firstChild).toMatchSnapshot();
  });

  it("click and unclick chip", () => {
    const data: serviceLocatorDataType = {
      __typename: "ContentfulServiceLocatorSection",
      type: "Roofer",
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
          type: [serviceTypes[0]]
        }),
        createService({
          id: "roofer_2",
          name: "roofer 2",
          type: [serviceTypes[1]]
        })
      ]
    };

    const wrapper = render(<ServiceLocatorSection data={data} />);
    const chipButton = wrapper.getByRole("button", {
      name: `MC: findARoofer.filters.${camelCase(serviceTypes[0])}`
    });
    chipButton.click();
    chipButton.click();
    expect(wrapper.queryByText("roofer 1")).toBeTruthy();
  });

  it("click all chips", () => {
    const data: serviceLocatorDataType = {
      __typename: "ContentfulServiceLocatorSection",
      type: "Roofer",
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
          type: [serviceTypes[0]]
        }),
        createService({
          id: "roofer_2",
          name: "roofer 2",
          type: [serviceTypes[1]]
        }),
        createService({
          id: "roofer_3",
          name: "roofer 3",
          type: [serviceTypes[2]]
        }),
        createService({
          id: "roofer_4",
          name: "roofer 4",
          type: [serviceTypes[3]]
        }),
        createService({
          id: "roofer_5",
          name: "roofer 5",
          type: [serviceTypes[4]]
        })
      ]
    };

    const wrapper = render(<ServiceLocatorSection data={data} />);
    const chipButton1 = wrapper.getByRole("button", {
      name: `MC: findARoofer.filters.${camelCase(serviceTypes[0])}`
    });
    const chipButton2 = wrapper.getByRole("button", {
      name: `MC: findARoofer.filters.${camelCase(serviceTypes[1])}`
    });
    const chipButton3 = wrapper.getByRole("button", {
      name: `MC: findARoofer.filters.${camelCase(serviceTypes[2])}`
    });
    const chipButton4 = wrapper.getByRole("button", {
      name: `MC: findARoofer.filters.${camelCase(serviceTypes[3])}`
    });
    const chipButton5 = wrapper.getByRole("button", {
      name: `MC: findARoofer.filters.${camelCase(serviceTypes[4])}`
    });
    chipButton1.click();
    chipButton2.click();
    chipButton3.click();
    chipButton4.click();
    chipButton5.click();
    expect(wrapper.container.firstChild).toMatchSnapshot();
  });

  it("filters using pre selected chips", () => {
    // Might affect other tests in this file
    Object.defineProperty(global.window, "location", {
      value: {
        search: "?chip=Pitched+roof"
      }
    });

    const data: serviceLocatorDataType = {
      __typename: "ContentfulServiceLocatorSection",
      type: "Roofer",
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
          type: [serviceTypes[0]]
        }),
        createService({
          id: "roofer_2",
          name: "roofer 2",
          type: [serviceTypes[1]]
        })
      ]
    };

    const wrapper = render(<ServiceLocatorSection data={data} />);
    expect(wrapper.queryByText("roofer 1")).toBeTruthy();
    expect(wrapper.queryByText("roofer 2")).toBeFalsy();
  });

  it("wrong query string filter", () => {
    // Might affect other tests in this file
    Object.defineProperty(global.window, "location", {
      value: {
        search: "?chip=Non+filter"
      }
    });

    const data: serviceLocatorDataType = {
      __typename: "ContentfulServiceLocatorSection",
      type: "Roofer",
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
          type: [serviceTypes[0]]
        })
      ]
    };

    const wrapper = render(<ServiceLocatorSection data={data} />);
    expect(wrapper.container.firstChild).toMatchSnapshot();
  });

  it("can selects all chips by default", () => {
    // Might affect other tests in this file
    Object.defineProperty(global.window, "location", {
      value: {
        search: `?chip=${encodeURIComponent(serviceTypes.join(","))}`
      }
    });

    const data: serviceLocatorDataType = {
      __typename: "ContentfulServiceLocatorSection",
      type: "Roofer",
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
          type: [...serviceTypes]
        })
      ]
    };

    const wrapper = render(<ServiceLocatorSection data={data} />);
    expect(wrapper.container.firstChild).toMatchSnapshot();
  });

  it("filters using autocomplete", () => {
    const data: serviceLocatorDataType = {
      __typename: "ContentfulServiceLocatorSection",
      type: "Roofer",
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
          type: [serviceTypes[0]]
        }),
        createService({
          id: "roofer_2",
          name: "roofer 2",
          type: [serviceTypes[0]]
        })
      ]
    };

    const wrapper = render(<ServiceLocatorSection data={data} />);
    const input = wrapper.getByLabelText("MC: findARoofer.companyFieldLabel");

    expect(wrapper.getAllByText("roofer 1")).toHaveLength(1);
    expect(wrapper.getAllByText("roofer 2")).toHaveLength(1);

    act(() => {
      fireEvent.change(input, { target: { value: "roofer 1" } });
      fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    });

    expect(wrapper.getAllByText("roofer 1")).toHaveLength(2);
    expect(wrapper.getAllByText("roofer 2")).toHaveLength(1);
  });
});
