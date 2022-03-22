// istanbul ignore file: doesn't hold any logic
import GoogleApi, { computeDistanceBetween, loadGoogleApi } from "./GoogleApi";

export type {
  AutocompletePrediction,
  AutocompleteService,
  AutocompletionRequest,
  Geocoder,
  GeocoderRequest,
  GeocoderResult,
  Google,
  LatLngBounds,
  LatLngBoundsLiteral,
  LatLngLiteral,
  Map,
  MapOptions,
  Marker,
  MarkerOptions,
  MarkerOptionsWithData,
  Point
} from "./GoogleApi";
export { computeDistanceBetween, loadGoogleApi };

export default GoogleApi;
