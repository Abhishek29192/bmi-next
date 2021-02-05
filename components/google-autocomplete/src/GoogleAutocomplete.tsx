/* global google */
import Autocomplete, { Props as AutocompleteProps } from "@bmi/autocomplete";
import { Loader } from "@googlemaps/js-api-loader";
import React, { useEffect, useMemo, useRef, useState } from "react";

type Option = google.maps.places.AutocompletePrediction;

export type GeocoderResult = google.maps.GeocoderResult;

type Props = Omit<AutocompleteProps, "options"> & {
  apiKey: string;
  onPlaceChange?: (place: GeocoderResult) => void;
};

const GoogleAutocomplete = ({ apiKey, onPlaceChange, ...props }: Props) => {
  const debouncer = useRef<NodeJS.Timeout>();
  const googleAutocomplete = useRef<google.maps.places.AutocompleteService>();
  const googleGeocoder = useRef<google.maps.Geocoder>();
  const [value, setValue] = useState<any>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [options, setOptions] = useState<(Option | string)[]>([]);
  const loader = new Loader({
    apiKey,
    version: "weekly",
    libraries: ["places"]
  });

  const initialise = async () => {
    await loader.load();
    googleAutocomplete.current = new google.maps.places.AutocompleteService();
    googleGeocoder.current = new google.maps.Geocoder();
  };

  const getPlacePredictions = useMemo(
    () => (
      request: google.maps.places.AutocompletionRequest,
      callback: (result: Option[]) => void
    ) =>
      googleAutocomplete.current
        ? googleAutocomplete.current.getPlacePredictions(request, callback)
        : undefined,
    []
  );

  const getGeocode = useMemo(
    () => (
      request: google.maps.GeocoderRequest,
      callback: (results: GeocoderResult[]) => void
    ) =>
      googleGeocoder.current
        ? googleGeocoder.current.geocode(request, callback)
        : undefined,
    []
  );

  useEffect(() => {
    initialise();
  }, []);

  useEffect(() => {
    if (inputValue === "") {
      setOptions([]);
      onPlaceChange && onPlaceChange(null);
      return;
    }

    getPlacePredictions({ input: inputValue }, (results) => {
      setOptions([...(value ? [value] : []), ...results]);
    });
  }, [value, inputValue]);

  useEffect(() => {
    if (value && value.place_id) {
      getGeocode({ placeId: value.place_id }, (result) => {
        onPlaceChange && onPlaceChange(result[0]);
      });
    }
  }, [value]);

  return (
    <Autocomplete
      getOptionLabel={(option: Option) =>
        typeof option === "string" ? option : option.description
      }
      options={options}
      value={value}
      onChange={(_, value) => {
        setOptions(value ? [value, ...options] : options);
        setValue(value);
      }}
      onInputChange={(_, inputValue) => {
        clearTimeout(debouncer.current);
        debouncer.current = setTimeout(() => setInputValue(inputValue), 500);
      }}
      renderOption={({ structured_formatting }: Option) => (
        <Autocomplete.Option
          text={structured_formatting.main_text}
          secondaryText={structured_formatting.secondary_text}
          matches={structured_formatting.main_text_matched_substrings}
        />
      )}
      {...props}
    />
  );
};

export default GoogleAutocomplete;
