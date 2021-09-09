import GoogleApi, {
  Google,
  LatLngBounds,
  LatLngBoundsLiteral,
  Map,
  MapOptions,
  Marker,
  MarkerOptionsWithData
} from "@bmi/google-api";
import CircularProgress from "@material-ui/core/CircularProgress";
import React, {
  MutableRefObject,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import styles from "./GoogleMap.module.scss";

// This component is not concerned with the shape of
// the arbitraty data sent into the marker.
type MarkerData = any;

export type Props = MapOptions & {
  bounds?: LatLngBounds | LatLngBoundsLiteral;
  children?: ReactNode;
  markers?: MarkerOptionsWithData<MarkerData>[];
  onMarkerClick?: (
    data: MarkerData,
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
  bounds,
  center,
  children,
  markers = [],
  onMarkerClick,
  zoom,
  ...mapOptions
}: Props) => {
  const google = useContext<Google | null>(GoogleApi);
  const [error, setError] = useState<Error>();
  const googleMap: MutableRefObject<Map | null> = useRef<Map>(null);
  const googleMarkers: MutableRefObject<Marker[]> = useRef<Marker[]>([]);
  const mapElement = useRef<HTMLDivElement>(null);

  const createGoogleMarker = ({
    isActive,
    data,
    ...options
  }: MarkerOptionsWithData<MarkerData>) => {
    const defaultIcon = {
      path: "M16,0A12,12,0,0,0,4,12C4,23,16,32,16,32s12-9,12-20A12,12,0,0,0,16,0Zm0,17a5,5,0,1,1,5-5A5,5,0,0,1,16,17Z",
      fillColor: "#0072b0",
      fillOpacity: 1,
      strokeColor: "#fff",
      strokeWeight: 1,
      anchor: google ? new google.maps.Point(13, 34) : undefined
    };

    const activeIcon = {
      ...defaultIcon,
      fillColor: "#005b8c",
      scale: 1.5
    };

    const googleMarker =
      google &&
      new google.maps.Marker({
        map: googleMap.current || undefined,
        icon: isActive ? activeIcon : defaultIcon,
        ...options
      });

    googleMarker?.addListener("click", ({ domEvent }) => {
      onMarkerClick && onMarkerClick(data, googleMarker, domEvent);
    });

    return googleMarker;
  };

  const deleteGoogleMarker = (googleMarker: Marker) =>
    googleMarker.setMap(null);

  useEffect(() => {
    if (google) {
      const options = { center, zoom, ...defaultMapControls, ...mapOptions };
      googleMap.current =
        mapElement.current && new google.maps.Map(mapElement.current, options);
      googleMarkers.current = markers
        .map(createGoogleMarker)
        .filter(Boolean) as google.maps.Marker[];
    }
  }, [google]);

  useEffect(() => {
    if (googleMap.current) {
      googleMarkers.current.map(deleteGoogleMarker);
      googleMarkers.current = markers
        .map(createGoogleMarker)
        .filter(Boolean) as google.maps.Marker[];
    }
  }, [markers]);

  useEffect(() => {
    if (googleMap.current && bounds) {
      googleMap.current.fitBounds(bounds);
    }
  }, [bounds]);

  useEffect(() => {
    if (googleMap.current && center) {
      googleMap.current.panTo(center);
    }
  }, [center]);

  useEffect(() => {
    if (googleMap.current && zoom) {
      googleMap.current.setZoom(zoom);
    }
  }, [zoom]);

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
