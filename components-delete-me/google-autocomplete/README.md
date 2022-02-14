Autocomplete component using the Google Places API. This component uses the
[`GoogleApi`](/#/GoogleApi) context provider.

## Default

```jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import GoogleApi, { loadGoogleApi } from "@bmi-digital/components/google-api";
import GoogleAutocomplete from "@bmi-digital/components/google-autocomplete";

const GoogleAutocompleteDemo = ({ apiKey }) => {
  const [place, setPlace] = useState(null);
  const [googleApi, setgoogleApi] = useState(false);

  const initialise = async () => {
    await loadGoogleApi(apiKey, ["places"]);
    setgoogleApi(typeof google !== "undefined" ? google : null);
  };

  useEffect(() => {
    apiKey && initialise();
  }, []);

  const handlePlaceChange = (newPlace) => {
    setPlace(newPlace);
  };

  return (
    <GoogleApi.Provider value={googleApi}>
      <GoogleAutocomplete onPlaceChange={handlePlaceChange} />
      {place && (
        <table style={{ borderSpacing: "1rem 0" }}>
          <thead>
            <tr>
              <th>Latitude</th>
              <th>Longitude</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{place.geometry.location.lat()}</td>
              <td>{place.geometry.location.lng()}</td>
            </tr>
          </tbody>
        </table>
      )}
    </GoogleApi.Provider>
  );
};

<GoogleAutocompleteDemo apiKey="" />;
```
