Button that uses the browser [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation) on click.

## Demo

```jsx
import React, { useState } from "react";

const GeolocationDemo = () => {
  const [position, setPosition] = useState();
  const [error, setError] = useState();

  return (
    <>
      <GeolocationButton
        onPosition={(position) => setPosition(position)}
        onError={setError}
      >
        Use my location
      </GeolocationButton>
      {position && (
        <table style={{ borderSpacing: "1rem 0" }}>
          <thead>
            <tr>
              <th>Latitude</th>
              <th>Longitude</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{position.coords.latitude}</td>
              <td>{position.coords.longitude}</td>
            </tr>
          </tbody>
        </table>
      )}
      {!position && error && (
        <pre style={{ color: "#d6001c" }}>Error: {error.message}</pre>
      )}
    </>
  );
};

<GeolocationDemo />;
```
