Component for an embedded [Google Map](https://developers.google.com/maps). See the Google Maps JavaScript API [documentation](https://developers.google.com/maps/documentation/javascript/overview).

## Static

```jsx
import { markers } from "./src/__tests__/__fixtures__";

<div style={{ height: "400px" }}>
  <GoogleMap
    apiKey="AIzaSyA-ceJ082hw_1ktpiTdFM_7hFmxMw1R4gU"
    markers={markers}
  />
</div>;
```

## Controlled map

```jsx
import { useState } from "react";
import Button from "@bmi/button";
import CompanyDetails from "@bmi/company-details";
import { markers as initialMarkers } from "./src/__tests__/__fixtures__";

const ControlledGoogleMap = () => {
  const [markers, setMarkers] = useState(initialMarkers);
  const [activeMarker, setActiveMarker] = useState();
  const [popupIsVisible, setPopupIsVisible] = useState(false);

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

  return (
    <>
      <div style={{ height: "400px" }}>
        <GoogleMap
          apiKey="AIzaSyA-ceJ082hw_1ktpiTdFM_7hFmxMw1R4gU"
          markers={markers}
          onMarkerClick={handleMarkerClick}
        >
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
    </>
  );
};

<ControlledGoogleMap />;
```
