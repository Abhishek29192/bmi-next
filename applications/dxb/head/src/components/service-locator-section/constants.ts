// istanbul ignore file: doesn't hold any logic
export const EVENT_CAT_ID_LINK_CLICKS = "cta-click1";
// TODO: Maybe calculate this from `range`?
export const PLACE_LEVEL_ZOOM = 8;
export const PAGE_SIZE = 24;

export const DEFAULT_LEVEL_ZOOM = 5;
export const QUERY_CHIP_FILTER_KEY = "chip";
export const EVENT_CAT_ID_SELECTOR_CARDS = "selector-cards6";
export const EVENT_CAT_ID_SELECTOR_CARDS_MAP_PIN = "selector-cards6-map-pin";

const radius = 50; // @todo: To come from CMS.
export const FILTER_RADIUS = radius ? radius * 1000 : Infinity;
export const DEFAULT_MAP_CENTRE = {
  lat: 60.47202399999999,
  lng: 8.468945999999999
};
