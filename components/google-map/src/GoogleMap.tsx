import Card from "@bmi/card";
import GoogleApi, {
  Google,
  Map,
  MapOptions,
  Marker,
  MarkerOptionsWithId
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
  markers?: MarkerOptionsWithId[];
  onMarkerClick?: (
    id: string,
    marker: Marker,
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
  // TODO: hardcoded to center of Norway set dynamically center and map bounds.
  center = { lat: 63.990556, lng: 12.3077779 },
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

  const createGoogleMarker = ({ id, ...options }: MarkerOptionsWithId) => {
    const googleMarker = new google.maps.Marker({
      map: googleMap.current,
      icon: {
        path:
          "M16,0A12,12,0,0,0,4,12C4,23,16,32,16,32s12-9,12-20A12,12,0,0,0,16,0Zm0,17a5,5,0,1,1,5-5A5,5,0,0,1,16,17Z",
        fillColor: "#0072b0",
        fillOpacity: 1,
        strokeColor: "#fff",
        strokeWeight: 1,
        labelOrigin: new google.maps.Point(66, 17)
      },
      label: {
        text: options.title,
        fontSize: "14px",
        color: "#000000",
        fontFamily: "Effra Regular"
      },
      ...options
    });

    googleMarker.addListener("click", ({ domEvent }) => {
      onMarkerClick && onMarkerClick(id, googleMarker, domEvent);
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
      {children && <div className={styles["popup"]}>{children}</div>}
    </div>
  );
};

export default GoogleMap;
