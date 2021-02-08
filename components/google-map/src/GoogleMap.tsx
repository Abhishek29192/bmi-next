/* global google */
import Card from "@bmi/card";
import { Loader } from "@googlemaps/js-api-loader";
import CircularProgress from "@material-ui/core/CircularProgress";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import styles from "./GoogleMap.module.scss";

export type GoogleLatLng = google.maps.LatLngLiteral;

type Props = google.maps.MapOptions & {
  apiKey?: string;
  children?: ReactNode;
  markers?: google.maps.MarkerOptions[];
  onMarkerClick?: (
    marker: google.maps.Marker,
    index: number,
    event: MouseEvent | Event | TouchEvent | PointerEvent
  ) => void;
};

const GoogleMap = ({
  apiKey,
  center = { lat: 51.5, lng: 0 },
  children,
  markers,
  onMarkerClick,
  zoom = 8,
  ...mapOptions
}: Props) => {
  const [error, setError] = useState<Error>();
  const googleMap = useRef<google.maps.Map>();
  const googleMarkers = useRef<google.maps.Marker[]>([]);
  const mapElement = useRef<HTMLDivElement>();
  const loader = new Loader({ apiKey, version: "weekly" });

  const initialiseMap = async () => {
    const options = { center, zoom, ...mapOptions };
    try {
      await loader.load();
      googleMap.current = new google.maps.Map(mapElement.current, options);
      googleMarkers.current = markers.map(createGoogleMarker);
    } catch (error) {
      setError(error);
    }
  };

  const createGoogleMarker = (
    options: google.maps.MarkerOptions,
    index: number
  ) => {
    const googleMarker = new google.maps.Marker({
      map: googleMap.current,
      ...options
    });

    googleMarker.addListener("click", ({ domEvent }) => {
      onMarkerClick && onMarkerClick(googleMarker, index, domEvent);
    });

    return googleMarker;
  };

  const deleteGoogleMarker = (googleMarker: google.maps.Marker) =>
    googleMarker.setMap(null);

  useEffect(() => {
    initialiseMap();
  }, []);

  useEffect(() => {
    if (googleMap.current) {
      googleMarkers.current = markers.map(createGoogleMarker);
    }

    return () => googleMarkers.current.map(deleteGoogleMarker);
  }, [markers]);

  return (
    <div className={styles["GoogleMap"]}>
      <div className={styles["map"]} ref={mapElement}>
        {error ? (
          <pre className={styles["error"]}>Error: {error.message}</pre>
        ) : (
          <CircularProgress />
        )}
      </div>
      {children && <Card className={styles["popup"]}>{children}</Card>}
    </div>
  );
};

export default GoogleMap;
