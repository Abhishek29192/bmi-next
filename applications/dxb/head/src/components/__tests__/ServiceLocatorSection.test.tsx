import React from "react";
import { camelCase } from "lodash";
import { render, fireEvent, act } from "@testing-library/react";
import ServiceLocatorSection, {
  Data as serviceLocatorDataType
} from "../ServiceLocatorSection";
import { serviceTypes } from "../Service";
import createRoofer from "../../__tests__/RooferHelper";

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
        services: [createRoofer()]
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
        services: [createRoofer({ type: [] })]
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
        services: [createRoofer({ type: [serviceTypes[0]] })]
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
        services: [createRoofer({ type: [serviceTypes[0], serviceTypes[0]] })]
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
          createRoofer({ id: "roofer_1", name: "roofer 1" }),
          createRoofer({ id: "roofer_2", name: "roofer 1" })
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
          createRoofer({
            id: "roofer_1",
            name: "roofer 1",
            type: [serviceTypes[0]]
          }),
          createRoofer({
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
          createRoofer({
            entryType: "Branch",
            id: "roofer_1",
            name: "roofer 1",
            type: [serviceTypes[0]],
            fax: "222222"
          }),
          createRoofer({
            entryType: "Branch",
            id: "roofer_2",
            name: "roofer 2",
            type: [serviceTypes[0]]
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
          createRoofer({
            entryType: "Merchant",
            id: "roofer_1",
            name: "roofer 1",
            type: [serviceTypes[0]]
          }),
          createRoofer({
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
          createRoofer({
            entryType: "Merchant",
            id: "roofer_1",
            name: "roofer 1",
            type: [serviceTypes[0]]
          }),
          createRoofer({
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
          createRoofer({
            id: "roofer_1",
            name: "roofer 1",
            type: [serviceTypes[0], serviceTypes[1]]
          }),
          createRoofer({
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
          createRoofer({
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
          createRoofer({
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
      services: [createRoofer({ name: "roofer 1" })]
    };

    const wrapper = render(<ServiceLocatorSection data={data} />);
    const nameInput = wrapper.container.querySelector("#company-autocomplete");

    fireEvent.change(nameInput, { target: { value: "roofer" } });

    expect(wrapper.container.parentElement).toMatchSnapshot();
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
      services: [createRoofer({ name: "r" })]
    };

    const wrapper = render(<ServiceLocatorSection data={data} />);
    const nameInput = wrapper.container.querySelector("#company-autocomplete");

    fireEvent.change(nameInput, { target: { value: "roofer" } });

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
      services: [createRoofer({ name: "roofer 1" })]
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
      services: [createRoofer({ name: "roofer 1" })]
    };

    const wrapper = render(<ServiceLocatorSection data={data} />);
    const rooferButton = wrapper.getByText("roofer 1");
    rooferButton.click();
    rooferButton.click();
    expect(wrapper.container.firstChild).toMatchSnapshot();
  });

  it("filters using chip click", () => {
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
        createRoofer({
          id: "roofer_1",
          name: "roofer 1",
          distance: 10,
          type: [serviceTypes[0]]
        }),
        createRoofer({
          id: "roofer_2",
          name: "roofer 2",
          distance: 5,
          type: [serviceTypes[1]]
        }),
        createRoofer({
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
        createRoofer({
          id: "roofer_1",
          name: "roofer 1",
          type: [serviceTypes[0]]
        }),
        createRoofer({
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
        createRoofer({
          id: "roofer_1",
          name: "roofer 1",
          type: [serviceTypes[0]]
        }),
        createRoofer({
          id: "roofer_2",
          name: "roofer 2",
          type: [serviceTypes[1]]
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
    chipButton1.click();
    chipButton2.click();
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
        createRoofer({
          id: "roofer_1",
          name: "roofer 1",
          type: [serviceTypes[0]]
        }),
        createRoofer({
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
        createRoofer({
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
        createRoofer({
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
        createRoofer({
          id: "roofer_1",
          name: "roofer 1",
          type: [serviceTypes[0]]
        }),
        createRoofer({
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
