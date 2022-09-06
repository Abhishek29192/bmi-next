import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import GoogleApi, {
  AutocompletePrediction,
  AutocompletionRequest,
  GeocoderRequest,
  GeocoderResult,
  Google
} from "../../google-api/GoogleApi";
import GoogleAutocomplete from "../GoogleAutocomplete";

describe("GoogleAutocomplete component", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

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

  describe("calls onPlaceChange when value is changed", () => {
    it("should call onPlaceChange when value has place_id", async () => {
      const google = getGoogleMock();
      const search = "Diakonveien";
      const onPlaceChange = jest.fn();
      render(
        <GoogleApi.Provider value={google as unknown as Google}>
          <GoogleAutocomplete
            id="google-autocomplete-test"
            onPlaceChange={onPlaceChange}
          />
        </GoogleApi.Provider>
      );

      fireEvent.change(screen.getByRole("textbox"), {
        target: { value: search }
      });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      const option = await screen.findByText(search);

      fireEvent.click(option);

      expect(onPlaceChange).toHaveBeenCalledWith(geocodeStub[0]);
    });
    it("should not call onPlaceChange when value doesn't have place_id", async () => {
      const google = getGoogleMock([{ ...predictionStub[0], place_id: "" }]);
      const search = "Diakonveien";
      const onPlaceChange = jest.fn();
      render(
        <GoogleApi.Provider value={google as unknown as Google}>
          <GoogleAutocomplete
            id="google-autocomplete-test"
            onPlaceChange={onPlaceChange}
          />
        </GoogleApi.Provider>
      );

      fireEvent.change(screen.getByRole("textbox"), {
        target: { value: search }
      });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      const option = await screen.findByText(search);

      fireEvent.click(option);

      expect(onPlaceChange).not.toHaveBeenCalledWith(geocodeStub[0]);
    });
  });

  describe("renders value correctly", () => {
    it("should set value when option is selected", async () => {
      const google = getGoogleMock();
      const search = "Diakonveien";
      render(
        <GoogleApi.Provider value={google as unknown as Google}>
          <GoogleAutocomplete id="google-autocomplete-test" />
        </GoogleApi.Provider>
      );

      fireEvent.change(screen.getByRole("textbox"), {
        target: { value: search }
      });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      const option = await screen.findByText(search);

      fireEvent.click(option);

      expect(screen.getByRole("textbox").getAttribute("value")).toEqual(
        predictionStub[0].description
      );
    });
    it("should display correct value if controlledValue is passed", async () => {
      const google = getGoogleMock();
      const { rerender } = render(
        <GoogleApi.Provider value={google as unknown as Google}>
          <GoogleAutocomplete id="google-autocomplete-test" />
        </GoogleApi.Provider>
      );
      rerender(
        <GoogleApi.Provider value={google as unknown as Google}>
          <GoogleAutocomplete
            id="google-autocomplete-test"
            controlledValue={"Diakonveien 12"}
          />
        </GoogleApi.Provider>
      );
      expect(screen.getByRole("textbox").getAttribute("value")).toEqual(
        geocodeStub[0].formatted_address
      );
    });
  });

  describe("renders options correctly", () => {
    it("options should be empty by default", () => {
      const google = getGoogleMock();

      render(
        <GoogleApi.Provider value={google as unknown as Google}>
          <GoogleAutocomplete id="google-autocomplete-test" />
        </GoogleApi.Provider>
      );

      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
    it("should update options when value change", async () => {
      const google = getGoogleMock();
      const search = "Diakonveien";

      render(
        <GoogleApi.Provider value={google as unknown as Google}>
          <GoogleAutocomplete id="google-autocomplete-test" />
        </GoogleApi.Provider>
      );

      fireEvent.change(screen.getByRole("textbox"), {
        target: { value: search }
      });
      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(await screen.findByText(search)).toBeInTheDocument();
    });
    it("renders correctly when options are null or undefined", async () => {
      const google = getGoogleMock(null as never);
      const search = "Diakonveien";

      render(
        <GoogleApi.Provider value={google as unknown as Google}>
          <GoogleAutocomplete id="google-autocomplete-test" />
        </GoogleApi.Provider>
      );

      fireEvent.change(screen.getByRole("textbox"), {
        target: { value: search }
      });
      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
    it("renders correctly if options are strings", async () => {
      const option = "Diakonveien";
      const google = getGoogleMock([option] as never);

      render(
        <GoogleApi.Provider value={google as unknown as Google}>
          <GoogleAutocomplete id="google-autocomplete-test" />
        </GoogleApi.Provider>
      );

      fireEvent.change(screen.getByRole("textbox"), {
        target: { value: "Di" }
      });
      act(() => {
        jest.advanceTimersByTime(500);
      });

      const options = screen.getAllByRole("option");

      fireEvent.click(options[0]);

      expect(screen.getByRole("textbox").value).toBe(option);
    });
  });
});

const predictionStub = [
  {
    description: "Diakonveien 12, Oslo, Norway",
    matched_substrings: [{ length: 2, offset: 12 }],
    place_id: "ChIJ2_jYgsFtQUYRiJlSWp2g1X0",
    reference: "ChIJ2_jYgsFtQUYRiJlSWp2g1X0",
    structured_formatting: {
      main_text: "Diakonveien 12",
      main_text_matched_substrings: [{ length: 2, offset: 12 }],
      secondary_text: "Oslo, Norway"
    },
    terms: [
      { offset: 0, value: "Diakonveien" },
      { offset: 12, value: "12" },
      { offset: 16, value: "Oslo" },
      { offset: 22, value: "Norway" }
    ],
    types: ["street_address", "geocode"]
  }
];

const geocodeStub = [
  {
    address_components: [
      { long_name: "12", short_name: "12", types: ["street_number"] },
      { long_name: "Diakonveien", short_name: "Diakonveien", types: ["route"] },
      { long_name: "Oslo", short_name: "Oslo", types: ["postal_town"] },
      {
        long_name: "Oslo kommune",
        short_name: "Oslo kommune",
        types: ["administrative_area_level_2", "political"]
      },
      {
        long_name: "Oslo",
        short_name: "Oslo",
        types: ["administrative_area_level_1", "political"]
      },
      { long_name: "Norway", short_name: "NO", types: ["country", "political"] }
    ],
    formatted_address: "Diakonveien 12, 0370 Oslo, Norway",
    geometry: {} as any,
    partial_match: true,
    place_id: "ChIJ2_jYgsFtQUYRiJlSWp2g1X0",
    postcode_localities: [],
    types: ["street_address"]
  }
];

const getGoogleMock = (
  autocompleteRes = predictionStub,
  geocodeRes = geocodeStub
) => ({
  maps: {
    places: {
      AutocompleteService: class {
        getPlacePredictions(
          request: AutocompletionRequest,
          callback: (result: AutocompletePrediction[]) => void
        ) {
          callback(autocompleteRes);
        }
      }
    },
    Geocoder: class {
      geocode(
        request: GeocoderRequest,
        callback: (results: GeocoderResult[]) => void
      ) {
        callback(geocodeRes);
      }
    }
  }
});
