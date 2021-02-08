import { Loader, LoaderOptions } from "@googlemaps/js-api-loader";
import { createContext } from "react";

export type AutocompletePrediction = google.maps.places.AutocompletePrediction;
export type AutocompletionRequest = google.maps.places.AutocompletionRequest;
export type AutocompleteService = google.maps.places.AutocompleteService;
export type Geocoder = google.maps.Geocoder;
export type GeocoderRequest = google.maps.GeocoderRequest;
export type GeocoderResult = google.maps.GeocoderResult;
export type LatLngLiteral = google.maps.LatLngLiteral;
export type Map = google.maps.Map;
export type MapOptions = google.maps.MapOptions;
export type Marker = google.maps.Marker;
export type MarkerOptions = google.maps.MarkerOptions;

type GoogleMaps = {
  Geocoder: {
    new (): Geocoder;
  };
  Map: {
    new (map: Element, options?: MapOptions): Map;
  };
  Marker: {
    new (options: MarkerOptions): Marker;
  };
};

type GooglePlaces = {
  AutocompleteService: {
    new (): AutocompleteService;
  };
};

// All APIs that are used by the codebase are explicitly cast here.
export type Google = {
  maps: GoogleMaps & {
    places?: GooglePlaces;
  };
};

export function loadGoogleApi(
  apiKey: LoaderOptions["apiKey"],
  libraries: LoaderOptions["libraries"]
) {
  const loader = new Loader({ apiKey, version: "weekly", libraries });
  return loader.load();
}

export default createContext<Google>(null);
