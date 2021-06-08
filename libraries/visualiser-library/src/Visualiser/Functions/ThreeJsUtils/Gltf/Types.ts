import { Color, Side, Vector2 } from "three";

export type Cache = { refs: {}; uses: {} };

// TODO: Delete
export type MaterialParams = {
  color?: Color;
  opacity?: number;
  metalness?: number;
  roughness?: number;
  side?: Side;
  transparent?: boolean;
  depthWrite?: boolean;
  alphaTest?: number;
  normalScale?: Vector2;
  aoMapIntensity?: unknown;
  emissive?: Color;
  clearcoat?: unknown;
  clearcoatRoughness?: unknown;
  clearcoatNormalScale?: Vector2;
  transmission?: unknown;
};
