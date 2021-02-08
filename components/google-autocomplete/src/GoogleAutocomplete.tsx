import Autocomplete, { Props as AutocompleteProps } from "@bmi/autocomplete";
import GoogleApi, {
  AutocompletePrediction,
  AutocompleteService,
  AutocompletionRequest,
  Geocoder,
  GeocoderRequest,
  GeocoderResult,
  Google
} from "@bmi/google-api";
import CircularProgress from "@material-ui/core/CircularProgress";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";

type Props = Omit<AutocompleteProps, "options"> & {
  onPlaceChange?: (place: GeocoderResult) => void;
};

const GoogleAutocomplete = ({ onPlaceChange, ...props }: Props) => {
  const google = useContext<Google>(GoogleApi);
  const debouncer = useRef<NodeJS.Timeout>();
  const googleAutocomplete = useRef<AutocompleteService>();
  const googleGeocoder = useRef<Geocoder>();
  const [value, setValue] = useState<any>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [options, setOptions] = useState<(AutocompletePrediction | string)[]>(
    []
  );

  const getPlacePredictions = useMemo(
    () => (
      request: AutocompletionRequest,
      callback: (result: AutocompletePrediction[]) => void
    ) =>
      googleAutocomplete.current
        ? googleAutocomplete.current.getPlacePredictions(request, callback)
        : undefined,
    []
  );

  const getGeocode = useMemo(
    () => (
      request: GeocoderRequest,
      callback: (results: GeocoderResult[]) => void
    ) =>
      googleGeocoder.current
        ? googleGeocoder.current.geocode(request, callback)
        : undefined,
    []
  );

  useEffect(() => {
    if (google) {
      googleAutocomplete.current = new google.maps.places.AutocompleteService();
      googleGeocoder.current = new google.maps.Geocoder();
    }
  }, [google]);

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

  return google ? (
    <Autocomplete
      getOptionLabel={(option: AutocompletePrediction) =>
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
      renderOption={({ structured_formatting }: AutocompletePrediction) => (
        <Autocomplete.Option
          text={structured_formatting.main_text}
          secondaryText={structured_formatting.secondary_text}
          matches={structured_formatting.main_text_matched_substrings}
        />
      )}
      {...props}
    />
  ) : (
    <div style={{ textAlign: "center" }}>
      <CircularProgress />
    </div>
  );
};

export default GoogleAutocomplete;
