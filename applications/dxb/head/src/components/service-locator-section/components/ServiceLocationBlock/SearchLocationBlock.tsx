import {
  Autocomplete,
  GeocoderResult as GoogleGeocoderResult,
  GeolocationButton,
  LatLngLiteral as GoogleLatLngLiteral
} from "@bmi-digital/components";
import React, { MouseEvent } from "react";
import { microCopy } from "../../../../constants/microCopies";
import AutoCompleteCountryMap from "../../../../countries/GoogleCountryCodeMap";
import { useSiteContext } from "../../../Site";
import { getFilterOptions } from "../../helpers";

import { Root, AndOrLabel, LocationAutoComplete } from "./style";

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
    <Root xs={12} md={6} lg={4}>
      <>
        <Autocomplete
          id="company-autocomplete"
          label={autocompleteLabel}
          noOptionsText={getMicroCopy(microCopy.FIND_A_ROOFER_NO_RESULTS_LABEL)}
          onChange={handleAutocompleteOnChange}
          filterOptions={getFilterOptions}
          options={options}
          freeSolo
          startAdornmentIcon="HardHatHead"
        />
        <AndOrLabel>
          <span>{getMicroCopy(microCopy.FIND_A_ROOFER_AND_OR)}</span>
        </AndOrLabel>
        <LocationAutoComplete
          id="location-autocomplete"
          label={getMicroCopy(microCopy.FIND_A_ROOFER_LOCATION_FIELD_LABEL)}
          noOptionsText={getMicroCopy(microCopy.FIND_A_ROOFER_NO_RESULTS_LABEL)}
          onPlaceChange={handlePlaceChange}
          freeSolo
          startAdornmentIcon="LocationOn"
          controlledValue={userPosition}
          googleAutocompleteOptions={
            countryCode !== "grp" && {
              componentRestrictions: {
                country: AutoCompleteCountryMap[
                  formattedCountryCode as string
                ] || [formattedCountryCode]
              }
            }
          }
        />
        <GeolocationButton onPosition={getPosition()}>
          {getMicroCopy(microCopy.FIND_A_ROOFER_GEOLOCATION_BUTTON)}
        </GeolocationButton>
      </>
    </Root>
  );
};
