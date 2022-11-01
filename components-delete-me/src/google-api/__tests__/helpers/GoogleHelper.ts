const createMockGoogle = () => ({
  maps: {
    LatLng: class LatLng {
      lat: number;
      lng: number;
      constructor(lat: number, lng: number, noWrap?: boolean) {
        this.lat = lat;
        this.lng = lng;
      }
    } as unknown as typeof google.maps.LatLng,
    geometry: {
      spherical: {
        computeDistanceBetween: jest.fn()
      } as unknown as typeof google.maps.geometry.spherical
    } as unknown as typeof google.maps.geometry
  } as unknown as typeof google.maps
});

export default createMockGoogle;
