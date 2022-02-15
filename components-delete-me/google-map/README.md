Component for an embedded [Google Map](https://developers.google.com/maps).
See the Google Maps JavaScript API
[documentation](https://developers.google.com/maps/documentation/javascript/overview).

## Static

```jsx
import { markers } from "./src/__tests__/__fixtures__";
import { GoogleApi, { loadGoogleApi } } from "@bmi-digital/components";
import React, { useEffect, useState } from "react";

const GoogleMapDemo = () => {
  const [googleApi, setgoogleApi] = useState(false);

  const initialise = async () => {
    await loadGoogleApi(undefined, ["places"]);
    setgoogleApi(typeof google !== "undefined" ? google : null);
  };

  useEffect(() => {
    initialise();
  }, []);

  return (
    <GoogleApi.Provider value={googleApi}>
      <div style={{ height: "400px" }}>
        <GoogleMap markers={markers} />
      </div>
    </GoogleApi.Provider>
  );
};

<GoogleMapDemo />;
```

## Controlled map

```jsx
import { markers as initialMarkers } from "./src/__tests__/__fixtures__";
import { Button } from "@bmi-digital/components";
import { CompanyDetails } from "@bmi-digital/components";
import { GoogleApi, { loadGoogleApi } } from "@bmi-digital/components";
import React, { useEffect, useState } from "react";

const ControlledGoogleMap = () => {
  const [googleApi, setgoogleApi] = useState(false);
  const [markers, setMarkers] = useState(initialMarkers);
  const [activeMarker, setActiveMarker] = useState();
  const [popupIsVisible, setPopupIsVisible] = useState(false);

  const initialise = async () => {
    await loadGoogleApi(undefined, ["places"]);
    setgoogleApi(typeof google !== "undefined" ? google : null);
  };

  const handleMarkerClick = (marker, index) => {
    setPopupIsVisible(true);
    setActiveMarker(markers[index]);
  };

  const handleCloseClick = () => {
    setPopupIsVisible(false);
  };

  const handleRemoveMarkerClick = () => {
    setMarkers(markers.slice(1));
  };

  useEffect(() => {
    initialise();
  }, []);

  return (
    <GoogleApi.Provider value={googleApi}>
      <div style={{ height: "400px" }}>
        <GoogleMap markers={markers} onMarkerClick={handleMarkerClick}>
          {popupIsVisible && activeMarker && (
            <CompanyDetails name={activeMarker.title} details={[]}>
              <p>
                Brief summary of company here in a single paragraph. Lorem ipsum
                dolor sit amet, consectetur adipiscing elit. Sed ipsum felis,
                viverra vel nunc vitae, fermentum auctor velit. Suspendisse
                tempor, arcu eu fermentum bibendum, dolor sem consectetur lacus,
                vitae fermentum augue.
              </p>
              <Button onClick={handleCloseClick} variant="text">
                Close
              </Button>
            </CompanyDetails>
          )}
        </GoogleMap>
      </div>
      <Button onClick={handleRemoveMarkerClick} style={{ marginTop: "1rem" }}>
        Remove marker
      </Button>
    </GoogleApi.Provider>
  );
};

<ControlledGoogleMap />;
```
