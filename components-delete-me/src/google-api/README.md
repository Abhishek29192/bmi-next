GoogleApi context definition and loader. Uses the
[`@googlemaps/js-api-loader`](https://github.com/googlemaps/js-api-loader).

## Usage

```jsx
import GoogleApi, { loadGoogleApi } from "../google-api";
import React, { useContext, useEffect, useState, useRef } from "react";

const Page = () => {
  const [googleApi, setGoogleApi] = useState(false);

  const initialisePage = async () => {
    try {
      await loadGoogleApi("GOOGLE_API_KEY", ["places"]);
      setGoogleApi(typeof google !== "undefined" ? google : null);
    } catch (error) {
      // Handle error
    }
  };

  useEffect(() => {
    initialisePage();
  }, []);

  return (
    <GoogleApi.Provider value={googleApi}>
      <h1>Page with Google component</h1>
      <GoogleComponent />
    </GoogleApi.Provider>
  );
};

const GoogleComponent = () => {
  const google = useContext(GoogleApi);
  const googleGeocoder = useRef();

  useEffect(() => {
    if (google) {
      // Create any Google API instances here, E.g:
      googleGeocoder.current = new google.maps.Geocoder();
    }
  }, [google]);

  return google ? `API v${google.maps.version} loaded` : "Loading";
};

<Page />;
```
