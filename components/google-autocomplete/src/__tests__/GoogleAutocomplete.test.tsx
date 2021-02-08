import GoogleApi from "@bmi/google-api";
import { render } from "@testing-library/react";
import React from "react";
import GoogleAutocomplete from "../";

describe("GoogleAutocomplete component", () => {
  it("loader renders correctly", () => {
    const { container } = render(
      <GoogleApi.Provider value={null}>
        <GoogleAutocomplete id="google-autocomplete-loader-test" />
      </GoogleApi.Provider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("invokes APIs and renders correctly", async () => {
    const google = {
      maps: { places: { AutocompleteService: jest.fn() }, Geocoder: jest.fn() }
    };

    const { container } = render(
      // @ts-ignore Override typing for mock function override
      <GoogleApi.Provider value={google}>
        <GoogleAutocomplete id="google-autocomplete-test" />
      </GoogleApi.Provider>
    );
    expect(container.firstChild).toMatchSnapshot();
    expect(google.maps.places.AutocompleteService.mock.calls).toMatchSnapshot();
    expect(google.maps.Geocoder.mock.calls).toMatchSnapshot();
  });
});
