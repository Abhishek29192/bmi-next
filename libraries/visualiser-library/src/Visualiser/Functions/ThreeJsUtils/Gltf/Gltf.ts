import { GLTFTile } from "../../../../Types";
import {
  ClampToEdgeWrapping,
  Color,
  FileLoader,
  InterpolateDiscrete,
  InterpolateLinear,
  LinearFilter,
  LinearMipmapLinearFilter,
  LinearMipmapNearestFilter,
  Loader,
  LoaderUtils,
  MirroredRepeatWrapping,
  NearestFilter,
  NearestMipmapLinearFilter,
  NearestMipmapNearestFilter,
  RepeatWrapping,
  Vector2,
  LoadingManager,
  Side
} from "three";
import { DDSLoader } from "three/examples/jsm/loaders/DDSLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader";
import { GLTF } from "./Types";
import { GLTFParser } from "./Parser";
import {
  Extension,
  EXTENSIONS,
  GLTFBinaryExtension,
  GLTFDracoMeshCompressionExtension,
  GLTFLightsExtension,
  GLTFMaterialsClearcoatExtension,
  GLTFMaterialsPbrSpecularGlossinessExtension,
  GLTFMaterialsTransmissionExtension,
  GLTFMaterialsUnlitExtension,
  GLTFMeshQuantizationExtension,
  GLTFTextureBasisUExtension,
  GLTFTextureDDSExtension,
  GLTFTextureTransformExtension
} from "./Extension";

/* BINARY EXTENSION */
const BINARY_EXTENSION_HEADER_MAGIC = "glTF";

class GLTFLoader extends Loader {
  dracoLoader: DRACOLoader | undefined;
  ddsLoader: DDSLoader | undefined;
  ktx2Loader: KTX2Loader | undefined;
  pluginCallbacks: ((parser: GLTFParser) => Extension)[];

  constructor(manager?: LoadingManager) {
    super(manager);

    this.pluginCallbacks = [];

    this.register((parser: GLTFParser) => {
      return new GLTFMaterialsClearcoatExtension(parser);
    });

    this.register((parser: GLTFParser) => {
      return new GLTFTextureBasisUExtension(parser);
    });

    this.register((parser: GLTFParser) => {
      return new GLTFMaterialsTransmissionExtension(parser);
    });

    this.register((parser: GLTFParser) => {
      return new GLTFLightsExtension(parser);
    });
  }

  load(
    url: string,
    onLoad?: (response: GLTFTile) => void,
    onProgress?: (request: ProgressEvent) => void,
    onError?: (event: ErrorEvent) => void
  ) {
    const scope = this;

    let resourcePath: string;

    if (this.resourcePath !== "") {
      resourcePath = this.resourcePath;
    } else if (this.path !== "") {
      resourcePath = this.path;
    } else {
      resourcePath = LoaderUtils.extractUrlBase(url);
    }

    // Tells the LoadingManager to track an extra item, which resolves after
    // the model is fully loaded. This means the count of items loaded will
    // be incorrect, but ensures manager.onLoad() does not fire early.
    this.manager.itemStart(url);

    const _onError = (event: ErrorEvent) => {
      if (onError) {
        onError(event);
      } else {
        console.error(event);
      }

      scope.manager.itemError(url);
      scope.manager.itemEnd(url);
    };

    const loader = new FileLoader(this.manager);

    loader.setPath(this.path);
    loader.setResponseType("arraybuffer");
    loader.setRequestHeader(this.requestHeader);
    loader.setWithCredentials(this.withCredentials);

    loader.load(
      url,
      (data) => {
        try {
          scope.parse(
            data,
            resourcePath,
            (gltf: GLTFTile) => {
              onLoad && onLoad(gltf);

              scope.manager.itemEnd(url);
            },
            _onError
          );
        } catch (error) {
          _onError(error);
        }
      },
      onProgress,
      _onError
    );
  }

  setDRACOLoader(dracoLoader: DRACOLoader) {
    this.dracoLoader = dracoLoader;
    return this;
  }

  setDDSLoader(ddsLoader: DDSLoader) {
    this.ddsLoader = ddsLoader;
    return this;
  }

  setKTX2Loader(ktx2Loader: KTX2Loader) {
    this.ktx2Loader = ktx2Loader;
    return this;
  }

  register(callback: (parser: GLTFParser) => Extension) {
    if (this.pluginCallbacks.indexOf(callback) === -1) {
      this.pluginCallbacks.push(callback);
    }

    return this;
  }

  unregister(callback: (parser: GLTFParser) => Extension) {
    if (this.pluginCallbacks.indexOf(callback) !== -1) {
      this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(callback), 1);
    }

    return this;
  }

  parse(
    data: string | ArrayBuffer,
    path: string,
    onLoad: (gltf: GLTFTile) => void,
    onError: (event: ErrorEvent) => void
  ) {
    let content: string | undefined;
    const extensions: GLTFParser["extensions"] = {};
    const plugins: GLTFParser["plugins"] = {};

    if (typeof data === "string") {
      content = data;
    } else {
      const magic = LoaderUtils.decodeText(new Uint8Array(data, 0, 4));

      if (magic === BINARY_EXTENSION_HEADER_MAGIC) {
        try {
          const glTFBinaryExtension = new GLTFBinaryExtension(data);
          extensions[EXTENSIONS.KHR_BINARY_GLTF] = glTFBinaryExtension;
          content = glTFBinaryExtension.content;
        } catch (error) {
          if (onError) onError(error);
          return;
        }
      } else {
        content = LoaderUtils.decodeText(new Uint8Array(data));
      }
    }

    if (!content) {
      if (onError)
        onError(
          new ErrorEvent("ParseError", {
            error:
              "THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."
          })
        );
      return;
    }

    const json: GLTF = JSON.parse(content);

    if (
      json.asset === undefined ||
      Number.parseInt(json.asset.version[0]) < 2
    ) {
      if (onError)
        onError(
          new ErrorEvent("ParseError", {
            error:
              "THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."
          })
        );
      return;
    }

    // Go through the JSON and add mesh usage indicators:
    if (json && json.nodes && json.nodes.length && json.meshes) {
      const nodes = json.nodes;
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.mesh !== undefined) {
          const mesh = json.meshes[node.mesh];
          if (!mesh.usage) {
            mesh.usage = 1;
          } else {
            mesh.usage++;
          }
        }
      }
    }

    const parser = new GLTFParser(json, {
      path: path || this.resourcePath || "",
      crossOrigin: this.crossOrigin,
      manager: this.manager,
      ktx2Loader: this.ktx2Loader
    });

    parser.fileLoader.setRequestHeader(this.requestHeader);

    for (let i = 0; i < this.pluginCallbacks.length; i++) {
      const plugin = this.pluginCallbacks[i](parser);
      plugins[plugin.name] = plugin;

      // Workaround to avoid determining as unknown extension
      // in addUnknownExtensionsToUserData().
      // Remove this workaround if we move all the existing
      // extension handlers to plugin system
      extensions[plugin.name] = true;
    }

    if (json.extensionsUsed) {
      for (let i = 0; i < json.extensionsUsed.length; ++i) {
        const extensionName = json.extensionsUsed[i];
        const extensionsRequired = json.extensionsRequired || [];

        switch (extensionName) {
          case EXTENSIONS.KHR_MATERIALS_UNLIT:
            extensions[extensionName] = new GLTFMaterialsUnlitExtension();
            break;

          case EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS:
            extensions[extensionName] =
              new GLTFMaterialsPbrSpecularGlossinessExtension();
            break;

          case EXTENSIONS.KHR_DRACO_MESH_COMPRESSION:
            extensions[extensionName] = new GLTFDracoMeshCompressionExtension(
              json,
              this.dracoLoader
            );
            break;

          case EXTENSIONS.MSFT_TEXTURE_DDS:
            extensions[extensionName] = new GLTFTextureDDSExtension(
              this.ddsLoader
            );
            break;

          case EXTENSIONS.KHR_TEXTURE_TRANSFORM:
            extensions[extensionName] = new GLTFTextureTransformExtension();
            break;

          case EXTENSIONS.KHR_MESH_QUANTIZATION:
            extensions[extensionName] = new GLTFMeshQuantizationExtension();
            break;

          default:
            if (
              extensionsRequired.indexOf(extensionName) >= 0 &&
              plugins[extensionName] === undefined
            ) {
              console.warn(
                'THREE.GLTFLoader: Unknown extension "' + extensionName + '".'
              );
            }
        }
      }
    }

    parser.setExtensions(extensions);
    parser.setPlugins(plugins);
    parser.parse(onLoad, onError);
  }

  /*********************************/
  /********** INTERNALS ************/
  /*********************************/

  /* CONSTANTS */

  WEBGL_CONSTANTS = {
    FLOAT: 5126,
    //FLOAT_MAT2: 35674,
    FLOAT_MAT3: 35675,
    FLOAT_MAT4: 35676,
    FLOAT_VEC2: 35664,
    FLOAT_VEC3: 35665,
    FLOAT_VEC4: 35666,
    LINEAR: 9729,
    REPEAT: 10497,
    SAMPLER_2D: 35678,
    POINTS: 0,
    LINES: 1,
    LINE_LOOP: 2,
    LINE_STRIP: 3,
    TRIANGLES: 4,
    TRIANGLE_STRIP: 5,
    TRIANGLE_FAN: 6,
    UNSIGNED_BYTE: 5121,
    UNSIGNED_SHORT: 5123
  };

  WEBGL_FILTERS = {
    9728: NearestFilter,
    9729: LinearFilter,
    9984: NearestMipmapNearestFilter,
    9985: LinearMipmapNearestFilter,
    9986: NearestMipmapLinearFilter,
    9987: LinearMipmapLinearFilter
  };

  WEBGL_WRAPPINGS = {
    33071: ClampToEdgeWrapping,
    33648: MirroredRepeatWrapping,
    10497: RepeatWrapping
  };

  PATH_PROPERTIES = {
    scale: "scale",
    translation: "position",
    rotation: "quaternion",
    weights: "morphTargetInfluences"
  };

  INTERPOLATION = {
    CUBICSPLINE: undefined, // We use a custom interpolant (GLTFCubicSplineInterpolation) for CUBICSPLINE tracks. Each
    // keyframe track will be initialized with a default interpolation type, then modified.
    LINEAR: InterpolateLinear,
    STEP: InterpolateDiscrete
  };

  ALPHA_MODES = {
    OPAQUE: "OPAQUE",
    MASK: "MASK",
    BLEND: "BLEND"
  };
}

export default GLTFLoader;
