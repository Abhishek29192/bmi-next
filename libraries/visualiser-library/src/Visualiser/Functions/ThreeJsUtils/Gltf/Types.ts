import { Attributes } from "react";
import { Color, Side, Vector2 } from "three";

// GLTF Types from https://github.com/KhronosGroup/glTF/tree/master/specification/2.0
export type GLTFExtension = {
  [index: string]: any;
};

export type GLTFAcccessorType =
  | "SCALAR"
  | "VEC2"
  | "VEC3"
  | "VEC4"
  | "MAT2"
  | "MAT3"
  | "MAT4";

export type GLTFAccessor = {
  bufferView?: number;
  /**
   * @default 0
   */
  byteOffset: number;
  componentType: 5120 | 5121 | 5122 | 5123 | 5125 | 5126;
  /**
   * @default false
   */
  normalized?: boolean;
  count: number;
  type: GLTFAcccessorType;
  /**
   * Min 1, max 16.
   */
  max?: number;
  /**
   * Min 1, max 16.
   */
  min?: number;
  sparse?: any;
  name?: string;
  extensions?: GLTFExtension;
  extras?: any;
};

export type GLTFAsset = {
  copyright?: string;
  generator?: string;
  version: string;
  minVersion?: string;
  extensions?: GLTFExtension;
  extras?: any;
};

export type GLTFAttributes = {
  POSITION?: number;
  NORMAL?: number;
  TANGENT?: number;
  TEXCOORD_0?: number;
  TEXCOORD_1?: number;
  COLOR_0?: number;
  WEIGHTS_0?: number;
  JOINTS_0?: number;
};

export type GLTFTarget = {
  POSITION?: number;
  NORMAL?: number;
  TANGENT?: number;
};

export type GLTFPrimitive = {
  attributes: GLTFAttributes;
  indices?: number;
  material?: number;
  /**
   * Valid values:
   * 0 POINTS
   * 1 LINES
   * 2 LINE_LOOP
   * 3 LINE_STRIP
   * 4 TRIANGLES
   * 5 TRIANGLE_STRIP
   * 6 TRIANGLE_FAN
   *
   * @default 4
   */
  mode: number;
  targets?: GLTFTarget[];
  extensions?: GLTFExtension;
  extras?: any;
};

export type GLTFMesh = {
  primitives: GLTFPrimitive[];
  weights?: number[];
  name?: string;
  extensions?: GLTFExtension;
  extras?: any;
};

export type GLTFNode = {
  camera?: number;
  children?: number[];
  skin?: number;
  /**
   * Binary values (0 or 1)
   * Always has a length of 16.
   *
   * @default [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]
   */
  matrix: number[];
  mesh?: number;
  /**
   * Binary values (0 or 1)
   * Always has a length of 4.
   *
   * @default [0,0,0,1]
   */
  rotation: number[];
  /**
   * Binary values (0 or 1)
   * Always has a length of 3.
   *
   * @default [1,1,1]
   */
  scale: number[];
  /**
   * Always has a length of 3.
   *
   * @default [0,0,0]
   */
  translation: number[];
  weights?: number[];
  name?: string;
  extensions?: GLTFExtension;
  extras?: any;
};

export type GLTFBuffer = {
  uri?: string;
  byteLength: number[];
  name?: string;
  extensions?: GLTFExtension;
  extras?: any;
};

export type GLTFBufferView = {
  buffer: number;
  /**
   * @default 0
   */
  byteOffset: number;
  byteLength: number;
  byteStride?: number;
  target?: number;
  name?: string;
  extensions?: GLTFExtension;
  extras?: any;
};

export type GLTFImage = {
  uri?: string;
  /**
   * Required if `bufferView` is defined.
   */
  mimeType?: string;
  bufferView?: number;
  name?: string;
  extensions?: GLTFExtension;
  extras?: any;
};

export type GLTFMaterial = {
  name?: string;
  extensions?: GLTFExtension;
  extras?: any;
  pbrMetallicRoughness?: any;
  normalTexture?: object;
  occlusionTexture?: object;
  emissiveTexture?: object;
  /**
   * Binary values (0 or 1)
   * Always has a length of 3.
   *
   * @default [0,0,0]
   */
  emissiveFactor: number[];
  /**
   * @default "OPAQUE"
   */
  alphaMode: "OPAQUE" | "MASK" | "BLEND";
  /**
   * Minimum of 0
   *
   * @default 0.5
   */
  alphaCutoff: number;
  /**
   * @default false
   */
  doubleSided: boolean;
};

export type GLTFTexture = {
  sampler?: number;
  source?: number;
  name?: string;
  extensions?: GLTFExtension;
  extras?: any;
};

export type GLTF = {
  extensionsUsed?: string[];
  extensionsRequired?: string[];
  accessors?: GLTFAccessor[];
  animations?: unknown[];
  asset: GLTFAsset;
  buffers?: GLTFBuffer[];
  bufferViews?: GLTFBufferView[];
  cameras?: unknown[];
  images?: GLTFImage[];
  materials?: GLTFMaterial[];
  meshes?: GLTFMesh[];
  nodes?: GLTFNode[];
  samplers?: unknown[];
  scene?: number;
  scenes?: unknown[];
  skins?: unknown[];
  textures?: GLTFTexture[];
  extensions?: GLTFExtension;
  extras?: any;
};

export type Cache = { refs: {}; uses: {} };

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
