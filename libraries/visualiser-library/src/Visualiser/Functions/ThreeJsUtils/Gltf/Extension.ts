import {
  Color,
  DirectionalLight,
  LoaderUtils,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PointLight,
  SpotLight,
  TangentSpaceNormalMap,
  Vector2,
  Texture,
  MeshStandardMaterialParameters,
  MaterialParameters
} from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { Cache } from "./Types";
import { GLTFParser } from "./Parser";
import { GLTFMeshStandardSGMaterial } from "./Material";
import { getThreeAttributeName, WEBGL_COMPONENT_TYPES } from "./Utils";
import { GlTF, Material, MeshPrimitive } from "./types/gltf";
import { KHRTextureTransformTextureInfoExtension } from "./types/KHR_texture_transform.textureInfo";

export const EXTENSIONS = {
  KHR_BINARY_GLTF: "KHR_binary_glTF",
  KHR_DRACO_MESH_COMPRESSION: "KHR_draco_mesh_compression",
  KHR_LIGHTS_PUNCTUAL: "KHR_lights_punctual",
  KHR_MATERIALS_CLEARCOAT: "KHR_materials_clearcoat",
  KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS: "KHR_materials_pbrSpecularGlossiness",
  KHR_MATERIALS_TRANSMISSION: "KHR_materials_transmission",
  KHR_MATERIALS_UNLIT: "KHR_materials_unlit",
  KHR_TEXTURE_BASISU: "KHR_texture_basisu",
  KHR_TEXTURE_TRANSFORM: "KHR_texture_transform",
  KHR_MESH_QUANTIZATION: "KHR_mesh_quantization",
  MSFT_TEXTURE_DDS: "MSFT_texture_dds"
};

export abstract class Extension {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

/**
 * DDS Texture Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/MSFT_texture_dds
 *
 */
export class GLTFTextureDDSExtension extends Extension {
  ddsLoader: unknown;

  constructor(ddsLoader: unknown) {
    super(EXTENSIONS.MSFT_TEXTURE_DDS);
    if (!ddsLoader) {
      throw new Error(
        "THREE.GLTFLoader: Attempting to load .dds texture without importing DDSLoader"
      );
    }
    this.ddsLoader = ddsLoader;
  }
}

/**
 * Punctual Lights Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_lights_punctual
 */
export class GLTFLightsExtension extends Extension {
  parser: GLTFParser;
  cache: Cache;

  constructor(parser: GLTFParser) {
    super(EXTENSIONS.KHR_LIGHTS_PUNCTUAL);
    this.parser = parser;

    // Object3D instance caches
    this.cache = { refs: {}, uses: {} };
  }

  _markDefs() {
    const parser = this.parser;
    const nodeDefs = this.parser.json.nodes || [];

    for (
      let nodeIndex = 0, nodeLength = nodeDefs.length;
      nodeIndex < nodeLength;
      nodeIndex++
    ) {
      const nodeDef = nodeDefs[nodeIndex];

      if (
        nodeDef.extensions &&
        nodeDef.extensions[this.name] &&
        nodeDef.extensions[this.name].light !== undefined
      ) {
        parser._addNodeRef(this.cache, nodeDef.extensions[this.name].light);
      }
    }
  }

  _loadLight(lightIndex: any) {
    const parser = this.parser;
    const cacheKey = "light:" + lightIndex;
    let dependency = parser.lightCache.get(cacheKey);

    if (dependency) return dependency;

    const json = parser.json;
    const extensions = (json.extensions && json.extensions[this.name]) || {};
    const lightDefs = extensions.lights || [];
    const lightDef = lightDefs[lightIndex];
    let lightNode;

    const color = new Color(0xffffff);

    if (lightDef.color !== undefined) color.fromArray(lightDef.color);

    const range = lightDef.range !== undefined ? lightDef.range : 0;

    switch (lightDef.type) {
      case "directional":
        lightNode = new DirectionalLight(color);
        lightNode.target.position.set(0, 0, -1);
        lightNode.add(lightNode.target);
        break;

      case "point":
        lightNode = new PointLight(color);
        lightNode.distance = range;
        break;

      case "spot":
        lightNode = new SpotLight(color);
        lightNode.distance = range;
        // Handle spotlight properties.
        lightDef.spot = lightDef.spot || {};
        lightDef.spot.innerConeAngle =
          lightDef.spot.innerConeAngle !== undefined
            ? lightDef.spot.innerConeAngle
            : 0;
        lightDef.spot.outerConeAngle =
          lightDef.spot.outerConeAngle !== undefined
            ? lightDef.spot.outerConeAngle
            : Math.PI / 4.0;
        lightNode.angle = lightDef.spot.outerConeAngle;
        lightNode.penumbra =
          1.0 - lightDef.spot.innerConeAngle / lightDef.spot.outerConeAngle;
        lightNode.target.position.set(0, 0, -1);
        lightNode.add(lightNode.target);
        break;

      default:
        throw new Error(
          'THREE.GLTFLoader: Unexpected light type, "' + lightDef.type + '".'
        );
    }

    // Some lights (e.g. spot) default to a position other than the origin. Reset the position
    // here, because node-level parsing will only override position if explicitly specified.
    lightNode.position.set(0, 0, 0);

    "decay" in lightNode && (lightNode.decay = 2);

    if (lightDef.intensity !== undefined)
      lightNode.intensity = lightDef.intensity;

    lightNode.name = parser.createUniqueName(
      lightDef.name || "light_" + lightIndex
    );

    parser.lightCache.add(cacheKey, lightNode);

    return lightNode;
  }

  createNodeAttachment(nodeIndex: number) {
    const self = this;
    const parser = this.parser;
    const json = parser.json;
    const nodeDef = json.nodes?.[nodeIndex];
    const lightDef: any = nodeDef?.extensions && nodeDef.extensions[this.name];
    const lightIndex =
      lightDef && "light" in lightDef ? lightDef["light"] : undefined;

    if (lightIndex === undefined) return null;

    const light = this._loadLight(lightIndex);
    return parser._getNodeRef(self.cache, lightIndex, light);
  }
}

/**
 * Unlit Materials Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_unlit
 */
export class GLTFMaterialsUnlitExtension extends Extension {
  constructor() {
    super(EXTENSIONS.KHR_MATERIALS_UNLIT);
  }

  getMaterialType() {
    return MeshBasicMaterial;
  }

  extendParams(
    materialParams: MaterialParameters,
    parser: GLTFParser,
    materialDef?: Material
  ) {
    const pending = [];

    materialParams.color = new Color(1.0, 1.0, 1.0);
    materialParams.opacity = 1.0;

    const metallicRoughness = materialDef?.pbrMetallicRoughness;

    if (metallicRoughness) {
      if (
        "baseColorFactor" in metallicRoughness &&
        Array.isArray(metallicRoughness["baseColorFactor"])
      ) {
        const array = metallicRoughness["baseColorFactor"];

        materialParams.color.fromArray(array);
        materialParams.opacity = array[3];
      }

      if (
        "baseColorTexture" in metallicRoughness &&
        metallicRoughness["baseColorTexture"] !== undefined
      ) {
        pending.push(
          parser.assignTexture(
            materialParams,
            "map",
            metallicRoughness["baseColorTexture"]
          )
        );
      }
    }

    return Promise.all(pending);
  }
}

/**
 * Clearcoat Materials Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_clearcoat
 */
export class GLTFMaterialsClearcoatExtension extends Extension {
  parser: GLTFParser;

  constructor(parser: GLTFParser) {
    super(EXTENSIONS.KHR_MATERIALS_CLEARCOAT);
    this.parser = parser;
  }

  getMaterialType(materialIndex: number) {
    const parser = this.parser;
    const materialDef = parser.json.materials?.[materialIndex];

    if (!materialDef?.extensions?.[this.name]) return null;

    return MeshPhysicalMaterial;
  }

  extendMaterialParams(
    materialIndex: number,
    materialParams: MaterialParameters
  ) {
    const parser = this.parser;
    const materialDef = parser.json.materials?.[materialIndex];

    if (!materialDef?.extensions?.[this.name]) {
      return Promise.resolve();
    }

    const pending = [];

    const extension = materialDef.extensions[this.name];

    if (extension.clearcoatFactor !== undefined) {
      materialParams.clearcoat = extension.clearcoatFactor;
    }

    if (extension.clearcoatTexture !== undefined) {
      pending.push(
        parser.assignTexture(
          materialParams,
          "clearcoatMap",
          extension.clearcoatTexture
        )
      );
    }

    if (extension.clearcoatRoughnessFactor !== undefined) {
      materialParams.clearcoatRoughness = extension.clearcoatRoughnessFactor;
    }

    if (extension.clearcoatRoughnessTexture !== undefined) {
      pending.push(
        parser.assignTexture(
          materialParams,
          "clearcoatRoughnessMap",
          extension.clearcoatRoughnessTexture
        )
      );
    }

    if (extension.clearcoatNormalTexture !== undefined) {
      pending.push(
        parser.assignTexture(
          materialParams,
          "clearcoatNormalMap",
          extension.clearcoatNormalTexture
        )
      );

      if (extension.clearcoatNormalTexture.scale !== undefined) {
        const scale = extension.clearcoatNormalTexture.scale;

        materialParams.clearcoatNormalScale = new Vector2(scale, scale);
      }
    }

    return Promise.all(pending);
  }
}

/**
 * Transmission Materials Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_transmission
 * Draft: https://github.com/KhronosGroup/glTF/pull/1698
 */
export class GLTFMaterialsTransmissionExtension extends Extension {
  parser: GLTFParser;

  constructor(parser: GLTFParser) {
    super(EXTENSIONS.KHR_MATERIALS_TRANSMISSION);
    this.parser = parser;
  }

  getMaterialType(materialIndex: number) {
    const parser = this.parser;
    const materialDef = parser.json.materials?.[materialIndex];

    if (!materialDef?.extensions?.[this.name]) return null;

    return MeshPhysicalMaterial;
  }

  extendMaterialParams(
    materialIndex: number,
    materialParams: MaterialParameters
  ) {
    const parser = this.parser;
    const materialDef = parser.json.materials?.[materialIndex];

    if (!materialDef?.extensions?.[this.name]) {
      return Promise.resolve();
    }

    const pending = [];

    const extension = materialDef.extensions[this.name];

    // https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_transmission
    if (extension.transmissionFactor !== undefined) {
      materialParams.transmission = extension.transmissionFactor;
    }

    if (extension.transmissionTexture !== undefined) {
      pending.push(
        parser.assignTexture(
          materialParams,
          "transmissionMap",
          extension.transmissionTexture
        )
      );
    }

    return Promise.all(pending);
  }
}

/**
 * BasisU Texture Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_texture_basisu
 * (draft PR https://github.com/KhronosGroup/glTF/pull/1751)
 */
export class GLTFTextureBasisUExtension extends Extension {
  parser: GLTFParser;

  constructor(parser: GLTFParser) {
    super(EXTENSIONS.KHR_TEXTURE_BASISU);
    this.parser = parser;
  }

  loadTexture(textureIndex: number) {
    const parser = this.parser;
    const json = parser.json;

    const textureDef = json.textures?.[textureIndex];

    if (!textureDef?.extensions?.[this.name]) {
      return null;
    }

    const extension = textureDef.extensions[this.name];
    const source = json.images?.[extension.source];
    const loader = parser.options.ktx2Loader;

    if (!loader) {
      throw new Error(
        "THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures"
      );
    }

    if (!source) {
      throw new Error("THREE.GLTFLoader: the texture is missing");
    }

    return parser.loadTextureImage(textureIndex, source, loader);
  }
}

/* BINARY EXTENSION */
export const BINARY_EXTENSION_HEADER_MAGIC = "glTF";

export class GLTFBinaryExtension extends Extension {
  content?: string;
  body?: ArrayBuffer;
  header: {
    magic: string;
    version: number;
    length: number;
  };

  BINARY_EXTENSION_CHUNK_TYPES = { JSON: 0x4e4f534a, BIN: 0x004e4942 };
  BINARY_EXTENSION_HEADER_LENGTH = 12;

  constructor(data: ArrayBuffer) {
    super(EXTENSIONS.KHR_BINARY_GLTF);

    const headerView = new DataView(
      data,
      0,
      this.BINARY_EXTENSION_HEADER_LENGTH
    );

    this.header = {
      magic: LoaderUtils.decodeText(new Uint8Array(data.slice(0, 4))),
      version: headerView.getUint32(4, true),
      length: headerView.getUint32(8, true)
    };

    if (this.header.magic !== BINARY_EXTENSION_HEADER_MAGIC) {
      throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");
    } else if (this.header.version < 2.0) {
      throw new Error("THREE.GLTFLoader: Legacy binary file detected.");
    }

    const chunkView = new DataView(data, this.BINARY_EXTENSION_HEADER_LENGTH);
    let chunkIndex = 0;

    while (chunkIndex < chunkView.byteLength) {
      const chunkLength = chunkView.getUint32(chunkIndex, true);
      chunkIndex += 4;

      const chunkType = chunkView.getUint32(chunkIndex, true);
      chunkIndex += 4;

      if (chunkType === this.BINARY_EXTENSION_CHUNK_TYPES.JSON) {
        const contentArray = new Uint8Array(
          data,
          this.BINARY_EXTENSION_HEADER_LENGTH + chunkIndex,
          chunkLength
        );
        this.content = LoaderUtils.decodeText(contentArray);
      } else if (chunkType === this.BINARY_EXTENSION_CHUNK_TYPES.BIN) {
        const byteOffset = this.BINARY_EXTENSION_HEADER_LENGTH + chunkIndex;
        this.body = data.slice(byteOffset, byteOffset + chunkLength);
      }

      // Clients must ignore chunks with unknown types.

      chunkIndex += chunkLength;
    }

    if (this.content === null) {
      throw new Error("THREE.GLTFLoader: JSON content not found.");
    }
  }
}

/**
 * DRACO Mesh Compression Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_draco_mesh_compression
 */
export class GLTFDracoMeshCompressionExtension extends Extension {
  json: GlTF;
  dracoLoader: DRACOLoader;
  constructor(json: GlTF, dracoLoader: DRACOLoader) {
    super(EXTENSIONS.KHR_DRACO_MESH_COMPRESSION);
    if (!dracoLoader) {
      throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");
    }

    this.json = json;
    this.dracoLoader = dracoLoader;
    this.dracoLoader.preload();
  }

  decodePrimitive(primitive: MeshPrimitive, parser: GLTFParser) {
    const json = this.json;
    const dracoLoader = this.dracoLoader;
    const bufferViewIndex: number | undefined =
      primitive.extensions?.[this.name].bufferView;
    const gltfAttributeMap = primitive.extensions?.[this.name].attributes;
    const threeAttributeMap = new Map<string, string>();
    const attributeNormalizedMap = new Map<string, boolean>();
    const attributeTypeMap = new Map<
      string,
      | Uint8ArrayConstructor
      | Int8ArrayConstructor
      | Int16ArrayConstructor
      | Uint16ArrayConstructor
      | Uint32ArrayConstructor
      | Float32ArrayConstructor
      | undefined
    >();

    for (const attributeName in gltfAttributeMap) {
      const threeAttributeName =
        getThreeAttributeName(attributeName) || attributeName.toLowerCase();

      threeAttributeMap.set(
        threeAttributeName,
        gltfAttributeMap[attributeName]
      );
    }

    Object.entries(primitive.attributes).forEach(
      ([attributeName, attributeValue]) => {
        const threeAttributeName =
          getThreeAttributeName(attributeName) || attributeName.toLowerCase();

        if (gltfAttributeMap[attributeName] !== undefined) {
          const attributeIndex = attributeValue;
          const accessorDef = attributeIndex
            ? json.accessors?.[attributeIndex]
            : undefined;
          const componentType =
            accessorDef?.componentType &&
            WEBGL_COMPONENT_TYPES[accessorDef.componentType];

          attributeTypeMap.set(threeAttributeName, componentType);
          attributeNormalizedMap.set(
            threeAttributeName,
            accessorDef?.normalized === true
          );
        }
      }
    );

    return parser
      .getBufferViewDependency(bufferViewIndex)
      ?.then((bufferView) => {
        return new Promise((resolve) => {
          dracoLoader.load(
            bufferView,
            (geometry) => {
              for (const attributeName in geometry.attributes) {
                const attribute = geometry.attributes[attributeName];
                const normalized = attributeNormalizedMap.get(attributeName);

                if (normalized !== undefined) attribute.normalized = normalized;
              }

              resolve(geometry);
            },
            threeAttributeMap,
            attributeTypeMap
          );
        });
      });
  }
}

/**
 * Texture Transform Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_texture_transform
 */
export class KHRTextureTransformExtension extends Extension {
  constructor() {
    super(EXTENSIONS.KHR_TEXTURE_TRANSFORM);
  }

  extendTexture(
    texture: Texture,
    transform: KHRTextureTransformTextureInfoExtension
  ) {
    texture = texture.clone();

    if (transform.offset !== undefined) {
      texture.offset.fromArray(transform.offset);
    }

    if (transform.rotation !== undefined) {
      texture.rotation = transform.rotation;
    }

    if (transform.scale !== undefined) {
      texture.repeat.fromArray(transform.scale);
    }

    if (transform.texCoord !== undefined) {
      console.warn(
        'THREE.GLTFLoader: Custom UV sets in "' +
          this.name +
          '" extension not yet supported.'
      );
    }

    texture.needsUpdate = true;

    return texture;
  }
}

/**
 * Specular-Glossiness Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_pbrSpecularGlossiness
 */
export class GLTFMaterialsPbrSpecularGlossinessExtension extends Extension {
  constructor() {
    super(EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS);
  }

  specularGlossinessParams = [
    "color",
    "map",
    "lightMap",
    "lightMapIntensity",
    "aoMap",
    "aoMapIntensity",
    "emissive",
    "emissiveIntensity",
    "emissiveMap",
    "bumpMap",
    "bumpScale",
    "normalMap",
    "normalMapType",
    "displacementMap",
    "displacementScale",
    "displacementBias",
    "specularMap",
    "specular",
    "glossinessMap",
    "glossiness",
    "alphaMap",
    "envMap",
    "envMapIntensity",
    "refractionRatio"
  ];

  getMaterialType() {
    return GLTFMeshStandardSGMaterial;
  }

  extendParams(
    materialParams: MaterialParameters,
    parser: GLTFParser,
    materialDef?: Material
  ) {
    const pbrSpecularGlossiness = materialDef?.extensions?.[this.name];

    materialParams.color = new Color(1.0, 1.0, 1.0);
    materialParams.opacity = 1.0;

    const pending = [];

    if (Array.isArray(pbrSpecularGlossiness.diffuseFactor)) {
      const array = pbrSpecularGlossiness.diffuseFactor;

      materialParams.color.fromArray(array);
      materialParams.opacity = array[3];
    }

    if (pbrSpecularGlossiness.diffuseTexture !== undefined) {
      pending.push(
        parser.assignTexture(
          materialParams,
          "map",
          pbrSpecularGlossiness.diffuseTexture
        )
      );
    }

    materialParams.emissive = new Color(0.0, 0.0, 0.0);
    materialParams.glossiness =
      pbrSpecularGlossiness.glossinessFactor !== undefined
        ? pbrSpecularGlossiness.glossinessFactor
        : 1.0;
    materialParams.specular = new Color(1.0, 1.0, 1.0);

    if (Array.isArray(pbrSpecularGlossiness.specularFactor)) {
      materialParams.specular.fromArray(pbrSpecularGlossiness.specularFactor);
    }

    if (pbrSpecularGlossiness.specularGlossinessTexture !== undefined) {
      const specGlossMapDef = pbrSpecularGlossiness.specularGlossinessTexture;
      pending.push(
        parser.assignTexture(materialParams, "glossinessMap", specGlossMapDef)
      );
      pending.push(
        parser.assignTexture(materialParams, "specularMap", specGlossMapDef)
      );
    }

    return Promise.all(pending);
  }

  createMaterial(materialParams: MeshStandardMaterialParameters) {
    const material = new GLTFMeshStandardSGMaterial(materialParams);
    material.fog = true;

    material.color = materialParams.color;

    material.map = materialParams.map === undefined ? null : materialParams.map;

    material.lightMap = null;
    material.lightMapIntensity = 1.0;

    material.aoMap =
      materialParams.aoMap === undefined ? null : materialParams.aoMap;
    material.aoMapIntensity = 1.0;

    material.emissive = materialParams.emissive;
    material.emissiveIntensity = 1.0;
    material.emissiveMap =
      materialParams.emissiveMap === undefined
        ? null
        : materialParams.emissiveMap;

    material.bumpMap =
      materialParams.bumpMap === undefined ? null : materialParams.bumpMap;
    material.bumpScale = 1;

    material.normalMap =
      materialParams.normalMap === undefined ? null : materialParams.normalMap;
    material.normalMapType = TangentSpaceNormalMap;

    if (materialParams.normalScale)
      material.normalScale = materialParams.normalScale;

    material.displacementMap = null;
    material.displacementScale = 1;
    material.displacementBias = 0;

    material.specularMap =
      materialParams.specularMap === undefined
        ? null
        : materialParams.specularMap;
    material.specular = materialParams.specular;

    material.glossinessMap =
      materialParams.glossinessMap === undefined
        ? null
        : materialParams.glossinessMap;
    material.glossiness = materialParams.glossiness;

    material.alphaMap = null;

    material.envMap =
      materialParams.envMap === undefined ? null : materialParams.envMap;
    material.envMapIntensity = 1.0;

    material.refractionRatio = 0.98;

    return material;
  }
}

/**
 * Mesh Quantization Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_mesh_quantization
 */
export class GLTFMeshQuantizationExtension extends Extension {
  constructor() {
    super(EXTENSIONS.KHR_MESH_QUANTIZATION);
  }
}

export class FakeExtension extends Extension {
  constructor() {
    super("FAKE EXTENSION");
  }
}
