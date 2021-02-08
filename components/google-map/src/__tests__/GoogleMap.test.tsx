import GoogleApi from "@bmi/google-api";
import { render } from "@testing-library/react";
import React from "react";
import GoogleMap from "../";

describe("GoogleMap component", () => {
  it("loader renders correctly", () => {
    const { container } = render(
      <GoogleApi.Provider value={null}>
        <GoogleMap />
      </GoogleApi.Provider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("invokes APIs and renders correctly", () => {
    const google = { maps: { Map: jest.fn() } };

    const { container } = render(
      // @ts-ignore Override typing for mock function override
      <GoogleApi.Provider value={google}>
        <GoogleMap />
      </GoogleApi.Provider>
    );

    expect(container.firstChild).toMatchSnapshot();
    expect(google.maps.Map.mock.calls).toMatchSnapshot();
  });
});
