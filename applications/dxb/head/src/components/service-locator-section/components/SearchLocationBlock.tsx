import React, { MouseEvent } from "react";
import {
  GeocoderResult as GoogleGeocoderResult,
  LatLngLiteral as GoogleLatLngLiteral
} from "@bmi/components";
import { Grid } from "@bmi/components";
import { Autocomplete } from "@bmi/components";
import { Typography } from "@bmi/components";
import { GoogleAutocomplete } from "@bmi/components";
import { GeolocationButton } from "@bmi/components";
import AutoCompleteCountryMap from "../../../countries/GoogleCountryCodeMap";
import styles from "../styles/ServiceLocatorSection.module.scss";
import { useSiteContext } from "../../Site";
import { getFilterOptions } from "../helpers";

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

  return (
    <Grid item xs={12} md={6} lg={4} className={styles["search"]}>
      <>
        <Autocomplete
          id="company-autocomplete"
          label={autocompleteLabel}
          noOptionsText={getMicroCopy("findARoofer.noResultsLabel")}
          className={styles["company-autocomplete"]}
          onChange={handleAutocompleteOnChange}
          filterOptions={getFilterOptions()}
          options={options}
          freeSolo
          startAdornmentIcon="HardHatHead"
        />
        <Typography className={styles["and-or-label"]}>
          <span>{getMicroCopy("findARoofer.andOr")}</span>
        </Typography>
        <GoogleAutocomplete
          id="location-autocomplete"
          label={getMicroCopy("findARoofer.locationFieldLabel")}
          noOptionsText={getMicroCopy("findARoofer.noResultsLabel")}
          className={styles["location-autocomplete"]}
          onPlaceChange={handlePlaceChange}
          freeSolo
          startAdornmentIcon="LocationOn"
          controlledValue={userPosition}
          googleAutocompleteOptions={{
            componentRestrictions: {
              // eslint-disable-next-line security/detect-object-injection
              country: AutoCompleteCountryMap[countryCode] || [countryCode]
            }
          }}
        />
        <GeolocationButton onPosition={getPosition()}>
          {getMicroCopy("findARoofer.geolocationButton")}
        </GeolocationButton>
      </>
    </Grid>
  );
};
