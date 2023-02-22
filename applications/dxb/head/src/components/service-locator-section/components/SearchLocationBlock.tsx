import {
  Autocomplete,
  GeocoderResult as GoogleGeocoderResult,
  GeolocationButton,
  GoogleAutocomplete,
  Grid,
  LatLngLiteral as GoogleLatLngLiteral,
  Typography
} from "@bmi-digital/components";
import React, { MouseEvent } from "react";
import { microCopy } from "../../../constants/microCopies";
import AutoCompleteCountryMap from "../../../countries/GoogleCountryCodeMap";
import { useSiteContext } from "../../Site";
import { getFilterOptions } from "../helpers";
import styles from "../styles/ServiceLocatorSection.module.scss";

interface SearchLocationBlockProps {
  autocompleteLabel: string;
  handleAutocompleteOnChange: (_, inputValue) => void;
  handlePlaceChange: (location?: GoogleGeocoderResult) => void;
  options: string[];
  getPosition: () => (
    position: GeolocationPosition,
    event: MouseEvent<HTMLButtonElement>
  ) => void;
  userPosition: { location: GoogleLatLngLiteral };
}

export const SearchLocationBlock = ({
  autocompleteLabel,
  handleAutocompleteOnChange,
  options,
  handlePlaceChange,
  getPosition,
  userPosition
}: SearchLocationBlockProps) => {
  const { getMicroCopy, countryCode } = useSiteContext();
  const formattedCountryCode = countryCode.split("/")[0];
  return (
    <Grid xs={12} md={6} lg={4} className={styles["search"]}>
      <>
        <Autocomplete
          id="company-autocomplete"
          label={autocompleteLabel}
          noOptionsText={getMicroCopy(microCopy.FIND_A_ROOFER_NO_RESULTS_LABEL)}
          className={styles["company-autocomplete"]}
          onChange={handleAutocompleteOnChange}
          filterOptions={getFilterOptions()}
          options={options}
          freeSolo
          startAdornmentIcon="HardHatHead"
        />
        <Typography className={styles["and-or-label"]}>
          <span>{getMicroCopy(microCopy.FIND_A_ROOFER_AND_OR)}</span>
        </Typography>
        <GoogleAutocomplete
          id="location-autocomplete"
          label={getMicroCopy(microCopy.FIND_A_ROOFER_LOCATION_FIELD_LABEL)}
          noOptionsText={getMicroCopy(microCopy.FIND_A_ROOFER_NO_RESULTS_LABEL)}
          className={styles["location-autocomplete"]}
          onPlaceChange={handlePlaceChange}
          freeSolo
          startAdornmentIcon="LocationOn"
          controlledValue={userPosition}
          googleAutocompleteOptions={
            countryCode !== "grp" && {
              componentRestrictions: {
                // eslint-disable-next-line security/detect-object-injection
                country: AutoCompleteCountryMap[formattedCountryCode] || [
                  formattedCountryCode
                ]
              }
            }
          }
        />
        <GeolocationButton onPosition={getPosition()}>
          {getMicroCopy(microCopy.FIND_A_ROOFER_GEOLOCATION_BUTTON)}
        </GeolocationButton>
      </>
    </Grid>
  );
};
