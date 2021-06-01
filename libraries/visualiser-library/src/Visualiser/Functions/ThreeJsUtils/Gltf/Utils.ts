export const getThreeAttributeName = (attribute: string) => {
  switch (attribute) {
    case "POSITION":
      return "position";
    case "NORMAL":
      return "normal";
    case "TANGENT":
      return "tangent";
    case "TEXCOORD_0":
      return "uv";
    case "TEXCOORD_1":
      return "uv2";
    case "COLOR_0":
      return "color";
    case "WEIGHTS_0":
      return "skinWeight";
    case "JOINTS_0":
      return "skinIndex";
    default:
      return undefined;
  }
};

export const WEBGL_COMPONENT_TYPES = {
  5120: Int8Array,
  5121: Uint8Array,
  5122: Int16Array,
  5123: Uint16Array,
  5125: Uint32Array,
  5126: Float32Array
};
