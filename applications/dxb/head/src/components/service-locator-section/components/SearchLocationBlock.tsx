import React, { MouseEvent } from "react";
import {
  GeocoderResult as GoogleGeocoderResult,
  LatLngLiteral as GoogleLatLngLiteral
} from "@bmi/google-api/src";
import Grid from "@bmi/grid";
import Autocomplete from "@bmi/autocomplete";
import Typography from "@bmi/typography";
import GoogleAutocomplete from "@bmi/google-autocomplete";
import GeolocationButton from "@bmi/geolocation-button";
import AutoCompleteCountryMap from "../../../countries/GoogleCountryCodeMap";
import styles from "../styles/ServiceLocatorSection.module.scss";
import { useSiteContext } from "../../Site";
import { getFilterOptions } from "../helpers";
import { EntryTypeEnum } from "../../Service";

interface SearchLocationBlockProps {
  sectionType: EntryTypeEnum;
  handleAutocompleteOnChange: (_, inputValue) => void;
  handlePlaceChange: (location?: GoogleGeocoderResult) => void;
  options: string[];
  getPosition: () => (
    position: Position,
    event: MouseEvent<HTMLButtonElement>
  ) => void;
  userPosition: { location: GoogleLatLngLiteral };
}

export const SearchLocationBlock = ({
  sectionType,
  handleAutocompleteOnChange,
  options,
  handlePlaceChange,
  getPosition,
  userPosition
}: SearchLocationBlockProps) => {
  const { getMicroCopy, countryCode } = useSiteContext();
  const nameSearchLabelKey =
    sectionType === EntryTypeEnum.MERCHANT_TYPE
      ? "merchantNameSearchLabel"
      : "companyFieldLabel";

  return (
    <Grid item xs={12} md={6} lg={4} className={styles["search"]}>
      <>
        <Autocomplete
          id="company-autocomplete"
          label={getMicroCopy(`findARoofer.${nameSearchLabelKey}`)}
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
