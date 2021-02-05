Autocomplete component using the Google Places API.

## Default

```jsx
import React, { useState } from "react";

const GoogleAutocompleteDemo = ({ apiKey }) => {
  const [place, setPlace] = useState(null);

  const handlePlaceChange = (newPlace) => {
    setPlace(newPlace);
  };

  return (
    <>
      {apiKey === "PASTE_API_KEY_HERE" ? (
        "Please enter a Google API key into the code below"
      ) : (
        <GoogleAutocomplete apiKey={apiKey} onPlaceChange={handlePlaceChange} />
      )}
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
    </>
  );
};

<GoogleAutocompleteDemo apiKey="PASTE_API_KEY_HERE" />;
```
