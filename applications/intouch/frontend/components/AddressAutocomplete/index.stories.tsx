import React from "react";
import { AddressAutocomplete } from ".";

export default {
  title: "AddressAutocomplete",
  component: AddressAutocomplete
};

export const Basic = () => {
  return (
    <AddressAutocomplete
      name=""
      fullWidth
      mapsApiKey=""
      label="Select an address from the menu"
      onAddressSelected={(address) => {
        window.alert(`selected address: ${address.toString()}`);
      }}
      mapProps={{}}
    />
  );
};
