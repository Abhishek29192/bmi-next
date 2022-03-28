import React from "react";
import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { LocationProvider } from "@reach/router";
import { EntryTypeEnum } from "../../Service";
import { Data as ServiceType } from "../../ServiceType";
import createService from "../../../__tests__/ServiceHelper";
import { renderWithRouter } from "../../../test/renderWithRouter";
import ServiceLocatorSection, {
  Data as serviceLocatorDataType
} from "../index";
import { googleMock } from "../__mocks__/google";

let callMarkerOnClick;

jest.mock("@bmi/components", () => {
  const originalModule = jest.requireActual("@bmi/components");

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
  const loadGoogleApi = jest.fn().mockImplementation();
  const computeDistanceBetween = jest.fn().mockImplementation();

  return {
    ...originalModule,
    GoogleMap,
    loadGoogleApi,
    computeDistanceBetween
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
    expect(container).toMatchSnapshot();
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
      expect(container).toMatchSnapshot();
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
        services: [createService()]
      };

      const { container } = renderWithRouter(
        <ServiceLocatorSection data={data} />
      );
      expect(container).toMatchSnapshot();
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
            serviceTypes: [
              { __typename: "ContentfulServiceType", name: "Flat roof" }
            ]
          })
        ]
      };

      const { container } = renderWithRouter(
        <ServiceLocatorSection data={data} />
      );
      expect(container).toMatchSnapshot();
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
            serviceTypes: [
              { __typename: "ContentfulServiceType", name: "Flat roof" },
              { __typename: "ContentfulServiceType", name: "Pitched roof" }
            ]
          })
        ]
      };

      const { container } = renderWithRouter(
        <ServiceLocatorSection data={data} />
      );
      expect(container).toMatchSnapshot();
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
      expect(container).toMatchSnapshot();
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
            serviceTypes: [
              { __typename: "ContentfulServiceType", name: "Flat roof" }
            ]
          }),
          createService({
            id: "roofer_2",
            name: "roofer 2",
            serviceTypes: [
              { __typename: "ContentfulServiceType", name: "Flat roof" }
            ]
          })
        ]
      };

      const { container } = renderWithRouter(
        <ServiceLocatorSection data={data} />
      );
      expect(container).toMatchSnapshot();
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
            serviceTypes: [
              { __typename: "ContentfulServiceType", name: "Country Offices" }
            ],
            fax: "222222"
          }),
          createService({
            entryType: EntryTypeEnum.BRANCH_TYPE,
            id: "roofer_8",
            name: "roofer 8",
            serviceTypes: [
              { __typename: "ContentfulServiceType", name: "Country Offices" }
            ]
          })
        ]
      };

      const { container } = renderWithRouter(
        <ServiceLocatorSection data={data} />
      );
      expect(container).toMatchSnapshot();
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
            serviceTypes: [
              {
                __typename: "ContentfulServiceType",
                name: "BMI Icopal Flat Roof Systems"
              }
            ],
            fax: "222222"
          }),
          createService({
            entryType: EntryTypeEnum.MERCHANT_TYPE,
            id: "roofer_8",
            name: "roofer 8",
            serviceTypes: [
              {
                __typename: "ContentfulServiceType",
                name: "BMI Icopal Flat Roof Systems"
              }
            ]
          })
        ]
      };

      const { container } = renderWithRouter(
        <ServiceLocatorSection data={data} />
      );
      expect(container).toMatchSnapshot();
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
      expect(container).toMatchSnapshot();
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
      expect(container).toMatchSnapshot();
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
            serviceTypes: [
              {
                __typename: "ContentfulServiceType",
                name: "BMI Icopal Flat Roof Systems"
              }
            ]
          }),
          createService({
            entryType: EntryTypeEnum.MERCHANT_TYPE,
            id: "roofer_2",
            name: "roofer 2",
            serviceTypes: [
              {
                __typename: "ContentfulServiceType",
                name: "BMI Icopal Flat Roof Systems"
              }
            ]
          })
        ]
      };

      const { container } = renderWithRouter(
        <ServiceLocatorSection data={data} />
      );
      expect(container).toMatchSnapshot();
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
            serviceTypes: [
              { __typename: "ContentfulServiceType", name: "Flat Roof" },
              { __typename: "ContentfulServiceType", name: "Pitched Roof" }
            ]
          }),
          createService({
            id: "roofer_2",
            name: "roofer 2",
            serviceTypes: [
              { __typename: "ContentfulServiceType", name: "Flat Roof 1" },
              { __typename: "ContentfulServiceType", name: "Pitched Roof 1" }
            ]
          })
        ]
      };

      const { container } = renderWithRouter(
        <ServiceLocatorSection data={data} />
      );
      expect(container).toMatchSnapshot();
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
            serviceTypes: [
              { __typename: "ContentfulServiceType", name: "Flat Roof" },
              { __typename: "ContentfulServiceType", name: "Pitched Roof" },
              { __typename: "ContentfulServiceType", name: "Flat Roof 1" },
              { __typename: "ContentfulServiceType", name: "Pitched Roof 2" }
            ]
          }),
          createService({
            id: "roofer_2",
            name: "roofer 2",
            serviceTypes: [
              { __typename: "ContentfulServiceType", name: "Flat Roof 3" },
              { __typename: "ContentfulServiceType", name: "Pitched Roof 4" },
              { __typename: "ContentfulServiceType", name: "Flat Roof 5" },
              { __typename: "ContentfulServiceType", name: "Pitched Roof 6" }
            ]
          })
        ]
      };

      const { container } = renderWithRouter(
        <ServiceLocatorSection data={data} />
      );
      expect(container).toMatchSnapshot();
    });

    it("sholud execute handlePageChange correctly", () => {
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
        services: [...Array(25)].map((x) =>
          createService({
            name: "test name 1",
            serviceTypes: [
              { __typename: "ContentfulServiceType", name: "Flat Roof 1" }
            ]
          })
        )
      };

      const wrapper = renderWithRouter(<ServiceLocatorSection data={data} />);

      const paginationButton = wrapper.getByRole("button", {
        name: `Go to page 2`
      });

      paginationButton.click();

      const roofersCount = wrapper.getAllByText("test name 1");

      expect(roofersCount).toHaveLength(1);
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

  it("should send analytics event when user interacts with search field and its value not empty", async () => {
    Object.defineProperty(window, "dataLayer", {
      value: [],
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
      services: [
        createService({ name: "roofer 1" }),
        createService({ name: "some other name" })
      ]
    };

    const { container, findByRole } = renderWithRouter(
      <ServiceLocatorSection data={data} />
    );
    const nameInput = container.querySelector("#company-autocomplete");

    fireEvent.change(nameInput, {
      target: { value: EntryTypeEnum.ROOFER_TYPE }
    });
    const optionList = await findByRole("listbox");
    act(() => {
      fireEvent.click(optionList.children[0]);
    });
    expect(global.window["dataLayer"]).toEqual([
      {
        action: "roofer 1",
        event: "dxb.button_click",
        id: "filter-service-locator",
        label: "MC: findARoofer.companyFieldLabel"
      }
    ]);
    delete global.window["dataLayer"];
  });
  it("shouldn't send analytics event when user interacts with search field and its empty", async () => {
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
    Object.defineProperty(window, "dataLayer", {
      value: [],
      configurable: true
    });
    const { container } = renderWithRouter(
      <ServiceLocatorSection data={data} />
    );
    const nameInput = container.querySelector("#company-autocomplete");

    fireEvent.change(nameInput, {
      target: { value: "" }
    });
    fireEvent.keyDown(nameInput, { key: "Enter", code: "Enter" });
    expect(global.window["dataLayer"]).toHaveLength(0);
    delete global.window["dataLayer"];
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
    expect(wrapper.container).toMatchSnapshot();
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
    expect(wrapper.container).toMatchSnapshot();
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
          serviceTypes: [
            { __typename: "ContentfulServiceType", name: "Flat Roof" }
          ]
        }),
        createService({
          id: "roofer_2",
          name: "roofer 2",
          distance: 5,
          serviceTypes: [
            { __typename: "ContentfulServiceType", name: "Pitched Roof" }
          ]
        }),
        createService({
          id: "roofer_3",
          name: "roofer 3",
          distance: 15
        })
      ]
    };

    const wrapper = renderWithRouter(<ServiceLocatorSection data={data} />);
    const chipButton = wrapper.getByRole("button", {
      name: `Flat Roof`
    });
    chipButton.click();
    expect(wrapper.container).toMatchSnapshot();
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
          serviceTypes: [
            { __typename: "ContentfulServiceType", name: "Country Offices" }
          ]
        }),
        createService({
          entryType: EntryTypeEnum.BRANCH_TYPE,
          id: "roofer_10",
          name: "roofer 10",
          distance: 5,
          serviceTypes: [
            { __typename: "ContentfulServiceType", name: "Headquarters" }
          ]
        })
      ]
    };

    const wrapper = renderWithRouter(<ServiceLocatorSection data={data} />);
    const chipButton = wrapper.getByRole("button", {
      name: `Country Offices`
    });
    chipButton.click();
    expect(wrapper.container).toMatchSnapshot();
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
          serviceTypes: [
            {
              __typename: "ContentfulServiceType",
              name: "BMI Icopal Flat Roof Systems"
            }
          ]
        }),
        createService({
          entryType: EntryTypeEnum.MERCHANT_TYPE,
          id: "roofer_10",
          name: "roofer 10",
          distance: 5,
          serviceTypes: [
            { __typename: "ContentfulServiceType", name: "Merchant type 2" }
          ]
        })
      ]
    };

    const wrapper = renderWithRouter(<ServiceLocatorSection data={data} />);
    const chipButton = wrapper.getByRole("button", {
      name: `Merchant type 2`
    });
    chipButton.click();
    expect(wrapper.container).toMatchSnapshot();
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
          serviceTypes: [
            { __typename: "ContentfulServiceType", name: "Flat Roof" }
          ]
        }),
        createService({
          id: "roofer_2",
          name: "roofer 2",
          serviceTypes: [
            { __typename: "ContentfulServiceType", name: "Pitched Roof" }
          ]
        })
      ]
    };

    const wrapper = renderWithRouter(<ServiceLocatorSection data={data} />);
    const chipButton = wrapper.getByRole("button", {
      name: `Flat Roof`
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
          serviceTypes: [
            { __typename: "ContentfulServiceType", name: "Flat Roof 1" }
          ]
        }),
        createService({
          id: "roofer_2",
          name: "roofer 2",
          serviceTypes: [
            { __typename: "ContentfulServiceType", name: "Flat Roof 2" }
          ]
        }),
        createService({
          id: "roofer_3",
          name: "roofer 3",
          serviceTypes: [
            { __typename: "ContentfulServiceType", name: "Flat Roof 3" }
          ]
        }),
        createService({
          id: "roofer_4",
          name: "roofer 4",
          serviceTypes: [
            { __typename: "ContentfulServiceType", name: "Flat Roof 4" }
          ]
        }),
        createService({
          id: "roofer_5",
          name: "roofer 5",
          serviceTypes: [
            { __typename: "ContentfulServiceType", name: "Flat Roof 5" }
          ]
        })
      ]
    };

    const wrapper = renderWithRouter(<ServiceLocatorSection data={data} />);
    const chipButton1 = wrapper.getByRole("button", {
      name: `Flat Roof 1`
    });
    const chipButton2 = wrapper.getByRole("button", {
      name: `Flat Roof 2`
    });
    const chipButton3 = wrapper.getByRole("button", {
      name: `Flat Roof 3`
    });
    const chipButton4 = wrapper.getByRole("button", {
      name: `Flat Roof 4`
    });
    const chipButton5 = wrapper.getByRole("button", {
      name: `Flat Roof 5`
    });
    chipButton1.click();
    chipButton2.click();
    chipButton3.click();
    chipButton4.click();
    chipButton5.click();
    expect(wrapper.container).toMatchSnapshot();
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
          serviceTypes: [
            { __typename: "ContentfulServiceType", name: "Pitched roof" }
          ]
        }),
        createService({
          id: "roofer_2",
          name: "roofer 2",
          serviceTypes: [
            { __typename: "ContentfulServiceType", name: "Flat Roof" }
          ]
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
          serviceTypes: [
            { __typename: "ContentfulServiceType", name: "Flat Roof" }
          ]
        })
      ]
    };

    const wrapper = renderWithRouter(<ServiceLocatorSection data={data} />);
    expect(wrapper.container).toMatchSnapshot();
  });

  it("can selects all chips by default", () => {
    // Might affect other tests in this file
    Object.defineProperty(global.window, "location", {
      value: {
        search: `?chip=${encodeURIComponent(
          [
            "Flat Roof",
            "Pitched Roof",
            "Country Offices",
            "Headquarters",
            "BMI Icopal Merchant 1"
          ].join(",")
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
          serviceTypes: [
            { __typename: "ContentfulServiceType", name: "Flat Roof" },
            { __typename: "ContentfulServiceType", name: "Pitched Roof" },
            { __typename: "ContentfulServiceType", name: "Country Offices" },
            { __typename: "ContentfulServiceType", name: "Headquarters" },
            {
              __typename: "ContentfulServiceType",
              name: "BMI Icopal Merchant 1"
            }
          ]
        })
      ]
    };

    const wrapper = renderWithRouter(<ServiceLocatorSection data={data} />);
    expect(wrapper.container).toMatchSnapshot();
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
          serviceTypes: [
            { __typename: "ContentfulServiceType", name: "Flat Roof" },
            { __typename: "ContentfulServiceType", name: "Pitched Roof" }
          ]
        }),
        createService({
          id: "roofer_2",
          name: "roofer 2",
          serviceTypes: [
            { __typename: "ContentfulServiceType", name: "Flat Roof" },
            { __typename: "ContentfulServiceType", name: "Pitched Roof" }
          ]
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

    expect(wrapper.container).toMatchSnapshot();
  });

  describe("when showDefaultResultList is false", () => {
    const roofer1 = {
      id: "roofer_1",
      name: "roofer 1",
      serviceTypes: [
        { __typename: "ContentfulServiceType", name: "Flat Roof" }
      ] as ServiceType[]
    };
    const roofer2 = {
      id: "roofer_2",
      name: "roofer 2",
      serviceTypes: [
        { __typename: "ContentfulServiceType", name: "Pitched Roof" }
      ] as ServiceType[]
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
        name: `${roofer1.serviceTypes[0].name}`
      });

      chipButton.click();

      expect(getAllByText(roofer1.name)).toHaveLength(1);
      waitFor(() => expect(queryByText(roofer2.name)).toBeFalsy());
    });

    it("should not render results list panel on page load if selected chips do not exist in query params", () => {
      const wrapper = renderWithRouter(<ServiceLocatorSection data={data} />);
      const text = wrapper.queryByText("MC: findARoofer.listLabel");
      expect(
        wrapper.container.querySelector(".tabs .tab-panel .list")
      ).toBeFalsy();
      expect(text).toBeFalsy();
      expect(wrapper.container).toMatchSnapshot();
    });
  });

  describe("with GoogleAutocomplete component", () => {
    beforeEach(() => {
      window.google = googleMock;
    });
    it("should render GoogleAutocomplete component", async () => {
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
        services: null
      };

      const { findByLabelText, container } = renderWithRouter(
        <ServiceLocatorSection data={data} />
      );
      const googleAutoCompleteInput = await findByLabelText(
        "MC: findARoofer.locationFieldLabel"
      );
      expect(googleAutoCompleteInput).toBeDefined();
      expect(container).toMatchSnapshot();
    });
    it("should execute GoogleAutocomplete onChange event when location changed", async () => {
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
          {
            __typename: "ContentfulService",
            id: "beef212f-8cbc-542d-9fd7-d9e5c0d3a467",
            entryType: EntryTypeEnum.ROOFER_TYPE,
            name: "FK Bygg as",
            location: {
              lat: 59.14346,
              lon: 10.27727
            },
            address: "Helgerødveien 130, 3233 Sandefjord, Norway",
            phone: "41102177",
            email: "post@fasade-teknikk.no",
            website: "https://www.fkbygg.no",
            fax: null,
            serviceTypes: [
              { __typename: "ContentfulServiceType", name: "Flat Roof" },
              { __typename: "ContentfulServiceType", name: "Pitched Roof" }
            ],
            certification: null,
            summary: null
          },
          {
            __typename: "ContentfulService",
            id: "c2ebbf9e-d2c1-554f-a12f-6a13f8d87e2c",
            entryType: EntryTypeEnum.ROOFER_TYPE,
            name: "GL Bygg AS",
            location: {
              lat: 60.80971,
              lon: 11.0292
            },
            address: "Lundvegen 8, 2316 Hamar, Norway",
            phone: "91757971",
            email: "ole@glbygg.no",
            website: "https://www.glbygg.no",
            fax: null,
            serviceTypes: [
              { __typename: "ContentfulServiceType", name: "Flachdach system" }
            ],
            certification: null,
            summary:
              "GL Bygg AS har i dag 20 ansatte, 17 tømrere/snekkere, og 2 murere og 1 maler,tapetserer, gulvlegger. Av disse er en byggmester og en murmester. Alle håndverkerne har fagbrev på sine respektive fagområder",
            distance: 22.054402996325027
          },
          {
            __typename: "ContentfulService",
            id: "36e43b38-652a-5f5a-89c2-2d7028f1132c",
            entryType: EntryTypeEnum.ROOFER_TYPE,
            name: "Harviken Bygg AS",
            location: {
              lat: 60.87807,
              lon: 11.54679
            },
            address: "Vindheiavegen 27, 2406 Elverum, Norway",
            phone: "93092064",
            email: "post@harviken-bygg.no",
            website: null,
            fax: null,
            serviceTypes: [
              {
                __typename: "ContentfulServiceType",
                name: "Pitched roof Bitumen roofs"
              }
            ],
            certification: null,
            summary: null,
            distance: 29097.647859248013
          }
        ]
      };
      const { findByRole, container } = renderWithRouter(
        <ServiceLocatorSection data={data} />
      );

      const googleAutoCompleteInput = (await screen.findByRole("textbox", {
        name: "MC: findARoofer.locationFieldLabel"
      })) as HTMLInputElement;
      act(() => {
        fireEvent.change(googleAutoCompleteInput, {
          target: { value: "Lundvegen" }
        });
      });
      await new Promise((r) => setTimeout(r, 2000));
      const optionList = await findByRole("listbox");
      expect(optionList.childElementCount).toBe(5);
      act(() => {
        fireEvent.click(optionList.children[0]);
      });
      expect(googleAutoCompleteInput.value).toBe("Lundvegen, Hamar, Norway");
      expect(container).toMatchSnapshot();
    });
  });
});
