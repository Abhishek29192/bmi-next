import { GeocoderResult } from "@bmi-digital/components/google-api";
import { Address } from "@bmi/intouch-api-types";

const findAddressComponent = (
  addressComponents: GeocoderResult["address_components"],
  type: string
): string | undefined =>
  addressComponents.find(({ types }) => types.includes(type))?.long_name;

export const addressFromPlaceApiResponse = (
  placeApiResult: GeocoderResult
): Partial<Address> => {
  if (!placeApiResult) {
    return null;
  }
  const { address_components: components, geometry } = placeApiResult;

  const streetNumber = findAddressComponent(components, "street_number");
  const route = findAddressComponent(components, "route");
  const postcode = findAddressComponent(components, "postal_code");
  const postalTown = findAddressComponent(components, "postal_town");
  const locality = findAddressComponent(components, "locality");
  const adminAreaL1 = findAddressComponent(
    components,
    "administrative_area_level_1"
  );
  const country = findAddressComponent(components, "country");

  const streetDetails = [streetNumber, route].filter((el) => !!el).join(" ");

  const address: Partial<Address> = {
    firstLine: streetDetails,
    // not sure if there is a reliable way to get the 2nd line
    postcode,
    town: postalTown || locality,
    region: adminAreaL1,
    country
  };

  if (geometry?.location?.lat && geometry?.location?.lng) {
    address.coordinates = {
      x: geometry.location.lat(),
      y: geometry.location.lng()
    };
  }
  return address;
};
