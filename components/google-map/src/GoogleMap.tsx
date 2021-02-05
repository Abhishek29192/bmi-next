import Card from "@bmi/card";
import GoogleApi, {
  Google,
  Map,
  MapOptions,
  Marker,
  MarkerOptions
} from "@bmi/google-api";
import CircularProgress from "@material-ui/core/CircularProgress";
import React, {
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import styles from "./GoogleMap.module.scss";

type Props = MapOptions & {
  children?: ReactNode;
  markers?: MarkerOptions[];
  onMarkerClick?: (
    marker: Marker,
    index: number,
    event: MouseEvent | Event | TouchEvent | PointerEvent
  ) => void;
};

const defaultMapControls = {
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: false
};

const GoogleMap = ({
  center = { lat: 51.5, lng: 0 },
  children,
  markers = [],
  onMarkerClick,
  zoom = 8,
  ...mapOptions
}: Props) => {
  const google = useContext<Google>(GoogleApi);
  const [error, setError] = useState<Error>();
  const googleMap = useRef<Map>();
  const googleMarkers = useRef<Marker[]>([]);
  const mapElement = useRef<HTMLDivElement>();

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
    if (google) {
      const options = { center, zoom, ...defaultMapControls, ...mapOptions };
      googleMap.current = new google.maps.Map(mapElement.current, options);
      googleMarkers.current = markers.map(createGoogleMarker);
    }
  }, [google]);

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
