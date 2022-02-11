import { Scene } from "three";

declare global {
  interface Window {
    scene: Scene;
  }
}

export type Material = "1" | "2" | "3";

export type Colour = {
  tileId: number;
  name: string;
  previewRef: string;
  diffuseMapRef: string;
  normalMapOverrideRef: string;
  metallicRoughnessMapOverrideRef: string;
  revision: number;
  createdUtc: string;
  editedUtc: string;
  id: number;
  revisionId: unknown;
  isDraft: boolean;
  type: string;
  variantCode: string;
};

export type Tile = {
  name: string;
  material: Material;
  normalMapRef: string;
  metallicRoughnessMapRef: string;
  verticalOverlap: number;
  horizontalOverlap: number;
  horizontalOffset: number;
  highDetailMeshRef: string;
  lowDetailMeshRef: string;
  ridgeRef: string;
  ridgeEndRef: string;
  cgiFileName: string;
  productUrl: string;
  snowFenceActive: boolean;
  isLargeTile: boolean;
  revision: number;
  createdUtc: string;
  editedUtc: string;
  id: number;
  colours: Colour[];
  revisionId: unknown;
  isDraft: boolean;
  type: string;
  thicknessReduction?: number;
  invert?: boolean;
  invertY?: boolean;
};

export type Siding = {
  userId: number;
  name: string;
  previewRef: string;
  diffuseMapRef: string;
  normalMapRef: string;
  metallicRoughnessMapRef: string;
  revision: number;
  createdUtc: string;
  editedUtc: string;
  id: number;
  revisionId: unknown;
  isDraft: boolean;
  creatorUser: unknown;
  type: string;
};
