import React from "react";
import { act, fireEvent, render } from "@testing-library/react";
import { LocationProvider } from "@reach/router";
import camelCase from "lodash-es/camelCase";
import ServiceLocatorSection, {
  Data as serviceLocatorDataType
} from "../ServiceLocatorSection";
import {
  rooferTypes,
  branchTypes,
  merchantTypes,
  EntryTypeEnum
} from "../Service";
import createService from "../../__tests__/ServiceHelper";
import { renderWithRouter } from "../../test/renderWithRouter";

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
      type: EntryTypeEnum.ROOFER_TYPE,
      showDefaultResultList: true,
      title: "service locator section",
      label: "Main",
      body: null,
      position: 1,
      centre: null,
      zoom: 8,
      services: null
    };

    const { container } = renderWithRouter(
      <LocationProvider>
        <ServiceLocatorSection data={data} />
      </LocationProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  describe("renders single service", () => {
    it("with No service type", () => {
      const data: serviceLocatorDataType = {
        __typename: "ContentfulServiceLocatorSection",
        type: EntryTypeEnum.ROOFER_TYPE,
        showDefaultResultList: true,
        title: "service locator section",
        label: "Main",
        body: null,
        position: 1,
        centre: null,
        zoom: 8,
        services: [createService()]
      };

      const { container } = renderWithRouter(
        <LocationProvider>
          <ServiceLocatorSection data={data} />
        </LocationProvider>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("with empty service type", () => {
      const data: serviceLocatorDataType = {
        __typename: "ContentfulServiceLocatorSection",
        type: EntryTypeEnum.ROOFER_TYPE,
        showDefaultResultList: true,
        title: "service locator section",
        label: "Main",
        body: null,
        position: 1,
        centre: null,
        zoom: 8,
        services: [createService({ type: [] })]
      };

      const { container } = renderWithRouter(
        <ServiceLocatorSection data={data} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("with single service type", () => {
      const data: serviceLocatorDataType = {
        __typename: "ContentfulServiceLocatorSection",
        type: EntryTypeEnum.ROOFER_TYPE,
        showDefaultResultList: true,
        title: "service locator section",
        label: "Main",
        body: null,
        position: 1,
        centre: null,
        zoom: 8,
        services: [createService({ type: [rooferTypes[0]] })]
      };

      const { container } = renderWithRouter(
        <ServiceLocatorSection data={data} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("with multiple service type", () => {
      const data: serviceLocatorDataType = {
        __typename: "ContentfulServiceLocatorSection",
        type: EntryTypeEnum.ROOFER_TYPE,
        showDefaultResultList: true,
        title: "service locator section",
        label: "Main",
        body: null,
        position: 1,
        centre: null,
        zoom: 8,
        services: [createService({ type: [rooferTypes[0], rooferTypes[0]] })]
      };

      const { container } = renderWithRouter(
        <ServiceLocatorSection data={data} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe("renders multiple services", () => {
    it("with No service type", () => {
      const data: serviceLocatorDataType = {
        __typename: "ContentfulServiceLocatorSection",
        type: EntryTypeEnum.ROOFER_TYPE,
        showDefaultResultList: true,
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

      const { container } = renderWithRouter(
        <ServiceLocatorSection data={data} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("with single service type", () => {
      const data: serviceLocatorDataType = {
        __typename: "ContentfulServiceLocatorSection",
        type: EntryTypeEnum.ROOFER_TYPE,
        showDefaultResultList: true,
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
            type: [rooferTypes[0]]
          }),
          createService({
            id: "roofer_2",
            name: "roofer 2",
            type: [rooferTypes[0]]
          })
        ]
      };

      const { container } = renderWithRouter(
        <ServiceLocatorSection data={data} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("for Branches", () => {
      const data: serviceLocatorDataType = {
        __typename: "ContentfulServiceLocatorSection",
        type: EntryTypeEnum.BRANCH_TYPE,
        showDefaultResultList: true,
        title: "service locator section",
        label: "Main",
        body: null,
        position: 1,
        centre: null,
        zoom: 8,
        services: [
          createService({
            entryType: EntryTypeEnum.BRANCH_TYPE,
            id: "roofer_7",
            name: "roofer 7",
            type: [],
            branchType: [branchTypes[0]],
            fax: "222222"
          }),
          createService({
            entryType: EntryTypeEnum.BRANCH_TYPE,
            id: "roofer_8",
            name: "roofer 8",
            type: [],
            branchType: [branchTypes[1]]
          })
        ]
      };

      const { container } = renderWithRouter(
        <ServiceLocatorSection data={data} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("for Merchant", () => {
      const data: serviceLocatorDataType = {
        __typename: "ContentfulServiceLocatorSection",
        type: EntryTypeEnum.MERCHANT_TYPE,
        showDefaultResultList: true,
        title: "service locator section",
        label: "Main",
        body: null,
        position: 1,
        centre: null,
        zoom: 8,
        services: [
          createService({
            entryType: EntryTypeEnum.MERCHANT_TYPE,
            id: "roofer_7",
            name: "roofer 7",
            type: [],
            branchType: [],
            merchantType: [merchantTypes[0]],
            fax: "222222"
          }),
          createService({
            entryType: EntryTypeEnum.MERCHANT_TYPE,
            id: "roofer_8",
            name: "roofer 8",
            type: [],
            branchType: [],
            merchantType: [merchantTypes[1]]
          })
        ]
      };

      const { container } = renderWithRouter(
        <ServiceLocatorSection data={data} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("for Branches with invalid service type", () => {
      const data: serviceLocatorDataType = {
        __typename: "ContentfulServiceLocatorSection",
        type: EntryTypeEnum.BRANCH_TYPE,
        showDefaultResultList: true,
        title: "service locator section",
        label: "Main",
        body: null,
        position: 1,
        centre: null,
        zoom: 8,
        services: [
          createService({
            entryType: EntryTypeEnum.BRANCH_TYPE,
            id: "roofer_7",
            name: "roofer 7",
            fax: "222222"
          }),
          createService({
            entryType: EntryTypeEnum.BRANCH_TYPE,
            id: "roofer_8",
            name: "roofer 8"
          })
        ]
      };

      const { container } = renderWithRouter(
        <ServiceLocatorSection data={data} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("for Merchant with invalid service type", () => {
      const data: serviceLocatorDataType = {
        __typename: "ContentfulServiceLocatorSection",
        type: EntryTypeEnum.MERCHANT_TYPE,
        showDefaultResultList: true,
        title: "service locator section",
        label: "Main",
        body: null,
        position: 1,
        centre: null,
        zoom: 8,
        services: [
          createService({
            entryType: EntryTypeEnum.MERCHANT_TYPE,
            id: "roofer_7",
            name: "roofer 7",
            fax: "222222"
          }),
          createService({
            entryType: EntryTypeEnum.BRANCH_TYPE,
            id: "roofer_8",
            name: "roofer 8"
          })
        ]
      };

      const { container } = renderWithRouter(
        <ServiceLocatorSection data={data} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("for Merchants", () => {
      const data: serviceLocatorDataType = {
        __typename: "ContentfulServiceLocatorSection",
        type: EntryTypeEnum.MERCHANT_TYPE,
        showDefaultResultList: true,
        title: "service locator section",
        label: "Main",
        body: null,
        position: 1,
        centre: null,
        zoom: 8,
        services: [
          createService({
            entryType: EntryTypeEnum.MERCHANT_TYPE,
            id: "roofer_1",
            name: "roofer 1",
            type: [rooferTypes[0]]
          }),
          createService({
            entryType: EntryTypeEnum.MERCHANT_TYPE,
            id: "roofer_2",
            name: "roofer 2",
            type: [rooferTypes[0]]
          })
        ]
      };

      const { container } = renderWithRouter(
        <ServiceLocatorSection data={data} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("with no fields for invalid type", () => {
      const data: serviceLocatorDataType = {
        __typename: "ContentfulServiceLocatorSection",
        // @ts-expect-error
        type: "Invalid type",
        showDefaultResultList: true,
        title: "service locator section",
        label: "Main",
        body: null,
        position: 1,
        centre: null,
        zoom: 8,
        services: [
          createService({
            entryType: EntryTypeEnum.MERCHANT_TYPE,
            id: "roofer_1",
            name: "roofer 1",
            type: [rooferTypes[0]]
          }),
          createService({
            entryType: EntryTypeEnum.MERCHANT_TYPE,
            id: "roofer_2",
            name: "roofer 2",
            type: [rooferTypes[0]]
          })
        ]
      };

      const { container } = renderWithRouter(
        <ServiceLocatorSection data={data} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("with multiple service type", () => {
      const data: serviceLocatorDataType = {
        __typename: "ContentfulServiceLocatorSection",
        type: EntryTypeEnum.ROOFER_TYPE,
        showDefaultResultList: true,
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
            type: [rooferTypes[0], rooferTypes[1]]
          }),
          createService({
            id: "roofer_2",
            name: "roofer 2",
            type: [rooferTypes[0], rooferTypes[1]]
          })
        ]
      };

      const { container } = renderWithRouter(
        <ServiceLocatorSection data={data} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("with ALL service type", () => {
      const data: serviceLocatorDataType = {
        __typename: "ContentfulServiceLocatorSection",
        type: EntryTypeEnum.ROOFER_TYPE,
        showDefaultResultList: true,
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
              rooferTypes[0],
              rooferTypes[1],
              rooferTypes[2],
              rooferTypes[3],
              rooferTypes[4]
            ]
          }),
          createService({
            id: "roofer_2",
            name: "roofer 2",
            type: [
              rooferTypes[0],
              rooferTypes[1],
              rooferTypes[2],
              rooferTypes[3],
              rooferTypes[4]
            ]
          })
        ]
      };

      const { container } = renderWithRouter(
        <ServiceLocatorSection data={data} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  it("searchs for a service", () => {
    const data: serviceLocatorDataType = {
      __typename: "ContentfulServiceLocatorSection",
      type: EntryTypeEnum.ROOFER_TYPE,
      showDefaultResultList: true,
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

    const wrapper = renderWithRouter(<ServiceLocatorSection data={data} />);
    const nameInput = wrapper.container.querySelector("#company-autocomplete");

    fireEvent.change(nameInput, {
      target: { value: EntryTypeEnum.ROOFER_TYPE }
    });

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
      type: EntryTypeEnum.ROOFER_TYPE,
      showDefaultResultList: true,
      title: "service locator section",
      label: "Main",
      body: null,
      position: 1,
      centre: null,
      zoom: 8,
      services: [createService({ name: "roofer 1" })]
    };

    const wrapper = renderWithRouter(<ServiceLocatorSection data={data} />);
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
      type: EntryTypeEnum.ROOFER_TYPE,
      showDefaultResultList: true,
      title: "service locator section",
      label: "Main",
      body: null,
      position: 1,
      centre: null,
      zoom: 8,
      services: [createService({ name: "roofer 1" })]
    };

    const wrapper = renderWithRouter(<ServiceLocatorSection data={data} />);

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
      type: EntryTypeEnum.ROOFER_TYPE,
      showDefaultResultList: true,
      title: "service locator section",
      label: "Main",
      body: null,
      position: 1,
      centre: null,
      zoom: 8,
      services: [roofer1, roofer2]
    };

    const wrapper = renderWithRouter(<ServiceLocatorSection data={data} />);

    act(() => {
      callMarkerOnClick(roofer2);
    });

    expect(wrapper.container.parentElement).toMatchSnapshot();
  });

  it("selects service", () => {
    const data: serviceLocatorDataType = {
      __typename: "ContentfulServiceLocatorSection",
      type: EntryTypeEnum.ROOFER_TYPE,
      showDefaultResultList: true,
      title: "service locator section",
      label: "Main",
      body: null,
      position: 1,
      centre: null,
      zoom: 8,
      services: [createService({ name: "roofer 1" })]
    };

    const wrapper = renderWithRouter(<ServiceLocatorSection data={data} />);
    const rooferButton = wrapper.getByText("roofer 1");
    rooferButton.click();
    expect(wrapper.container.firstChild).toMatchSnapshot();
  });

  it("selects and unselects service", () => {
    const data: serviceLocatorDataType = {
      __typename: "ContentfulServiceLocatorSection",
      type: EntryTypeEnum.ROOFER_TYPE,
      showDefaultResultList: true,
      title: "service locator section",
      label: "Main",
      body: null,
      position: 1,
      centre: null,
      zoom: 8,
      services: [createService({ name: "roofer 1" })]
    };

    const wrapper = renderWithRouter(<ServiceLocatorSection data={data} />);
    const rooferButton = wrapper.getByText("roofer 1");
    rooferButton.click();
    rooferButton.click();
    expect(wrapper.container.firstChild).toMatchSnapshot();
  });

  it("filters roofers using chip click", () => {
    const data: serviceLocatorDataType = {
      __typename: "ContentfulServiceLocatorSection",
      type: EntryTypeEnum.ROOFER_TYPE,
      showDefaultResultList: true,
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
          type: [rooferTypes[0]]
        }),
        createService({
          id: "roofer_2",
          name: "roofer 2",
          distance: 5,
          type: [rooferTypes[1]]
        }),
        createService({
          id: "roofer_3",
          name: "roofer 3",
          distance: 15,
          type: [null]
        })
      ]
    };

    const wrapper = renderWithRouter(<ServiceLocatorSection data={data} />);
    const chipButton = wrapper.getByRole("button", {
      name: `MC: findARoofer.filters.${camelCase(rooferTypes[0])}`
    });
    chipButton.click();
    expect(wrapper.container.firstChild).toMatchSnapshot();
  });

  it("filters branch using chip click", () => {
    const data: serviceLocatorDataType = {
      __typename: "ContentfulServiceLocatorSection",
      type: EntryTypeEnum.BRANCH_TYPE,
      showDefaultResultList: true,
      title: "service locator section",
      label: "Main",
      body: null,
      position: 1,
      centre: null,
      zoom: 8,
      services: [
        createService({
          entryType: EntryTypeEnum.BRANCH_TYPE,
          id: "roofer_9",
          name: "roofer 9",
          distance: 10,
          branchType: [branchTypes[0]]
        }),
        createService({
          entryType: EntryTypeEnum.BRANCH_TYPE,
          id: "roofer_10",
          name: "roofer 10",
          distance: 5,
          branchType: [branchTypes[1]]
        })
      ]
    };

    const wrapper = renderWithRouter(<ServiceLocatorSection data={data} />);
    const chipButton = wrapper.getByRole("button", {
      name: `MC: findABranch.filters.${camelCase(branchTypes[0])}`
    });
    chipButton.click();
    expect(wrapper.container.firstChild).toMatchSnapshot();
  });

  it("filters merchant using chip click", () => {
    const data: serviceLocatorDataType = {
      __typename: "ContentfulServiceLocatorSection",
      type: EntryTypeEnum.MERCHANT_TYPE,
      showDefaultResultList: true,
      title: "service locator section",
      label: "Main",
      body: null,
      position: 1,
      centre: null,
      zoom: 8,
      services: [
        createService({
          entryType: EntryTypeEnum.MERCHANT_TYPE,
          id: "roofer_9",
          name: "roofer 9",
          distance: 10,
          merchantType: [merchantTypes[0]]
        }),
        createService({
          entryType: EntryTypeEnum.MERCHANT_TYPE,
          id: "roofer_10",
          name: "roofer 10",
          distance: 5,
          merchantType: [merchantTypes[1]]
        })
      ]
    };

    const wrapper = renderWithRouter(<ServiceLocatorSection data={data} />);
    const chipButton = wrapper.getByRole("button", {
      name: `MC: findAMerchant.filters.${camelCase(merchantTypes[0])}`
    });
    chipButton.click();
    expect(wrapper.container.firstChild).toMatchSnapshot();
  });

  it("click and unclick chip", () => {
    const data: serviceLocatorDataType = {
      __typename: "ContentfulServiceLocatorSection",
      type: EntryTypeEnum.ROOFER_TYPE,
      showDefaultResultList: true,
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
          type: [rooferTypes[0]]
        }),
        createService({
          id: "roofer_2",
          name: "roofer 2",
          type: [rooferTypes[1]]
        })
      ]
    };

    const wrapper = renderWithRouter(<ServiceLocatorSection data={data} />);
    const chipButton = wrapper.getByRole("button", {
      name: `MC: findARoofer.filters.${camelCase(rooferTypes[0])}`
    });
    chipButton.click();
    chipButton.click();
    expect(wrapper.queryByText("roofer 1")).toBeTruthy();
  });

  it("click all roofer chips", () => {
    const data: serviceLocatorDataType = {
      __typename: "ContentfulServiceLocatorSection",
      type: EntryTypeEnum.ROOFER_TYPE,
      showDefaultResultList: true,
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
          type: [rooferTypes[0]]
        }),
        createService({
          id: "roofer_2",
          name: "roofer 2",
          type: [rooferTypes[1]]
        }),
        createService({
          id: "roofer_3",
          name: "roofer 3",
          type: [rooferTypes[2]]
        }),
        createService({
          id: "roofer_4",
          name: "roofer 4",
          type: [rooferTypes[3]]
        }),
        createService({
          id: "roofer_5",
          name: "roofer 5",
          type: [rooferTypes[4]]
        })
      ]
    };

    const wrapper = renderWithRouter(<ServiceLocatorSection data={data} />);
    const chipButton1 = wrapper.getByRole("button", {
      name: `MC: findARoofer.filters.${camelCase(rooferTypes[0])}`
    });
    const chipButton2 = wrapper.getByRole("button", {
      name: `MC: findARoofer.filters.${camelCase(rooferTypes[1])}`
    });
    const chipButton3 = wrapper.getByRole("button", {
      name: `MC: findARoofer.filters.${camelCase(rooferTypes[2])}`
    });
    const chipButton4 = wrapper.getByRole("button", {
      name: `MC: findARoofer.filters.${camelCase(rooferTypes[3])}`
    });
    const chipButton5 = wrapper.getByRole("button", {
      name: `MC: findARoofer.filters.${camelCase(rooferTypes[4])}`
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

    const data: serviceLocatorDataType = {
      __typename: "ContentfulServiceLocatorSection",
      type: EntryTypeEnum.ROOFER_TYPE,
      showDefaultResultList: true,
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
          type: [rooferTypes[0]]
        }),
        createService({
          id: "roofer_2",
          name: "roofer 2",
          type: [rooferTypes[1]]
        })
      ]
    };

    const wrapper = renderWithRouter(<ServiceLocatorSection data={data} />, {
      route: "/something/?chip=Pitched+roof"
    });
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
      type: EntryTypeEnum.ROOFER_TYPE,
      showDefaultResultList: true,
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
          type: [rooferTypes[0]]
        })
      ]
    };

    const wrapper = renderWithRouter(<ServiceLocatorSection data={data} />);
    expect(wrapper.container.firstChild).toMatchSnapshot();
  });

  it("can selects all chips by default", () => {
    // Might affect other tests in this file
    Object.defineProperty(global.window, "location", {
      value: {
        search: `?chip=${encodeURIComponent(
          [...rooferTypes, ...branchTypes, ...merchantTypes].join(",")
        )}`
      }
    });

    const data: serviceLocatorDataType = {
      __typename: "ContentfulServiceLocatorSection",
      type: EntryTypeEnum.ROOFER_TYPE,
      showDefaultResultList: true,
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
    expect(wrapper.container.firstChild).toMatchSnapshot();
  });

  it("filters using autocomplete", () => {
    const data: serviceLocatorDataType = {
      __typename: "ContentfulServiceLocatorSection",
      type: EntryTypeEnum.ROOFER_TYPE,
      showDefaultResultList: true,
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
          type: [rooferTypes[0]]
        }),
        createService({
          id: "roofer_2",
          name: "roofer 2",
          type: [rooferTypes[0]]
        })
      ]
    };

    const wrapper = renderWithRouter(<ServiceLocatorSection data={data} />);
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

  it("close button", () => {
    const roofer1 = createService({ name: "roofer 1" });
    const roofer2 = createService({ name: "roofer 2" });

    const data: serviceLocatorDataType = {
      __typename: "ContentfulServiceLocatorSection",
      type: EntryTypeEnum.ROOFER_TYPE,
      showDefaultResultList: true,
      title: "service locator section",
      label: "Main",
      body: null,
      position: 1,
      centre: null,
      zoom: 8,
      services: [roofer1, roofer2]
    };

    const wrapper = renderWithRouter(<ServiceLocatorSection data={data} />);

    act(() => {
      callMarkerOnClick("MC: global.close");
    });
    const closeButton = wrapper.getByLabelText("MC: global.close");
    closeButton.click();

    expect(wrapper.container.firstChild).toMatchSnapshot();
  });

  describe("when showDefaultResultList is false", () => {
    const roofer1 = {
      id: "roofer_1",
      name: "roofer 1",
      type: [rooferTypes[0]]
    };
    const roofer2 = {
      id: "roofer_2",
      name: "roofer 2",
      type: [rooferTypes[1]]
    };

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
      services: [createService(roofer1), createService(roofer2)]
    };

    it("should show result list after searched by name/company", async () => {
      const { queryByText, container, getAllByText, getByTitle } =
        renderWithRouter(<ServiceLocatorSection data={data} />);

      expect(queryByText(roofer1.name)).toBeFalsy();
      expect(queryByText(roofer2.name)).toBeFalsy();

      const input = container.querySelector("#company-autocomplete");

      fireEvent.change(input, { target: { value: roofer1.name } });
      fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

      expect(getAllByText(roofer1.name)).toHaveLength(1);
      expect(queryByText(roofer2.name)).toBeFalsy();

      const clearButton = getByTitle("Clear");

      clearButton.click();

      expect(queryByText(roofer1.name)).toBeTruthy();
      expect(queryByText(roofer2.name)).toBeTruthy();
    });

    it("should show result list after filtered by chip filter", () => {
      const { queryByText, getByRole, getAllByText } = renderWithRouter(
        <ServiceLocatorSection data={data} />
      );

      expect(queryByText(roofer1.name)).toBeFalsy();
      expect(queryByText(roofer2.name)).toBeFalsy();

      const chipButton = getByRole("button", {
        name: `MC: findARoofer.filters.${camelCase(rooferTypes[0])}`
      });

      chipButton.click();

      expect(getAllByText(roofer1.name)).toHaveLength(1);
      expect(queryByText(roofer2.name)).toBeFalsy();
    });

    it("should not render results list panel on page load if selected chips do not exist in query params", () => {
      const wrapper = renderWithRouter(<ServiceLocatorSection data={data} />);
      const text = wrapper.queryByText("MC: findARoofer.listLabel");
      expect(
        wrapper.container.querySelector(".tabs .tab-panel .list")
      ).toBeFalsy();
      expect(text).toBeFalsy();
      expect(wrapper.container.firstChild).toMatchSnapshot();
    });
  });
});
