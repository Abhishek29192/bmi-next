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
  searchBiasCenter?: Point;
  searchBiasRadiusKm?: number;
};

const DEFAULT_SEARCH_BIAS_RADIUS_KM = 100 * 1000;

export const AddressAutocomplete = ({
  onAddressSelected,
  mapProps,
  searchBiasCenter,
  searchBiasRadiusKm,
  ...rest
}: AddressAutocompleteProps) => {
  const [googleApi, setGoogleApi] = useState(null);

  const initialiseGoogleApi = async () => {
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
    initialiseGoogleApi();
  }, []);

  return (
    <GoogleApi.Provider value={googleApi}>
      <GoogleAutocomplete
        // Some results seem to not be returned by Places API (compared to same Google Maps).
        // It seems like the fuzzy search on Places API is not optimal (it's much better with Google Maps)
        onPlaceChange={handlePlaceChange}
        getOptionSelected={(place) => place.description}
        googleAutocompleteOptions={{
          ...(googleApi && searchBiasCenter
            ? {
                // the bias area (middle + radius) will not exclude locations
                location: new googleApi.maps.LatLng(
                  searchBiasCenter.x,
                  searchBiasCenter.y
                ),
                // radius in metres
                radius:
                  (searchBiasRadiusKm || DEFAULT_SEARCH_BIAS_RADIUS_KM) * 1000
              }
            : {})
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
