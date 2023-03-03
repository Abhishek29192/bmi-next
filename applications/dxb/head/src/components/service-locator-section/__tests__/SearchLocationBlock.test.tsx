import { GoogleApi, ThemeProvider } from "@bmi-digital/components";
import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { SearchLocationBlock } from "../components";
import { googleMock } from "../__mocks__/google";

afterEach(() => jest.clearAllMocks());

describe("SearchLocationBlock component", () => {
  it("should renders correctly with CircularProgress component if google === undefined", () => {
    render(
      <ThemeProvider>
        <SearchLocationBlock
          autocompleteLabel={"MC: findARoofer.companyFieldLabel"}
          handleAutocompleteOnChange={jest.fn}
          handlePlaceChange={jest.fn}
          options={[]}
          getPosition={jest.fn}
          userPosition={null}
        />
      </ThemeProvider>
    );
    const autoCompleteField = screen.getByLabelText(
      "MC: findARoofer.companyFieldLabel"
    );
    const circularProgress = screen.getByRole("progressbar");
    const geolocationButton = screen.getByRole("button", {
      name: /MC: findARoofer.geolocationButton/i
    });
    expect(autoCompleteField).toBeInTheDocument();
    expect(circularProgress).toBeInTheDocument();
    expect(geolocationButton).toBeInTheDocument();
  });
  it("should renders autocomplete options list if prop options provided", () => {
    const options = ["test1", "test2", "test3"];
    const testValue = "test2";
    render(
      <ThemeProvider>
        <SearchLocationBlock
          autocompleteLabel={"MC: findARoofer.companyFieldLabel"}
          handleAutocompleteOnChange={jest.fn}
          handlePlaceChange={jest.fn}
          options={["test1", "test2", "test3"]}
          getPosition={jest.fn}
          userPosition={null}
        />
      </ThemeProvider>
    );
    const autoCompleteField = screen.getByLabelText(
      "MC: findARoofer.companyFieldLabel"
    );
    fireEvent.change(autoCompleteField, { target: { value: testValue } });
    const resultList = screen.getByRole("listbox");
    // eslint-disable-next-line testing-library/no-node-access
    expect(resultList.childElementCount).toEqual(
      options.filter((item) => item === testValue).length
    );
  });
  it("should renders GoogleAutocomplete if google !== undefined", () => {
    render(
      <ThemeProvider>
        <GoogleApi.Provider value={googleMock}>
          <SearchLocationBlock
            autocompleteLabel={"MC: findARoofer.companyFieldLabel"}
            handleAutocompleteOnChange={jest.fn}
            handlePlaceChange={jest.fn}
            options={[]}
            getPosition={jest.fn}
            userPosition={null}
          />
        </GoogleApi.Provider>
      </ThemeProvider>
    );
    const googleAutoCompleteField = screen.getByLabelText(
      "MC: findARoofer.locationFieldLabel"
    );
    expect(googleAutoCompleteField).toBeInTheDocument();
  });
  it("should sets current location", () => {
    Object.defineProperty(global.navigator, "geolocation", {
      value: {
        getCurrentPosition: jest.fn().mockImplementation((success) =>
          act(() =>
            success({
              coords: {
                latitude: 50.0318143,
                longitude: 36.2084215
              }
            })
          )
        )
      },
      configurable: true
    });
    const getPosition = jest.fn();
    render(
      <ThemeProvider>
        <GoogleApi.Provider value={googleMock}>
          <SearchLocationBlock
            autocompleteLabel={"MC: findARoofer.companyFieldLabel"}
            handleAutocompleteOnChange={jest.fn}
            handlePlaceChange={jest.fn}
            options={[]}
            getPosition={getPosition}
            userPosition={null}
          />
        </GoogleApi.Provider>
      </ThemeProvider>
    );
    const geolocationButton = screen.getByRole("button", {
      name: `MC: findARoofer.geolocationButton`
    });

    fireEvent.click(geolocationButton);
    expect(getPosition).toHaveBeenCalled();
  });
  it("should render autocomplete input with label merchantNameSearchLabel if sectionType === EntryTypeEnum.MERCHANT_TYPE", () => {
    render(
      <ThemeProvider>
        <SearchLocationBlock
          autocompleteLabel={"MC: findARoofer.merchantNameSearchLabel"}
          handleAutocompleteOnChange={jest.fn}
          handlePlaceChange={jest.fn}
          options={["test1", "test2", "test3"]}
          getPosition={jest.fn}
          userPosition={null}
        />
      </ThemeProvider>
    );
    const autoCompleteField = screen.getByLabelText(
      "MC: findARoofer.merchantNameSearchLabel"
    );
    expect(autoCompleteField).toBeInTheDocument();
  });
});
