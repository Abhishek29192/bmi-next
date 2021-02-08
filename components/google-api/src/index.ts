import GoogleApi, { loadGoogleApi } from "./GoogleApi";

export type {
  AutocompletePrediction,
  AutocompleteService,
  AutocompletionRequest,
  Geocoder,
  GeocoderRequest,
  GeocoderResult,
  Google,
  LatLngLiteral,
  Map,
  MapOptions,
  Marker,
  MarkerOptions
} from "./GoogleApi";

export { loadGoogleApi };

export default GoogleApi;
