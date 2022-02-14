import Autocomplete, {
  Props as AutocompleteProps
} from "@bmi-digital/components/autocomplete";
import GoogleApi, {
  AutocompletePrediction,
  AutocompleteService,
  AutocompletionRequest,
  Geocoder,
  GeocoderRequest,
  GeocoderResult,
  Google
} from "@bmi-digital/components/google-api";
import CircularProgress from "@material-ui/core/CircularProgress";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";

export type Props = Omit<AutocompleteProps, "options"> & {
  onPlaceChange?: (place: GeocoderResult | null) => void;
  controlledValue?: any;
  googleAutocompleteOptions?: Omit<AutocompletionRequest, "input">;
};

const GoogleAutocomplete = ({
  onPlaceChange,
  controlledValue = "",
  googleAutocompleteOptions = {},
  ...props
}: Props) => {
  const google = useContext<Google | null>(GoogleApi);
  const debouncer = useRef<NodeJS.Timeout>();
  const googleAutocomplete = useRef<AutocompleteService>();
  const googleGeocoder = useRef<Geocoder>();
  const [value, setValue] = useState<any>(controlledValue);
  const [inputValue, setInputValue] = useState<string>("");
  const [options, setOptions] = useState<(AutocompletePrediction | string)[]>(
    []
  );

  const getPlacePredictions = useMemo(
    () =>
      (
        request: AutocompletionRequest,
        callback: (result: AutocompletePrediction[]) => void
      ) =>
        googleAutocomplete.current
          ? googleAutocomplete.current.getPlacePredictions(request, callback)
          : undefined,
    []
  );

  const getGeocode = useMemo(
    () =>
      (
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

    getPlacePredictions(
      { ...googleAutocompleteOptions, input: inputValue },
      (results) => {
        setOptions(results);
      }
    );
  }, [value, inputValue]);

  useEffect(() => {
    if (value?.place_id) {
      getGeocode({ placeId: value.place_id }, (result) => {
        onPlaceChange && onPlaceChange(result[0]);
      });
    }
  }, [value]);

  useEffect(() => {
    if (controlledValue) {
      getGeocode(controlledValue, (result) => {
        if (JSON.stringify(result[0]) !== JSON.stringify(value)) {
          const newValue = {
            ...result[0],
            structured_formatting: {
              main_text: result[0]?.formatted_address
            },
            description: result[0]?.formatted_address
          };
          setValue(newValue);
        }
      });
    }
  }, [controlledValue]);

  return google ? (
    <Autocomplete
      getOptionLabel={(option: AutocompletePrediction) =>
        typeof option === "string" ? option : option.description
      }
      options={options || []}
      value={value || null}
      onChange={(_, value) => {
        setValue(value);
      }}
      onInputChange={(_, inputValue) => {
        debouncer.current && clearTimeout(debouncer.current);
        debouncer.current = setTimeout(() => setInputValue(inputValue), 500);
      }}
      renderOption={({ structured_formatting }: AutocompletePrediction) =>
        structured_formatting && (
          <Autocomplete.Option
            text={structured_formatting.main_text}
            secondaryText={structured_formatting.secondary_text}
            matches={structured_formatting.main_text_matched_substrings}
          />
        )
      }
      {...props}
    />
  ) : (
    <div style={{ textAlign: "center" }}>
      <CircularProgress />
    </div>
  );
};

export default GoogleAutocomplete;
