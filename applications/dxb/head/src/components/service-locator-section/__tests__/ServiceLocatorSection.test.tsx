import ThemeProvider from "@bmi-digital/components/theme-provider";
import { LocationProvider } from "@reach/router";
import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import mediaQuery from "css-mediaquery";
import React from "react";
import createService from "../../../__tests__/helpers/ServiceHelper";
import { renderWithRouter } from "../../../test/renderWithRouter";
import { EntryTypeEnum } from "../../Service";
import { Data as ServiceType } from "../../ServiceType";
import { googleMock } from "../__mocks__/google";
import ServiceLocatorSection, {
  Data as serviceLocatorDataType
} from "../index";

let callMarkerOnClick;

jest.mock("@bmi-digital/components/google-map", () => {
  const originalModule = jest.requireActual(
    "@bmi-digital/components/google-map"
  );

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
    ...originalModule,
    __esModule: true,
    default: GoogleMap
  };
});

jest.mock("@bmi-digital/components/google-api", () => {
  const originalModule = jest.requireActual(
    "@bmi-digital/components/google-api"
  );

  const computeDistanceBetween = jest.fn().mockImplementation();
  const loadGoogleApi = jest.fn().mockImplementation();

  return {
    ...originalModule,
    __esModule: true,
    computeDistanceBetween,
    loadGoogleApi
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
      <ThemeProvider>
        <LocationProvider>
          <ServiceLocatorSection data={data} />
        </LocationProvider>
      </ThemeProvider>
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
        <ThemeProvider>
          <LocationProvider>
            <ServiceLocatorSection data={data} />
          </LocationProvider>
        </ThemeProvider>
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
        <ThemeProvider>
          <ServiceLocatorSection data={data} />
        </ThemeProvider>
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
        <ThemeProvider>
          <ServiceLocatorSection data={data} />
        </ThemeProvider>
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
        <ThemeProvider>
          <ServiceLocatorSection data={data} />
        </ThemeProvider>
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
        <ThemeProvider>
          <ServiceLocatorSection data={data} />
        </ThemeProvider>
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
        <ThemeProvider>
          <ServiceLocatorSection data={data} />
        </ThemeProvider>
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
        <ThemeProvider>
          <ServiceLocatorSection data={data} />
        </ThemeProvider>
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
        <ThemeProvider>
          <ServiceLocatorSection data={data} />
        </ThemeProvider>
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
        <ThemeProvider>
          <ServiceLocatorSection data={data} />
        </ThemeProvider>
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
        <ThemeProvider>
          <ServiceLocatorSection data={data} />
        </ThemeProvider>
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
        <ThemeProvider>
          <ServiceLocatorSection data={data} />
        </ThemeProvider>
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
        <ThemeProvider>
          <ServiceLocatorSection data={data} />
        </ThemeProvider>
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
        <ThemeProvider>
          <ServiceLocatorSection data={data} />
        </ThemeProvider>
      );
      expect(container).toMatchSnapshot();
    });

    it("should execute handlePageChange correctly", () => {
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
        services: [...Array(25)].map(() =>
          createService({
            name: "test name 1",
            serviceTypes: [
              { __typename: "ContentfulServiceType", name: "Flat Roof 1" }
            ]
          })
        )
      };

      renderWithRouter(
        <ThemeProvider>
          <ServiceLocatorSection data={data} />
        </ThemeProvider>
      );

      const paginationButton = screen.getByRole("button", {
        name: `Go to page 2`
      });

      fireEvent.click(paginationButton);

      const roofersCount = screen.getAllByText("test name 1");

      expect(roofersCount).toHaveLength(1);
    });
  });

  it("searches for a service", () => {
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

    const { baseElement } = renderWithRouter(
      <ThemeProvider>
        <ServiceLocatorSection data={data} />
      </ThemeProvider>
    );
    // eslint-disable-next-line testing-library/no-node-access -- data-testid can't be set
    const nameInput = baseElement.querySelector("#company-autocomplete");

    fireEvent.change(nameInput!, {
      target: { value: EntryTypeEnum.ROOFER_TYPE }
    });

    expect(baseElement).toMatchSnapshot("Filtered option list");

    // eslint-disable-next-line testing-library/no-node-access -- data-testid can't be set
    const option0 = baseElement.querySelector("#company-autocomplete-option-0");

    fireEvent.click(option0!);

    expect(baseElement).toMatchSnapshot("Filtered main list");
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

    const { baseElement } = renderWithRouter(
      <ThemeProvider>
        <ServiceLocatorSection data={data} />
      </ThemeProvider>
    );

    // eslint-disable-next-line testing-library/no-node-access -- data-testid can't be set
    const nameInput = baseElement.querySelector("#company-autocomplete");

    fireEvent.change(nameInput!, { target: { value: "r" } });

    expect(baseElement).toMatchSnapshot();
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

    const { baseElement } = renderWithRouter(
      <ThemeProvider>
        <ServiceLocatorSection data={data} />
      </ThemeProvider>
    );

    // eslint-disable-next-line testing-library/no-node-access -- data-testid can't be set
    const nameInput = baseElement.querySelector("#company-autocomplete");

    fireEvent.change(nameInput!, {
      target: { value: EntryTypeEnum.ROOFER_TYPE }
    });
    const optionList = await screen.findByRole("listbox");
    // eslint-disable-next-line testing-library/no-node-access
    fireEvent.click(optionList.children[0]);
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
    const { baseElement } = renderWithRouter(
      <ThemeProvider>
        <ServiceLocatorSection data={data} />
      </ThemeProvider>
    );

    // eslint-disable-next-line testing-library/no-node-access -- data-testid can't be set
    const nameInput = baseElement.querySelector("#company-autocomplete");

    fireEvent.change(nameInput!, {
      target: { value: "" }
    });
    fireEvent.keyDown(nameInput!, { key: "Enter", code: "Enter" });
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

    const { baseElement } = renderWithRouter(
      <ThemeProvider>
        <ServiceLocatorSection data={data} />
      </ThemeProvider>
    );

    const geolocationButton = screen.getByRole("button", {
      name: `MC: findARoofer.geolocationButton`
    });

    fireEvent.click(geolocationButton);

    expect(baseElement).toMatchSnapshot();

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

    const { baseElement } = renderWithRouter(
      <ThemeProvider>
        <ServiceLocatorSection data={data} />
      </ThemeProvider>
    );

    act(() => {
      callMarkerOnClick(roofer2);
    });

    expect(baseElement).toMatchSnapshot();
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

    const { baseElement } = renderWithRouter(
      <ThemeProvider>
        <ServiceLocatorSection data={data} />
      </ThemeProvider>
    );
    const rooferButton = screen.getByText("roofer 1");
    fireEvent.click(rooferButton);
    expect(baseElement).toMatchSnapshot();
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

    const { baseElement } = renderWithRouter(
      <ThemeProvider>
        <ServiceLocatorSection data={data} />
      </ThemeProvider>
    );
    const rooferButton = screen.getByText("roofer 1");
    fireEvent.click(rooferButton);
    fireEvent.click(rooferButton);
    expect(baseElement).toMatchSnapshot();
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

    const { baseElement } = renderWithRouter(
      <ThemeProvider>
        <ServiceLocatorSection data={data} />
      </ThemeProvider>
    );
    const chipButton = screen.getByRole("button", {
      name: `Flat Roof`
    });
    fireEvent.click(chipButton);
    expect(baseElement).toMatchSnapshot();
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

    const { baseElement } = renderWithRouter(
      <ThemeProvider>
        <ServiceLocatorSection data={data} />
      </ThemeProvider>
    );
    const chipButton = screen.getByRole("button", {
      name: `Country Offices`
    });
    fireEvent.click(chipButton);
    expect(baseElement).toMatchSnapshot();
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

    const { baseElement } = renderWithRouter(
      <ThemeProvider>
        <ServiceLocatorSection data={data} />
      </ThemeProvider>
    );
    const chipButton = screen.getByRole("button", {
      name: `Merchant type 2`
    });
    fireEvent.click(chipButton);
    expect(baseElement).toMatchSnapshot();
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

    renderWithRouter(
      <ThemeProvider>
        <ServiceLocatorSection data={data} />
      </ThemeProvider>
    );
    const chipButton = screen.getByRole("button", {
      name: `Flat Roof`
    });
    fireEvent.click(chipButton);
    fireEvent.click(chipButton);
    expect(screen.getByText("roofer 1")).toBeTruthy();
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

    const { baseElement } = renderWithRouter(
      <ThemeProvider>
        <ServiceLocatorSection data={data} />
      </ThemeProvider>
    );
    const chipButton1 = screen.getByRole("button", {
      name: `Flat Roof 1`
    });
    const chipButton2 = screen.getByRole("button", {
      name: `Flat Roof 2`
    });
    const chipButton3 = screen.getByRole("button", {
      name: `Flat Roof 3`
    });
    const chipButton4 = screen.getByRole("button", {
      name: `Flat Roof 4`
    });
    const chipButton5 = screen.getByRole("button", {
      name: `Flat Roof 5`
    });
    fireEvent.click(chipButton1);
    fireEvent.click(chipButton2);
    fireEvent.click(chipButton3);
    fireEvent.click(chipButton4);
    fireEvent.click(chipButton5);
    expect(baseElement).toMatchSnapshot();
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

    renderWithRouter(
      <ThemeProvider>
        <ServiceLocatorSection data={data} />
      </ThemeProvider>,
      {
        route: "/something/?chip=Pitched+roof"
      }
    );
    expect(screen.getByText("roofer 1")).toBeTruthy();
    expect(screen.queryByText("roofer 2")).toBeFalsy();
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

    const { baseElement } = renderWithRouter(
      <ThemeProvider>
        <ServiceLocatorSection data={data} />
      </ThemeProvider>
    );
    expect(baseElement).toMatchSnapshot();
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

    const { baseElement } = renderWithRouter(
      <ThemeProvider>
        <ServiceLocatorSection data={data} />
      </ThemeProvider>
    );
    expect(baseElement).toMatchSnapshot();
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

    renderWithRouter(
      <ThemeProvider>
        <ServiceLocatorSection data={data} />
      </ThemeProvider>
    );
    const input = screen.getByLabelText("MC: findARoofer.companyFieldLabel");

    expect(screen.getAllByText("roofer 1")).toHaveLength(1);
    expect(screen.getAllByText("roofer 2")).toHaveLength(1);

    fireEvent.change(input, { target: { value: "roofer 1" } });

    expect(screen.getAllByText("roofer 1")).toHaveLength(2);
    expect(screen.getAllByText("roofer 2")).toHaveLength(1);
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

    const { baseElement } = renderWithRouter(
      <ThemeProvider>
        <ServiceLocatorSection data={data} />
      </ThemeProvider>
    );

    act(() => {
      callMarkerOnClick("MC: global.close");
    });
    const closeButton = screen.getByLabelText("MC: global.close");
    fireEvent.click(closeButton);

    expect(baseElement).toMatchSnapshot();
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
      const { baseElement } = renderWithRouter(
        <ThemeProvider>
          <ServiceLocatorSection data={data} />
        </ThemeProvider>
      );

      expect(screen.queryByText(roofer1.name)).toBeFalsy();
      expect(screen.queryByText(roofer2.name)).toBeFalsy();

      // eslint-disable-next-line testing-library/no-node-access -- data-testid can't be set
      const input = baseElement.querySelector("#company-autocomplete");

      fireEvent.change(input!, { target: { value: roofer1.name } });
      fireEvent.keyDown(input!, { key: "Enter", code: "Enter" });

      expect(screen.getAllByText(roofer1.name)).toHaveLength(1);
      expect(screen.queryByText(roofer2.name)).toBeFalsy();

      const clearButton = screen.getByTitle("Clear");

      fireEvent.click(clearButton);

      expect(screen.getByText(roofer1.name)).toBeTruthy();
      expect(screen.getByText(roofer2.name)).toBeTruthy();
    });

    it("should show result list after filtered by chip filter", async () => {
      renderWithRouter(
        <ThemeProvider>
          <ServiceLocatorSection data={data} />
        </ThemeProvider>
      );

      expect(screen.queryByText(roofer1.name)).toBeFalsy();
      expect(screen.queryByText(roofer2.name)).toBeFalsy();

      const chipButton = screen.getByRole("button", {
        name: `${roofer1.serviceTypes[0].name}`
      });

      fireEvent.click(chipButton);

      expect(screen.getAllByText(roofer1.name)).toHaveLength(1);
      await waitFor(() => expect(screen.queryByText(roofer2.name)).toBeFalsy());
    });

    it("should not render results list panel on page load if selected chips do not exist in query params", () => {
      const { baseElement } = renderWithRouter(
        <ThemeProvider>
          <ServiceLocatorSection data={data} />
        </ThemeProvider>
      );
      const text = screen.queryByText("MC: findARoofer.listLabel");
      expect(
        screen.queryByTestId("results-list-section")
      ).not.toBeInTheDocument();
      expect(text).toBeFalsy();
      expect(baseElement).toMatchSnapshot();
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

      const { baseElement } = renderWithRouter(
        <ThemeProvider>
          <ServiceLocatorSection data={data} />
        </ThemeProvider>
      );
      const googleAutoCompleteInput = await screen.findByLabelText(
        "MC: findARoofer.locationFieldLabel"
      );
      expect(googleAutoCompleteInput).toBeDefined();
      expect(baseElement).toMatchSnapshot();
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
          createService({
            id: "beef212f-8cbc-542d-9fd7-d9e5c0d3a467",
            name: "FK Bygg as",
            address: "Helgerødveien 130, 3233 Sandefjord, Norway"
          }),
          createService({
            id: "c2ebbf9e-d2c1-554f-a12f-6a13f8d87e2c",
            name: "GL Bygg AS",
            address: "Lundvegen 8, 2316 Hamar, Norwa"
          }),
          createService({
            id: "36e43b38-652a-5f5a-89c2-2d7028f1132c",
            name: "GL Bygg AS",
            address: "Vindheiavegen 27, 2406 Elverum, Norway"
          })
        ]
      };
      const { baseElement } = renderWithRouter(
        <ThemeProvider>
          <ServiceLocatorSection data={data} />
        </ThemeProvider>
      );

      const googleAutoCompleteInput = (await screen.findByRole("combobox", {
        name: "MC: findARoofer.locationFieldLabel"
      })) as HTMLInputElement;
      fireEvent.change(googleAutoCompleteInput, {
        target: { value: "Lundvegen" }
      });
      await new Promise((r) => setTimeout(r, 2000));
      const optionList = await screen.findByRole("listbox");
      // eslint-disable-next-line testing-library/no-node-access
      expect(optionList.childElementCount).toBe(5);
      // eslint-disable-next-line testing-library/no-node-access
      fireEvent.click(optionList.children[0]);
      expect(googleAutoCompleteInput.value).toBe("Lundvegen, Hamar, Norway");
      expect(baseElement).toMatchSnapshot();
    });
  });
  it("triggers analytics on selected service with marker click", () => {
    const createMatchMedia = (width: unknown) => {
      return (query: string): MediaQueryList =>
        ({
          matches: mediaQuery.match(query, { width }),
          addListener: () => {},
          removeListener: () => {}
        } as unknown as MediaQueryList);
    };
    window.matchMedia = createMatchMedia(1500);
    Object.defineProperty(window, "dataLayer", {
      value: [],
      configurable: true
    });
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

    renderWithRouter(
      <ThemeProvider>
        <ServiceLocatorSection data={data} />
      </ThemeProvider>
    );

    act(() => {
      callMarkerOnClick(roofer2);
    });
    expect(global.window["dataLayer"]).toEqual([
      {
        action: "Expanded company details",
        id: "selector-cards6-map-pin",
        event: "dxb.button_click",
        label: "roofer 2 - address 1 - Roofer - selected"
      }
    ]);
    delete global.window["dataLayer"];
  });
});
