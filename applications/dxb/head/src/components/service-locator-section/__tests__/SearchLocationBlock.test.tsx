import { act, fireEvent, render } from "@testing-library/react";
import GoogleApi from "@bmi-digital/components/google-api";
import React from "react";
import { SearchLocationBlock } from "../components";
import { EntryTypeEnum } from "../../Service";
import "@testing-library/jest-dom";
import { googleMock } from "../__mocks__/google";

afterEach(() => jest.clearAllMocks());

describe("SearchLocationBlock component", () => {
  it("should renders correctly with CircularProgress component if google === undefined", () => {
    const { getByRole } = render(
      <SearchLocationBlock
        sectionType={EntryTypeEnum.ROOFER_TYPE}
        handleAutocompleteOnChange={jest.fn}
        handlePlaceChange={jest.fn}
        options={[]}
        getPosition={jest.fn}
        userPosition={null}
      />
    );
    const autoCompleteField = getByRole("textbox", {
      name: /MC: findARoofer.companyFieldLabel/i
    });
    const circularProgress = getByRole("progressbar");
    const geolocationButton = getByRole("button", {
      name: /MC: findARoofer.geolocationButton/i
    });
    expect(autoCompleteField).toBeInTheDocument();
    expect(circularProgress).toBeInTheDocument();
    expect(geolocationButton).toBeInTheDocument();
  });
  it("should renders autocomplete options list if prop options provided", () => {
    const options = ["test1", "test2", "test3"];
    const testValue = "test2";
    const { getByRole } = render(
      <SearchLocationBlock
        sectionType={EntryTypeEnum.ROOFER_TYPE}
        handleAutocompleteOnChange={jest.fn}
        handlePlaceChange={jest.fn}
        options={["test1", "test2", "test3"]}
        getPosition={jest.fn}
        userPosition={null}
      />
    );
    const autoCompleteField = getByRole("textbox", {
      name: /MC: findARoofer.companyFieldLabel/i
    });
    fireEvent.change(autoCompleteField, { target: { value: testValue } });
    const resultList = getByRole("listbox");
    expect(resultList.childElementCount).toEqual(
      options.filter((item) => item === testValue).length
    );
  });
  it("should renders GoogleAutocomplete if google !== undefined", () => {
    const { getByRole } = render(
      <GoogleApi.Provider value={googleMock}>
        <SearchLocationBlock
          sectionType={EntryTypeEnum.ROOFER_TYPE}
          handleAutocompleteOnChange={jest.fn}
          handlePlaceChange={jest.fn}
          options={[]}
          getPosition={jest.fn}
          userPosition={null}
        />
      </GoogleApi.Provider>
    );
    const googleAutoCompleteField = getByRole("textbox", {
      name: /MC: findARoofer.locationFieldLabel/i
    });
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
    const { getByRole } = render(
      <GoogleApi.Provider value={googleMock}>
        <SearchLocationBlock
          sectionType={EntryTypeEnum.ROOFER_TYPE}
          handleAutocompleteOnChange={jest.fn}
          handlePlaceChange={jest.fn}
          options={[]}
          getPosition={getPosition}
          userPosition={null}
        />
      </GoogleApi.Provider>
    );
    const geolocationButton = getByRole("button", {
      name: `MC: findARoofer.geolocationButton`
    });

    fireEvent.click(geolocationButton);
    expect(getPosition).toHaveBeenCalled();
  });
  it("should render autocomplete input with label merchantNameSearchLabel if sectionType === EntryTypeEnum.MERCHANT_TYPE", () => {
    const sectionType = EntryTypeEnum.MERCHANT_TYPE;
    const { getByRole } = render(
      <SearchLocationBlock
        sectionType={sectionType}
        handleAutocompleteOnChange={jest.fn}
        handlePlaceChange={jest.fn}
        options={["test1", "test2", "test3"]}
        getPosition={jest.fn}
        userPosition={null}
      />
    );
    const autoCompleteField = getByRole("textbox", {
      name: /MC: findARoofer.merchantNameSearchLabel/i
    });
    expect(autoCompleteField).toBeInTheDocument();
  });
});
