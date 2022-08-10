import { render } from "@testing-library/react";
import React from "react";
import GoogleApi, { Google } from "../../google-api/GoogleApi";
import GoogleAutocomplete from "../GoogleAutocomplete";

describe("GoogleAutocomplete component", () => {
  it("loader renders correctly", () => {
    const { container } = render(
      <GoogleApi.Provider value={null}>
        <GoogleAutocomplete id="google-autocomplete-loader-test" />
      </GoogleApi.Provider>
    );
    expect(container).toMatchSnapshot();
  });
  it("invokes APIs and renders correctly", async () => {
    const google = {
      maps: { places: { AutocompleteService: jest.fn() }, Geocoder: jest.fn() }
    };

    const { container } = render(
      <GoogleApi.Provider value={google as unknown as Google}>
        <GoogleAutocomplete id="google-autocomplete-test" />
      </GoogleApi.Provider>
    );
    expect(container).toMatchSnapshot();
    expect(google.maps.places.AutocompleteService.mock.calls).toMatchSnapshot();
    expect(google.maps.Geocoder.mock.calls).toMatchSnapshot();
  });
});