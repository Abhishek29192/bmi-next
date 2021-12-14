import GoogleApi from "@bmi/google-api";
import { render } from "@testing-library/react";
import React from "react";
import GoogleMap from "../";
import Map from "./__mocks__/Map";

jest.mock("./__mocks__/Map");
jest.mock("@googlemaps/markerclusterer");

describe("GoogleMap component", () => {
  beforeEach(() => {
    // @ts-ignore
    Map.mockClear();
  });

  it("loader renders correctly", () => {
    const { container } = render(
      <GoogleApi.Provider value={null}>
        <GoogleMap />
      </GoogleApi.Provider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("invokes APIs and renders correctly", () => {
    const google = { maps: { Map } };

    const bounds = { north: 90, east: 180, south: 90, west: 180 };
    const centre = { lat: 0, lng: 0 };
    const zoom = 1;
    const { container } = render(
      // @ts-ignore Ignore for mock function override
      <GoogleApi.Provider value={google}>
        <GoogleMap bounds={bounds} center={centre} zoom={zoom} />
      </GoogleApi.Provider>
    );

    // @ts-ignore
    const mockMapInstance = google.maps.Map.mock.instances[0];

    expect(container.firstChild).toMatchSnapshot();
    expect(Map).toHaveBeenCalledTimes(1);
    expect(mockMapInstance.fitBounds).toHaveBeenCalledWith(bounds);
    expect(mockMapInstance.panTo).toHaveBeenCalledWith(centre);
    expect(mockMapInstance.setZoom).toHaveBeenCalledWith(zoom);
  });
});
