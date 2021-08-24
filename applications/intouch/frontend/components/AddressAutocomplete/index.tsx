import React, { useEffect, useState } from "react";
import GoogleAutocomplete, {
  Props as GoogleAutocompleteProps
} from "@bmi/google-autocomplete";
import GoogleApi, { loadGoogleApi, GeocoderResult } from "@bmi/google-api";
import GoogleMap, { Props as GoogleMapProps } from "@bmi/google-map";
import { Address, Point } from "@bmi/intouch-api-types";
import { addressFromPlaceApiResponse } from "./placeApiResponseToAddress";
import styles from "./styles.module.scss";

type AddressAutocompleteProps = GoogleAutocompleteProps & {
  onAddressSelected: (address: Partial<Address>) => any;
  mapProps: GoogleMapProps;
  locationBias?: Point;
};

// One challenges of location biasing is to find an appropriate radius for different markets
// In order to customize this bias radius, we could potentially in future add a field to the market record, which specifies the radius
const DEFAULT_LOCATION_BIAS_RADIUS = 100 * 1000; // in metres, currently the same for all markets

export const AddressAutocomplete = ({
  onAddressSelected,
  googleAutocompleteOptions = {},
  mapProps,
  locationBias,
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
        // Some results seem to not be returned by Places API (compared to same Google Maps).
        // It seems like the fuzzy search on Places API is not optimal (it's much better with Google Maps)
        onPlaceChange={handlePlaceChange}
        getOptionSelected={(place) => place.description}
        googleAutocompleteOptions={{
          ...googleAutocompleteOptions,
          location:
            googleApi && locationBias
              ? new googleApi.maps.LatLng(locationBias.x, locationBias.y)
              : undefined,
          // radius is just for biasing purposes: locations outside of the center + radius
          // will be returned anyway, but with lower ranking
          radius:
            googleApi && locationBias ? DEFAULT_LOCATION_BIAS_RADIUS : undefined
        }}
        startAdornmentIcon="LocationOn"
        {...rest}
      />
      <div className={styles.mapContainer}>
        {googleApi?.maps && <GoogleMap {...mapProps} />}
      </div>
    </GoogleApi.Provider>
  );
};
