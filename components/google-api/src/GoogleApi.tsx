import { Loader, LoaderOptions } from "@googlemaps/js-api-loader";
import { createContext } from "react";

export type AutocompletePrediction = google.maps.places.AutocompletePrediction;
export type AutocompletionRequest = google.maps.places.AutocompletionRequest;
export type AutocompleteService = google.maps.places.AutocompleteService;
export type Geocoder = google.maps.Geocoder;
export type GeocoderRequest = google.maps.GeocoderRequest;
export type GeocoderResult = google.maps.GeocoderResult;
export type LatLngLiteral = google.maps.LatLngLiteral;
export type LatLngBounds = google.maps.LatLngBounds;
export type LatLngBoundsLiteral = google.maps.LatLngBoundsLiteral;
export type Map = google.maps.Map;
export type MapOptions = google.maps.MapOptions;
export type Marker = google.maps.Marker;
export type MarkerOptions = google.maps.MarkerOptions;
export type MarkerOptionsWithId = google.maps.MarkerOptions & {
  id: string;
};
export type Point = google.maps.Point;

/* global google */
export type Google = typeof google;

export function loadGoogleApi(
  apiKey: LoaderOptions["apiKey"],
  libraries: LoaderOptions["libraries"]
) {
  const loader = new Loader({ apiKey, version: "weekly", libraries });
  return loader.load();
}

export default createContext<Google>(null);
