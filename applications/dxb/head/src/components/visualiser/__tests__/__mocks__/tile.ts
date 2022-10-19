import { Category, PIMTile } from "../../Types";

const tile: PIMTile = {
  name: "Zanda minster",
  code: "Zanda_minster",
  category: Category.Clay,
  colour: "red",
  normalMapRef: "normal_map_ref",
  metallicRoughnessMapRef: "metallic_roughness_map_ref",
  verticalOverlap: 0.4,
  horizontalOverlap: 0.1,
  horizontalOffset: 0.0,
  highDetailMeshRef: "high_detail_mesh_ref",
  lowDetailMeshRef: "low_detail_mesh_ref",
  diffuseMapRef: "diffuse_map_ref",
  ridgeRef: "ridge_ref",
  ridgeEndRef: "ridge_end_ref",
  snowFenceActive: false,
  isLargeTile: false,
  thicknessReduction: 0,
  invert: false,
  invertY: false,
  mainImage: "https://main_image.png"
};

export default tile;
