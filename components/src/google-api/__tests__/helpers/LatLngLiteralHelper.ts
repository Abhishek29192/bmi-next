import { LatLngLiteral } from "../../GoogleApi";

const createLatLngLiteral = (
  latLngLiteral?: Partial<LatLngLiteral>
): LatLngLiteral => ({
  lat: 1,
  lng: 1,
  ...latLngLiteral
});

export default createLatLngLiteral;
