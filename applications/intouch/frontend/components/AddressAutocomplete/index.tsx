import React, { useEffect, useState } from "react";
import GoogleAutocomplete, {
  Props as GoogleAutocompleteProps
} from "@bmi/google-autocomplete";
import GoogleApi, { loadGoogleApi, GeocoderResult } from "@bmi/google-api";
import GoogleMap, { Props as GoogleMapProps } from "@bmi/google-map";
import { Address } from "@bmi/intouch-api-types";
import { addressFromPlaceApiResponse } from "./placeApiResponseToAddress";
import styles from "./styles.module.scss";

type AddressAutocompleteProps = GoogleAutocompleteProps & {
  onAddressSelected: (address: Partial<Address>) => any;
  mapProps: GoogleMapProps;
};

export const AddressAutocomplete = ({
  onAddressSelected,
  googleAutocompleteOptions = {},
  mapProps,
  ...rest
}: AddressAutocompleteProps) => {
  const [googleApi, setGoogleApi] = useState(null);

  const initialise = async () => {
    await loadGoogleApi(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, [
      "places"
    ]);
    setGoogleApi(typeof window?.google !== "undefined" ? window.google : null);
  };

  const handlePlaceChange = (placeApiResponse: GeocoderResult) => {
    if (googleApi) {
      onAddressSelected(addressFromPlaceApiResponse(placeApiResponse));
    }
  };

  useEffect(() => {
    initialise();
  }, []);

  return (
    <GoogleApi.Provider value={googleApi}>
      <GoogleAutocomplete
        onPlaceChange={handlePlaceChange}
        getOptionSelected={(place) => place.description}
        googleAutocompleteOptions={googleAutocompleteOptions}
        startAdornmentIcon="LocationOn"
        {...rest}
      />
      <div className={styles.mapContainer}>
        {googleApi?.maps && <GoogleMap {...mapProps} />}
      </div>
    </GoogleApi.Provider>
  );
};
