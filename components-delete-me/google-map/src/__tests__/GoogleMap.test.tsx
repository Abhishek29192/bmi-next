import { GoogleApi } from "@bmi-digital/components";
import { initialize, Map } from "@googlemaps/jest-mocks";
import { render } from "@testing-library/react";
import React from "react";
import GoogleMap from "../";

jest.mock("@googlemaps/markerclusterer");

beforeEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
  initialize();
});

describe("GoogleMap component", () => {
  it("loader renders correctly", () => {
    const { container } = render(
      <GoogleApi.Provider value={null}>
        <GoogleMap />
      </GoogleApi.Provider>
    );
    expect(container).toMatchSnapshot();
  });

  it("invokes APIs and renders correctly", () => {
    const bounds = { north: 90, east: 180, south: 90, west: 180 };
    const centre = { lat: 0, lng: 0 };
    const zoom = 1;
    const { container } = render(
      <GoogleApi.Provider value={global.google}>
        <GoogleMap bounds={bounds} center={centre} zoom={zoom} />
      </GoogleApi.Provider>
    );

    const mockMap = Map.mockInstances[0] as Map;
    expect(container.firstChild).toMatchSnapshot();
    expect(mockMap.fitBounds).toHaveBeenCalledWith(bounds);
    expect(mockMap.panTo).toHaveBeenCalledWith(centre);
    expect(mockMap.setZoom).toHaveBeenCalledWith(zoom);
  });

  it("multiple GoogleMap components instantiates multiple Map objects", () => {
    const bounds = { north: 90, east: 180, south: 90, west: 180 };
    const centre = { lat: 0, lng: 0 };
    const zoom = 1;
    const { container } = render(
      <GoogleApi.Provider value={global.google}>
        <GoogleMap bounds={bounds} center={centre} zoom={zoom} />
        <GoogleMap bounds={bounds} center={centre} zoom={zoom} />
      </GoogleApi.Provider>
    );

    expect(container).toMatchSnapshot();
    expect(Map.mockInstances).toHaveLength(2);
  });
});
