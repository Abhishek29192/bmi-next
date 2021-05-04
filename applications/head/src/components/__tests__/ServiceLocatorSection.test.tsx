import React from "react";
import { render } from "@testing-library/react";
import ServiceLocatorSection, {
  Data as serviceLocatorDataType
} from "../ServiceLocatorSection";
import { rooferTypes } from "../../components/Roofer";
import createRoofer from "../../__tests__/RooferHelper";

describe("ServiceLocatorSection component", () => {
  it("renders correctly with NO roofer", () => {
    const data: serviceLocatorDataType = {
      __typename: "ContentfulServiceLocatorSection",
      title: "service locator section",
      label: "Main",
      body: null,
      position: 1,
      centre: null,
      zoom: 8,
      roofers: null
    };

    const { container } = render(<ServiceLocatorSection data={data} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  describe("renders single roofer", () => {
    it("with No roofer type", () => {
      const data: serviceLocatorDataType = {
        __typename: "ContentfulServiceLocatorSection",
        title: "service locator section",
        label: "Main",
        body: null,
        position: 1,
        centre: null,
        zoom: 8,
        roofers: [createRoofer()]
      };

      const { container } = render(<ServiceLocatorSection data={data} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it("with single roofer type", () => {
      const data: serviceLocatorDataType = {
        __typename: "ContentfulServiceLocatorSection",
        title: "service locator section",
        label: "Main",
        body: null,
        position: 1,
        centre: null,
        zoom: 8,
        roofers: [createRoofer({ type: [rooferTypes[0]] })]
      };

      const { container } = render(<ServiceLocatorSection data={data} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it("with multiple roofer type", () => {
      const data: serviceLocatorDataType = {
        __typename: "ContentfulServiceLocatorSection",
        title: "service locator section",
        label: "Main",
        body: null,
        position: 1,
        centre: null,
        zoom: 8,
        roofers: [createRoofer({ type: [rooferTypes[0], rooferTypes[0]] })]
      };

      const { container } = render(<ServiceLocatorSection data={data} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe("renders multiple roofers", () => {
    it("with No roofer type", () => {
      const data: serviceLocatorDataType = {
        __typename: "ContentfulServiceLocatorSection",
        title: "service locator section",
        label: "Main",
        body: null,
        position: 1,
        centre: null,
        zoom: 8,
        roofers: [
          createRoofer({ id: "roofer_1", name: "roofer 1" }),
          createRoofer({ id: "roofer_2", name: "roofer 1" })
        ]
      };

      const { container } = render(<ServiceLocatorSection data={data} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it("with single roofer type", () => {
      const data: serviceLocatorDataType = {
        __typename: "ContentfulServiceLocatorSection",
        title: "service locator section",
        label: "Main",
        body: null,
        position: 1,
        centre: null,
        zoom: 8,
        roofers: [
          createRoofer({
            id: "roofer_1",
            name: "roofer 1",
            type: [rooferTypes[0]]
          }),
          createRoofer({
            id: "roofer_2",
            name: "roofer 2",
            type: [rooferTypes[0]]
          })
        ]
      };

      const { container } = render(<ServiceLocatorSection data={data} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it("with multiple roofer type", () => {
      const data: serviceLocatorDataType = {
        __typename: "ContentfulServiceLocatorSection",
        title: "service locator section",
        label: "Main",
        body: null,
        position: 1,
        centre: null,
        zoom: 8,
        roofers: [
          createRoofer({
            id: "roofer_1",
            name: "roofer 1",
            type: [rooferTypes[0], rooferTypes[1]]
          }),
          createRoofer({
            id: "roofer_2",
            name: "roofer 2",
            type: [rooferTypes[0], rooferTypes[1]]
          })
        ]
      };

      const { container } = render(<ServiceLocatorSection data={data} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
