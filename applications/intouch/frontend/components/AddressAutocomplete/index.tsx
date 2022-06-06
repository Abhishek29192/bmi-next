import React, { useEffect, useState } from "react";
import { GoogleAutocomplete, GoogleAutocompleteProps } from "@bmi/components";
import {
  Google,
  GoogleApi,
  loadGoogleApi,
  GeocoderResult
} from "@bmi/components";
import { GoogleMap, GoogleMapProps } from "@bmi/components";
import { Address, Point } from "@bmi/intouch-api-types";
import { addressFromPlaceApiResponse } from "./placeApiResponseToAddress";
import styles from "./styles.module.scss";

type AddressAutocompleteProps = GoogleAutocompleteProps & {
  onAddressSelected: (address: Partial<Address>) => any;
  mapProps: GoogleMapProps;
  searchBiasCenter?: Point;
  searchBiasRadiusKm?: number;
  mapsApiKey: string;
};

declare global {
  interface Window {
    google?: Google;
  }
}

const DEFAULT_SEARCH_BIAS_RADIUS_KM = 100 * 1000;

export const AddressAutocomplete = ({
  onAddressSelected,
  mapProps,
  searchBiasCenter,
  searchBiasRadiusKm,
  mapsApiKey,
  ...rest
}: AddressAutocompleteProps) => {
  const [googleApi, setGoogleApi] = useState(null);

  const initialiseGoogleApi = async () => {
    await loadGoogleApi(mapsApiKey, ["places"]);
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
        // It seems like the fuzzy search on Places API is not optimal (it's much better with Google Maps).
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
