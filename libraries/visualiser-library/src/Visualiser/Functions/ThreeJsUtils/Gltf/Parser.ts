import { GLTFTile } from "../../../../Types";
import {
  AnimationClip,
  Bone,
  Box3,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DoubleSide,
  FileLoader,
  FrontSide,
  Group,
  ImageBitmapLoader,
  InterleavedBuffer,
  InterleavedBufferAttribute,
  InterpolateLinear,
  Line,
  LineBasicMaterial,
  LineLoop,
  LineSegments,
  LinearFilter,
  LinearMipmapLinearFilter,
  Material,
  MathUtils,
  Matrix4,
  Mesh,
  InstancedMesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  NumberKeyframeTrack,
  Object3D,
  OrthographicCamera,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  QuaternionKeyframeTrack,
  RGBFormat,
  RepeatWrapping,
  Skeleton,
  SkinnedMesh,
  Sphere,
  TextureLoader,
  TriangleFanDrawMode,
  TriangleStripDrawMode,
  Vector2,
  Vector3,
  VectorKeyframeTrack,
  sRGBEncoding,
  LoadingManager,
  MaterialParameters,
  Scene,
  Camera,
  Texture,
  Light
} from "three";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader";
import { Cache } from "./Types";
import { GLTFCubicSplineInterpolant } from "./Interpolant";
import {
  BufferViewCache,
  LightCache,
  MaterialCache,
  PointsMaterialCache,
  TextureCache
} from "./Cache";
import {
  Extension,
  EXTENSIONS,
  GLTFBinaryExtension,
  GLTFMaterialsPbrSpecularGlossinessExtension,
  GLTFMaterialsUnlitExtension,
  GLTFTextureDDSExtension,
  KHRTextureTransformExtension
} from "./Extension";
import { WEBGL_COMPONENT_TYPES } from "./Utils";
import { GlTF, Image, MeshPrimitive } from "./types/gltf";
import { KHRTextureTransformTextureInfoExtension } from "./types/KHR_texture_transform.textureInfo";

type Options = {
  path: string;
  crossOrigin: string;
  manager: LoadingManager;
  ktx2Loader: KTX2Loader;
};

export class GLTFParser {
  json: GlTF;
  extensions: {
    [index: string]: Extension | undefined;
  };
  plugins: {
    [index: string]: Extension | GLTFParser | undefined;
  };
  options: Options;
  bufferViewCache = new BufferViewCache();
  lightCache = new LightCache();
  materialCache = new MaterialCache();
  pointsMaterialCache = new PointsMaterialCache();
  textureCache = new TextureCache();
  associations: Map;
  primitiveCache: unknown;
  meshCache: Cache;
  cameraCache: Cache;
  nodeNamesUsed: unknown;
  textureLoader: ImageBitmapLoader | TextureLoader;
  fileLoader: FileLoader;

  WEBGL_TYPE_SIZES = {
    SCALAR: 1,
    VEC2: 2,
    VEC3: 3,
    VEC4: 4,
    MAT2: 4,
    MAT3: 9,
    MAT4: 16
  };

  constructor(json: any, options: Options) {
    this.json = json || {};
    this.extensions = {};
    this.plugins = {};
    this.options = options;

    // loader object cache
    this.bufferViewCache = new BufferViewCache();
    this.pointsMaterialCache = new PointsMaterialCache();
    this.lightCache = new LightCache();

    // associations between Three.js objects and glTF elements
    this.associations = new Map();

    // BufferGeometry caching
    this.primitiveCache = {};

    // Object3D instance caches
    this.meshCache = { refs: {}, uses: {} };
    this.cameraCache = { refs: {}, uses: {} };

    // Track node names, to ensure no duplicates
    this.nodeNamesUsed = {};

    // Use an ImageBitmapLoader if imageBitmaps are supported. Moves much of the
    // expensive work of uploading a texture to the GPU off the main thread.
    if (
      typeof createImageBitmap !== "undefined" &&
      /Firefox/.test(navigator.userAgent) === false
    ) {
      this.textureLoader = new ImageBitmapLoader(this.options.manager);
    } else {
      this.textureLoader = new TextureLoader(this.options.manager);
    }

    this.textureLoader.setCrossOrigin(this.options.crossOrigin);

    this.fileLoader = new FileLoader(this.options.manager);
    this.fileLoader.setResponseType("arraybuffer");

    if (this.options.crossOrigin === "use-credentials") {
      this.fileLoader.setWithCredentials(true);
    }
  }

  setExtensions(extensions: GLTFParser["extensions"]) {
    this.extensions = extensions;
  }

  setPlugins(plugins: GLTFParser["plugins"]) {
    this.plugins = plugins;
  }

  parse(
    onLoad: (gltf: GLTFTile) => void,
    onError: (event: ErrorEvent) => void
  ) {
    const parser = this;
    const json = this.json;
    const extensions = this.extensions;

    // Clear the loader cache
    this.bufferViewCache.removeAll();
    this.pointsMaterialCache.removeAll();

    // Mark the special nodes/meshes in json for efficient parse
    this._invokeAll((ext) => {
      return ext._markDefs && ext._markDefs();
    });

    Promise.all([
      this.getDependencies("scene") as Promise<Array<Scene>>,
      this.getDependencies("animation") as Promise<Array<unknown>>,
      this.getDependencies("camera") as Promise<Array<Camera>>
    ])
      .then((dependencies) => {
        const result: GLTFTile = {
          scene: dependencies[0][json.scene || 0],
          scenes: dependencies[0],
          animations: dependencies[1],
          cameras: dependencies[2],
          asset: json.asset,
          parser: parser,
          userData: {}
        };

        addUnknownExtensionsToUserData(extensions, result, json);

        assignExtrasToUserData(result, json);

        onLoad(result);
      })
      .catch(onError);
  }

  /**
   * Marks the special nodes/meshes in json for efficient parse.
   */
  _markDefs() {
    const nodeDefs = this.json.nodes || [];
    const skinDefs = this.json.skins || [];
    const meshDefs = this.json.meshes || [];

    // Nothing in the node definition indicates whether it is a Bone or an
    // Object3D. Use the skins' joint references to mark bones.
    for (
      let skinIndex = 0, skinLength = skinDefs.length;
      skinIndex < skinLength;
      skinIndex++
    ) {
      const joints = skinDefs[skinIndex].joints;

      for (let i = 0, il = joints.length; i < il; i++) {
        nodeDefs[joints[i]].isBone = true;
      }
    }

    // Iterate over all nodes, marking references to shared resources,
    // as well as skeleton joints.
    for (
      let nodeIndex = 0, nodeLength = nodeDefs.length;
      nodeIndex < nodeLength;
      nodeIndex++
    ) {
      const nodeDef = nodeDefs[nodeIndex];

      if (nodeDef.mesh !== undefined) {
        this._addNodeRef(this.meshCache, nodeDef.mesh);

        // Nothing in the mesh definition indicates whether it is
        // a SkinnedMesh or Mesh. Use the node's mesh reference
        // to mark SkinnedMesh if node has skin.
        if (nodeDef.skin !== undefined) {
          meshDefs[nodeDef.mesh].isSkinnedMesh = true;
        }
      }

      if (nodeDef.camera !== undefined) {
        this._addNodeRef(this.cameraCache, nodeDef.camera);
      }
    }
  }

  /**
   * Counts references to shared node / Object3D resources. These resources
   * can be reused, or "instantiated", at multiple nodes in the scene
   * hierarchy. Mesh, Camera, and Light instances are instantiated and must
   * be marked. Non-scenegraph resources (like Materials, Geometries, and
   * Textures) can be reused directly and are not marked here.
   *
   * Example: CesiumMilkTruck sample model reuses "Wheel" meshes.
   */
  _addNodeRef(cache: Cache, index: any) {
    if (index === undefined) return;

    if (cache.refs[index] === undefined) {
      cache.refs[index] = cache.uses[index] = 0;
    }

    cache.refs[index]++;
  }

  /** Returns a reference to a shared resource, cloning it if necessary. */
  _getNodeRef(cache: Cache, index, object: Light | Mesh | Camera) {
    if (cache.refs[index] <= 1) return object;

    const ref = object.clone();

    ref.name += "_instance_" + cache.uses[index]++;

    return ref;
  }

  _invokeOne<T>(
    func: (ext: Extension | GLTFParser | undefined) => T
  ): T | undefined {
    const extensions = Object.values(this.plugins);
    extensions.push(this);

    for (let i = 0; i < extensions.length; i++) {
      const result = func(extensions[i]);

      if (result) return result;
    }
  }

  _invokeAll<T>(func: (ext: Extension | GLTFParser | undefined) => T): T[] {
    const extensions = Object.values(this.plugins);
    extensions.unshift(this);

    const pending: T[] = [];

    for (let i = 0; i < extensions.length; i++) {
      const result = func(extensions[i]);

      if (result) pending.push(result);
    }

    return pending;
  }

  getBufferView(index: number): Promise<ArrayBuffer> | undefined {
    const cacheKey = `bufferView:${index}`;
    const cachedBufferView = this.bufferViewCache.get(cacheKey);
    if (cachedBufferView) {
      return cachedBufferView;
    }
    const bufferView = this._invokeOne((ext) => {
      return (
        (ext &&
          "loadBufferView" in ext &&
          ext.loadBufferView &&
          ext.loadBufferView(index)) ||
        undefined
      );
    });

    bufferView && this.bufferViewCache.add(cacheKey, bufferView);
    return bufferView;
  }

  getBufferViewDependency(index: number): Promise<ArrayBuffer> | undefined {
    const cacheKey = `bufferView:${index}`;
    let dependency = this.bufferViewCache.get(cacheKey);
    if (dependency) {
      return dependency;
    }
    dependency = this._invokeOne((ext) => {
      return (
        (ext &&
          "loadBufferView" in ext &&
          ext.loadBufferView &&
          ext.loadBufferView(index)) ||
        undefined
      );
    });
    dependency && this.bufferViewCache.add(cacheKey, dependency);
    return dependency;
  }

  getMaterialDependency(index: number): Promise<Material> | undefined {
    const cacheKey = `material:${index}`;
    let dependency = this.materialCache.get(cacheKey);
    if (dependency) {
      return dependency;
    }
    dependency = this._invokeOne((ext) => {
      return (
        (ext &&
          "loadMaterial" in ext &&
          ext.loadMaterial &&
          ext.loadMaterial(index)) ||
        undefined
      );
    });
    dependency && this.materialCache.add(cacheKey, dependency);
    return dependency;
  }

  getTextureDependency(index: number): Promise<Texture> | undefined {
    const cacheKey = `texture:${index}`;
    let dependency = this.textureCache.get(cacheKey);
    if (dependency) {
      return dependency;
    }
    dependency = this._invokeOne((ext) => {
      return (
        (ext &&
          "loadTexture" in ext &&
          ext.loadTexture &&
          ext.loadTexture(index)) ||
        undefined
      );
    });
    dependency && this.textureCache.add(cacheKey, dependency);
    return dependency;
  }

  /**
   * Requests the specified dependency asynchronously, with caching.
   * @deprecated
   * @param {string} type
   * @param {number} index
   * @return {Promise<Object3D|Material|THREE.Texture|AnimationClip|ArrayBuffer|Object>}
   */
  getDependency(
    type: string,
    index: number
  ):
    | Promise<
        | Object3D
        | Material
        | THREE.Texture
        | AnimationClip
        | ArrayBuffer
        | Object
      >
    | MeshStandardMaterial
    | undefined {
    const cacheKey = type + ":" + index;
    let dependency = this.cache.get(cacheKey);

    if (!dependency) {
      switch (type) {
        case "scene":
          dependency = this.loadScene(index);
          break;

        case "node":
          dependency = this.loadNode(index);
          break;

        case "mesh":
          dependency = this._invokeOne((ext) => {
            return (
              (ext &&
                "loadMesh" in ext &&
                ext.loadMesh &&
                ext.loadMesh(index)) ||
              undefined
            );
          });
          break;

        case "accessor":
          dependency = this.loadAccessor(index);
          break;

        case "buffer":
          dependency = this.loadBuffer(index);
          break;

        case "skin":
          dependency = this.loadSkin(index);
          break;

        case "animation":
          dependency = this.loadAnimation(index);
          break;

        case "camera":
          dependency = this.loadCamera(index);
          break;

        default:
          throw new Error("Unknown type: " + type);
      }

      dependency && this.cache.addPromise(cacheKey, dependency);
    }

    return dependency;
  }

  /**
   * Requests all dependencies of the specified type asynchronously, with caching.
   * @param {string} type
   * @return {Promise<Array<Object>>}
   */
  getDependencies(
    type: string
  ):
    | Promise<
        Object | Object3D | Material | Texture | AnimationClip | ArrayBuffer
      >
    | MeshStandardMaterial {
    let dependencies = this.cache.get(type);

    if (!dependencies) {
      const parser = this;
      const defs: string[] =
        this.json[type + (type === "mesh" ? "es" : "s")] || [];

      dependencies = Promise.all(
        defs.map((def: string, index: number) => {
          return parser.getDependency(type, index);
        })
      );

      this.cache.add(type, dependencies);
    }

    return dependencies;
  }

  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
   * @param {number} bufferIndex
   * @return {Promise<ArrayBuffer>}
   */
  loadBuffer(bufferIndex: number): Promise<ArrayBuffer> {
    const bufferDef = this.json.buffers?.[bufferIndex];
    const loader = this.fileLoader;

    if (!bufferDef) {
      throw new Error("THREE.GLTFLoader: buffer type is not supported.");
    }

    // If present, GLB container is required to be the first buffer.
    if (bufferDef.uri === undefined && bufferIndex === 0) {
      return Promise.resolve(
        (
          this.extensions?.[EXTENSIONS.KHR_BINARY_GLTF] as
            | GLTFBinaryExtension
            | undefined
        )?.body || new ArrayBuffer(0)
      );
    }

    const options = this.options;

    return new Promise((resolve, reject) => {
      loader.load(
        this.resolveURL(bufferDef.uri, options.path),
        resolve,
        undefined,
        () => {
          reject(
            new Error(
              'THREE.GLTFLoader: Failed to load buffer "' + bufferDef.uri + '".'
            )
          );
        }
      );
    });
  }

  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
   * @param {number} bufferViewIndex
   * @return {Promise<ArrayBuffer>}
   */
  loadBufferView(bufferViewIndex: number): Promise<ArrayBuffer> {
    const bufferViewDef = this.json.bufferViews?.[bufferViewIndex];

    if (!bufferViewDef?.buffer) {
      return Promise.resolve(new ArrayBuffer(0));
    }

    return this.loadBuffer(bufferViewDef.buffer).then(function (buffer) {
      const byteLength = bufferViewDef.byteLength || 0;
      const byteOffset = bufferViewDef.byteOffset || 0;
      return buffer.slice(byteOffset, byteOffset + byteLength);
    });
  }

  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#accessors
   * @param {number} accessorIndex
   * @return {Promise<BufferAttribute|InterleavedBufferAttribute>}
   */
  loadAccessor(
    accessorIndex: number
  ): Promise<BufferAttribute | InterleavedBufferAttribute> | undefined {
    const parser = this;
    const json = this.json;

    const accessorDef = this.json.accessors?.[accessorIndex];

    if (
      accessorDef?.bufferView === undefined &&
      accessorDef?.sparse === undefined
    ) {
      // Ignore empty accessors, which may be used to declare runtime
      // information about attributes coming from another source (e.g. Draco
      // compression extension).
      return undefined;
    }

    const pendingBufferViews: (Promise<ArrayBuffer> | undefined)[] = [];

    if (accessorDef.bufferView !== undefined) {
      pendingBufferViews.push(
        this.getBufferViewDependency(accessorDef.bufferView)
      );
    } else {
      pendingBufferViews.push(undefined);
    }

    if (accessorDef.sparse !== undefined) {
      pendingBufferViews.push(
        this.getBufferViewDependency(accessorDef.sparse.indices.bufferView)
      );
      pendingBufferViews.push(
        this.getBufferViewDependency(accessorDef.sparse.values.bufferView)
      );
    }

    return Promise.all(pendingBufferViews).then((bufferViews) => {
      const bufferView = bufferViews[0];

      const itemSize = this.WEBGL_TYPE_SIZES[accessorDef.type];
      const TypedArray = WEBGL_COMPONENT_TYPES[accessorDef.componentType];

      // For VEC3: itemSize is 3, elementBytes is 4, itemBytes is 12.
      const elementBytes = TypedArray.BYTES_PER_ELEMENT;
      const itemBytes = elementBytes * itemSize;
      const byteOffset = accessorDef.byteOffset || 0;
      const byteStride =
        accessorDef.bufferView !== undefined
          ? json.bufferViews?.[accessorDef?.bufferView].byteStride
          : undefined;
      const normalized = accessorDef.normalized === true;
      let array, bufferAttribute;

      // The buffer is not interleaved if the stride is the item size in bytes.
      if (byteStride && byteStride !== itemBytes) {
        // Each "slice" of the buffer, as defined by 'count' elements of 'byteStride' bytes, gets its own InterleavedBuffer
        // This makes sure that IBA.count reflects accessor.count properly
        const ibSlice = Math.floor(byteOffset / byteStride);
        const ibCacheKey =
          "InterleavedBuffer:" +
          accessorDef.bufferView +
          ":" +
          accessorDef.componentType +
          ":" +
          ibSlice +
          ":" +
          accessorDef.count;
        let ib = parser.cache.get(ibCacheKey) as InterleavedBuffer | undefined;

        if (!ib) {
          array = new TypedArray(
            bufferView,
            ibSlice * byteStride,
            (accessorDef.count * byteStride) / elementBytes
          );

          // Integer parameters to IB/IBA are in array elements, not bytes.
          ib = new InterleavedBuffer(array, byteStride / elementBytes);

          parser.cache.add(ibCacheKey, ib);
        }

        bufferAttribute = new InterleavedBufferAttribute(
          ib,
          itemSize,
          (byteOffset % byteStride) / elementBytes,
          normalized
        );
      } else {
        if (!bufferView) {
          array = new TypedArray(accessorDef.count * itemSize);
        } else {
          array = new TypedArray(
            bufferView,
            byteOffset,
            accessorDef.count * itemSize
          );
        }

        bufferAttribute = new BufferAttribute(array, itemSize, normalized);
      }

      // https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#sparse-accessors
      if (accessorDef.sparse !== undefined) {
        const itemSizeIndices = this.WEBGL_TYPE_SIZES.SCALAR;
        const TypedArrayIndices =
          this.WEBGL_COMPONENT_TYPES[accessorDef.sparse.indices.componentType];

        const byteOffsetIndices = accessorDef.sparse.indices.byteOffset || 0;
        const byteOffsetValues = accessorDef.sparse.values.byteOffset || 0;

        const sparseIndices = new TypedArrayIndices(
          bufferViews[1],
          byteOffsetIndices,
          accessorDef.sparse.count * itemSizeIndices
        );
        const sparseValues = new TypedArray(
          bufferViews[2],
          byteOffsetValues,
          accessorDef.sparse.count * itemSize
        );

        if (bufferView !== null) {
          // Avoid modifying the original ArrayBuffer, if the bufferView wasn't initialized with zeroes.
          bufferAttribute = new BufferAttribute(
            bufferAttribute.array.slice(),
            bufferAttribute.itemSize,
            bufferAttribute.normalized
          );
        }

        for (const i = 0, il = sparseIndices.length; i < il; i++) {
          const index = sparseIndices[i];

          bufferAttribute.setX(index, sparseValues[i * itemSize]);
          if (itemSize >= 2)
            bufferAttribute.setY(index, sparseValues[i * itemSize + 1]);
          if (itemSize >= 3)
            bufferAttribute.setZ(index, sparseValues[i * itemSize + 2]);
          if (itemSize >= 4)
            bufferAttribute.setW(index, sparseValues[i * itemSize + 3]);
          if (itemSize >= 5)
            throw new Error(
              "THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute."
            );
        }
      }

      return bufferAttribute;
    });
  }

  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#textures
   * @param {number} textureIndex
   * @return {Promise<THREE.Texture>}
   */
  loadTexture(textureIndex: number): Promise<THREE.Texture> {
    const parser = this;
    const json = this.json;
    const options = this.options;

    const textureDef = json.textures?.[textureIndex];

    const textureExtensions = textureDef?.extensions || {};

    let source;

    if (textureExtensions[EXTENSIONS.MSFT_TEXTURE_DDS]) {
      source =
        json.images?.[textureExtensions[EXTENSIONS.MSFT_TEXTURE_DDS].source];
    } else {
      source = textureDef?.source
        ? json.images?.[textureDef.source]
        : undefined;
    }

    let loader: ImageBitmapLoader | TextureLoader;

    if (source?.uri) {
      loader = options.manager.getHandler(source.uri);
    }

    if (!loader) {
      loader = textureExtensions[EXTENSIONS.MSFT_TEXTURE_DDS]
        ? (
            parser.extensions?.[EXTENSIONS.MSFT_TEXTURE_DDS] as
              | GLTFTextureDDSExtension
              | undefined
          )?.ddsLoader
        : this.textureLoader;
    }

    return this.loadTextureImage(textureIndex, source, loader);
  }

  loadTextureImage(
    textureIndex: number,
    source: GLTFTextureDDSExtension | Image,
    loader: ImageBitmapLoader | TextureLoader | KTX2Loader
  ) {
    const parser = this;
    const json = this.json;
    const options = this.options;

    const textureDef = json.textures[textureIndex];

    const URL = self.URL || self.webkitURL;

    const sourceURI = source.uri;
    const isObjectURL = false;
    const hasAlpha = true;

    if (source.mimeType === "image/jpeg") hasAlpha = false;

    if (source.bufferView !== undefined) {
      // Load binary image data from bufferView, if provided.

      sourceURI = parser
        .getDependency("bufferView", source.bufferView)
        .then((bufferView) => {
          if (source.mimeType === "image/png") {
            // Inspect the PNG 'IHDR' chunk to determine whether the image could have an
            // alpha channel. This check is conservative — the image could have an alpha
            // channel with all values == 1, and the indexed type (colorType == 3) only
            // sometimes contains alpha.
            //
            // https://en.wikipedia.org/wiki/Portable_Network_Graphics#File_header
            const colorType = new DataView(bufferView, 25, 1).getUint8(
              0,
              false
            );
            hasAlpha = colorType === 6 || colorType === 4 || colorType === 3;
          }

          isObjectURL = true;
          const blob = new Blob([bufferView], { type: source.mimeType });
          sourceURI = URL.createObjectURL(blob);
          return sourceURI;
        });
    }

    return Promise.resolve(sourceURI)
      .then((sourceURI) => {
        return new Promise((resolve, reject) => {
          const onLoad = resolve;

          if (loader.isImageBitmapLoader === true) {
            onLoad = (imageBitmap) => {
              resolve(new CanvasTexture(imageBitmap));
            };
          }

          loader.load(
            resolveURL(sourceURI, options.path),
            onLoad,
            undefined,
            reject
          );
        });
      })
      .then((texture) => {
        // Clean up resources and configure Texture.

        if (isObjectURL === true) {
          URL.revokeObjectURL(sourceURI);
        }

        texture.flipY = false;

        if (textureDef.name) texture.name = textureDef.name;

        // When there is definitely no alpha channel in the texture, set RGBFormat to save space.
        if (!hasAlpha) texture.format = RGBFormat;

        const samplers = json.samplers || {};
        const sampler = samplers[textureDef.sampler] || {};

        texture.magFilter = WEBGL_FILTERS[sampler.magFilter] || LinearFilter;
        texture.minFilter =
          WEBGL_FILTERS[sampler.minFilter] || LinearMipmapLinearFilter;
        texture.wrapS = WEBGL_WRAPPINGS[sampler.wrapS] || RepeatWrapping;
        texture.wrapT = WEBGL_WRAPPINGS[sampler.wrapT] || RepeatWrapping;

        parser.associations.set(texture, {
          type: "textures",
          index: textureIndex
        });

        return texture;
      });
  }

  /**
   * Asynchronously assigns a texture to the given material parameters.
   * @param {Object} materialParams
   * @param {string} mapName
   * @param {Object} mapDef
   * @return {Promise}
   */
  assignTexture(
    materialParams: MaterialParameters,
    mapName: string,
    mapDef: any
  ): Promise<void> {
    const parser = this;

    return (
      this.getTextureDependency(mapDef.index)?.then((texture) => {
        // Materials sample aoMap from UV set 1 and other maps from UV set 0 - this can't be configured
        // However, we will copy UV set 0 to UV set 1 on demand for aoMap
        if (
          mapDef.texCoord !== undefined &&
          mapDef.texCoord != 0 &&
          !(mapName === "aoMap" && mapDef.texCoord == 1)
        ) {
          console.warn(
            "THREE.GLTFLoader: Custom UV set " +
              mapDef.texCoord +
              " for texture " +
              mapName +
              " not yet supported."
          );
        }

        if (parser.extensions[EXTENSIONS.KHR_TEXTURE_TRANSFORM]) {
          const transform =
            mapDef.extensions !== undefined
              ? (mapDef.extensions[
                  EXTENSIONS.KHR_TEXTURE_TRANSFORM
                ] as KHRTextureTransformTextureInfoExtension)
              : undefined;

          if (transform) {
            const gltfReference = parser.associations.get(texture);
            texture = (
              parser.extensions[
                EXTENSIONS.KHR_TEXTURE_TRANSFORM
              ] as KHRTextureTransformExtension
            ).extendTexture(texture, transform);
            parser.associations.set(texture, gltfReference);
          }
        }

        if (mapName in materialParams) {
          // @ts-ignore - Checking if mapName exists first
          materialParams[mapName] = texture;
        }
      }) || Promise.resolve()
    );
  }

  /**
   * Assigns final material to a Mesh, Line, or Points instance. The instance
   * already has a material (generated from the glTF material options alone)
   * but reuse of the same glTF material may require multiple threejs materials
   * to accomodate different primitive types, defines, etc. New materials will
   * be created if necessary, and reused from a cache.
   * @param  {Object3D} mesh Mesh, Line, or Points instance.
   */
  assignFinalMaterial(mesh: Mesh | Line | Points) {
    const geometry = mesh.geometry;
    let material = mesh.material;

    const useVertexTangents = geometry.attributes.tangent !== undefined;
    const useVertexColors = geometry.attributes.color !== undefined;
    const useFlatShading = geometry.attributes.normal === undefined;
    const useSkinning =
      "isSkinnedMesh" in mesh && mesh["isSkinnedMesh"] === true;
    const useMorphTargets = Object.keys(geometry.morphAttributes).length > 0;
    const useMorphNormals =
      useMorphTargets && geometry.morphAttributes.normal !== undefined;

    if ("isPoints" in mesh && mesh["isPoints"]) {
      const cacheKey = "PointsMaterial:" + material.uuid;

      let pointsMaterial = this.pointsMaterialCache.get(cacheKey);

      if (!pointsMaterial) {
        pointsMaterial = new PointsMaterial();
        Material.prototype.copy.call(pointsMaterial, material);
        pointsMaterial.color.copy(material.color);
        pointsMaterial.map = material.map;
        pointsMaterial.sizeAttenuation = false; // glTF spec says points should be 1px

        this.pointsMaterialCache.add(cacheKey, pointsMaterial);
      }

      material = pointsMaterial;
    } else if ("isLine" in mesh && mesh["isLine"]) {
      const cacheKey = "LineBasicMaterial:" + material.uuid;

      let lineMaterial = this.cache.get(cacheKey) as
        | LineBasicMaterial
        | undefined;

      if (!lineMaterial) {
        lineMaterial = new LineBasicMaterial();
        Material.prototype.copy.call(lineMaterial, material);
        lineMaterial.color.copy(material.color);

        this.cache.add(cacheKey, lineMaterial);
      }

      material = lineMaterial;
    }

    // Clone the material if it will be modified
    if (
      useVertexTangents ||
      useVertexColors ||
      useFlatShading ||
      useSkinning ||
      useMorphTargets
    ) {
      let cacheKey = "ClonedMaterial:" + material.uuid + ":";

      if (material.isGLTFSpecularGlossinessMaterial)
        cacheKey += "specular-glossiness:";
      if (useSkinning) cacheKey += "skinning:";
      if (useVertexTangents) cacheKey += "vertex-tangents:";
      if (useVertexColors) cacheKey += "vertex-colors:";
      if (useFlatShading) cacheKey += "flat-shading:";
      if (useMorphTargets) cacheKey += "morph-targets:";
      if (useMorphNormals) cacheKey += "morph-normals:";

      let cachedMaterial = this.cache.get(cacheKey) as Material;

      if (!cachedMaterial) {
        cachedMaterial = (material as Material).clone();

        if (useSkinning) cachedMaterial.skinning = true;
        if (useVertexTangents) cachedMaterial.vertexTangents = true;
        if (useVertexColors) cachedMaterial.vertexColors = true;
        if (useFlatShading) cachedMaterial.flatShading = true;
        if (useMorphTargets) cachedMaterial.morphTargets = true;
        if (useMorphNormals) cachedMaterial.morphNormals = true;

        this.cache.add(cacheKey, cachedMaterial);

        this.associations.set(cachedMaterial, this.associations.get(material));
      }

      material = cachedMaterial;
    }

    // workarounds for mesh and geometry

    if (
      material.aoMap &&
      geometry.attributes.uv2 === undefined &&
      geometry.attributes.uv !== undefined
    ) {
      geometry.setAttribute("uv2", geometry.attributes.uv);
    }

    // https://github.com/mrdoob/three.js/issues/11438#issuecomment-507003995
    if (material.normalScale && !useVertexTangents) {
      material.normalScale.y = -material.normalScale.y;
    }

    if (material.clearcoatNormalScale && !useVertexTangents) {
      material.clearcoatNormalScale.y = -material.clearcoatNormalScale.y;
    }

    mesh.material = material;
  }

  getMaterialType(/* materialIndex */) {
    return MeshStandardMaterial;
  }

  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#materials
   * @param {number} materialIndex
   * @return {Promise<Material>}
   */
  loadMaterial(materialIndex: number) {
    const parser = this;
    const json = this.json;
    const extensions = this.extensions;
    const materialDef = json.materials?.[materialIndex];

    let materialType;
    const materialParams: MaterialParameters = {};
    const materialExtensions = materialDef?.extensions || {};

    const pending = [];

    if (materialExtensions[EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS]) {
      const sgExtension = extensions[
        EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS
      ] as GLTFMaterialsPbrSpecularGlossinessExtension;
      materialType = sgExtension!.getMaterialType();
      pending.push(
        sgExtension.extendParams(materialParams, parser, materialDef)
      );
    } else if (materialExtensions[EXTENSIONS.KHR_MATERIALS_UNLIT]) {
      const kmuExtension = extensions[
        EXTENSIONS.KHR_MATERIALS_UNLIT
      ] as GLTFMaterialsUnlitExtension;
      materialType = kmuExtension!.getMaterialType();
      pending.push(
        kmuExtension.extendParams(materialParams, parser, materialDef)
      );
    } else {
      // Specification:
      // https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#metallic-roughness-material

      const metallicRoughness = materialDef?.pbrMetallicRoughness || {};

      materialParams.color = new Color(1.0, 1.0, 1.0);
      materialParams.opacity = 1.0;

      if (Array.isArray(metallicRoughness.baseColorFactor)) {
        const array = metallicRoughness.baseColorFactor;

        materialParams.color.fromArray(array);
        materialParams.opacity = array[3];
      }

      if (metallicRoughness.baseColorTexture !== undefined) {
        pending.push(
          parser.assignTexture(
            materialParams,
            "map",
            metallicRoughness.baseColorTexture
          )
        );
      }

      materialParams.metalness =
        metallicRoughness.metallicFactor !== undefined
          ? metallicRoughness.metallicFactor
          : 1.0;
      materialParams.roughness =
        metallicRoughness.roughnessFactor !== undefined
          ? metallicRoughness.roughnessFactor
          : 1.0;

      if (metallicRoughness.metallicRoughnessTexture !== undefined) {
        pending.push(
          parser.assignTexture(
            materialParams,
            "metalnessMap",
            metallicRoughness.metallicRoughnessTexture
          )
        );
        pending.push(
          parser.assignTexture(
            materialParams,
            "roughnessMap",
            metallicRoughness.metallicRoughnessTexture
          )
        );
      }

      materialType = this._invokeOne((ext) => {
        return ext.getMaterialType && ext.getMaterialType(materialIndex);
      });

      pending.push(
        Promise.all(
          this._invokeAll((ext) => {
            return (
              ext.extendMaterialParams &&
              ext.extendMaterialParams(materialIndex, materialParams)
            );
          })
        )
      );
    }

    if (materialDef.doubleSided === true) {
      materialParams.side = DoubleSide;
    }

    const alphaMode = materialDef.alphaMode || ALPHA_MODES.OPAQUE;

    if (alphaMode === ALPHA_MODES.BLEND) {
      materialParams.transparent = true;

      // See: https://github.com/mrdoob/three.js/issues/17706
      materialParams.depthWrite = false;
    } else {
      materialParams.transparent = false;

      if (alphaMode === ALPHA_MODES.MASK) {
        materialParams.alphaTest =
          materialDef.alphaCutoff !== undefined ? materialDef.alphaCutoff : 0.5;
      }
    }

    if (
      materialDef.normalTexture !== undefined &&
      materialType !== MeshBasicMaterial
    ) {
      pending.push(
        parser.assignTexture(
          materialParams,
          "normalMap",
          materialDef.normalTexture
        )
      );

      materialParams.normalScale = new Vector2(1, 1);

      if (materialDef.normalTexture.scale !== undefined) {
        materialParams.normalScale.set(
          materialDef.normalTexture.scale,
          materialDef.normalTexture.scale
        );
      }
    }

    if (
      materialDef.occlusionTexture !== undefined &&
      materialType !== MeshBasicMaterial
    ) {
      pending.push(
        parser.assignTexture(
          materialParams,
          "aoMap",
          materialDef.occlusionTexture
        )
      );

      if (materialDef.occlusionTexture.strength !== undefined) {
        materialParams.aoMapIntensity = materialDef.occlusionTexture.strength;
      }
    }

    if (
      materialDef.emissiveFactor !== undefined &&
      materialType !== MeshBasicMaterial
    ) {
      materialParams.emissive = new Color().fromArray(
        materialDef.emissiveFactor
      );
    }

    if (
      materialDef.emissiveTexture !== undefined &&
      materialType !== MeshBasicMaterial
    ) {
      pending.push(
        parser.assignTexture(
          materialParams,
          "emissiveMap",
          materialDef.emissiveTexture
        )
      );
    }

    return Promise.all(pending).then(() => {
      let material;

      if (materialType === GLTFMeshStandardSGMaterial) {
        material =
          extensions[
            EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS
          ]?.createMaterial(materialParams);
      } else {
        material = new materialType(materialParams);
      }

      if (materialDef.name) material.name = materialDef.name;

      // baseColorTexture, emissiveTexture, and specularGlossinessTexture use sRGB encoding.
      if (material.map) material.map.encoding = sRGBEncoding;
      if (material.emissiveMap) material.emissiveMap.encoding = sRGBEncoding;

      assignExtrasToUserData(material, materialDef);

      parser.associations.set(material, {
        type: "materials",
        index: materialIndex
      });

      if (materialDef.extensions)
        addUnknownExtensionsToUserData(extensions, material, materialDef);

      return material;
    });
  }

  /** When Object3D instances are targeted by animation, they need unique names. */
  createUniqueName(originalName) {
    // https://github.com/mrdoob/three.js/issues/15087
    return originalName;
    /*
		const name = PropertyBinding.sanitizeNodeName( originalName || '' );

		for ( const i = 1; this.nodeNamesUsed[ name ]; ++ i ) {

			name = originalName + '_' + i;

		}

		this.nodeNamesUsed[ name ] = true;

		return name;
*/
  }

  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#geometry
   *
   * Creates BufferGeometries from primitives.
   *
   * @param {Array<GLTF.Primitive>} primitives
   * @return {Promise<Array<BufferGeometry>>}
   */
  loadGeometries(primitives: MeshPrimitive[]): Promise<Array<BufferGeometry>> {
    const parser = this;
    const extensions = this.extensions;
    const cache = this.primitiveCache;

    function createDracoPrimitive(primitive: MeshPrimitive) {
      return extensions[EXTENSIONS.KHR_DRACO_MESH_COMPRESSION]
        .decodePrimitive(primitive, parser)
        .then((geometry) => {
          return addPrimitiveAttributes(geometry, primitive, parser);
        });
    }

    const pending = [];

    for (let i = 0, il = primitives.length; i < il; i++) {
      const primitive = primitives[i];
      const cacheKey = createPrimitiveKey(primitive);

      // See if we've already created this geometry
      const cached = cache[cacheKey];

      if (cached) {
        // Use the cached geometry if it exists
        pending.push(cached.promise);
      } else {
        const geometryPromise;

        if (
          primitive.extensions &&
          primitive.extensions[EXTENSIONS.KHR_DRACO_MESH_COMPRESSION]
        ) {
          // Use DRACO geometry if available
          geometryPromise = createDracoPrimitive(primitive);
        } else {
          // Otherwise create a new geometry
          geometryPromise = addPrimitiveAttributes(
            new BufferGeometry(),
            primitive,
            parser
          );
        }

        // Cache this geometry
        cache[cacheKey] = { primitive: primitive, promise: geometryPromise };

        pending.push(geometryPromise);
      }
    }

    return Promise.all(pending);
  }

  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#meshes
   * @param {number} meshIndex
   * @return {Promise<Group|Mesh|SkinnedMesh>}
   */
  loadMesh(meshIndex: number): Promise<Group | Mesh | SkinnedMesh> {
    const parser = this;
    const json = this.json;

    const meshDef = json.meshes[meshIndex];
    const primitives = meshDef.primitives;

    const pending = [];

    for (const i = 0, il = primitives.length; i < il; i++) {
      const material =
        primitives[i].material === undefined
          ? this.createDefaultMaterial(this.cache)
          : this.getMaterialDependency(primitives[i].material);

      pending.push(material);
    }

    pending.push(parser.loadGeometries(primitives));

    return Promise.all(pending).then((results) => {
      const materials = results.slice(0, results.length - 1);
      const geometries = results[results.length - 1];

      const meshes = [];

      for (const i = 0, il = geometries.length; i < il; i++) {
        const geometry = geometries[i];
        const primitive = primitives[i];

        // 1. create Mesh

        let mesh;

        const material = materials[i];

        if (
          primitive.mode === WEBGL_CONSTANTS.TRIANGLES ||
          primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP ||
          primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN ||
          primitive.mode === undefined
        ) {
          // .isSkinnedMesh isn't in glTF spec. See ._markDefs()
          mesh =
            meshDef.isSkinnedMesh === true
              ? new SkinnedMesh(geometry, material)
              : new Mesh(geometry, material);

          if (
            mesh.isSkinnedMesh === true &&
            !mesh.geometry.attributes.skinWeight.normalized
          ) {
            // we normalize floating point skin weight array to fix malformed assets (see #15319)
            // it's important to skip this for non-float32 data since normalizeSkinWeights assumes non-normalized inputs
            mesh.normalizeSkinWeights();
          }

          if (primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP) {
            mesh.geometry = toTrianglesDrawMode(
              mesh.geometry,
              TriangleStripDrawMode
            );
          } else if (primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN) {
            mesh.geometry = toTrianglesDrawMode(
              mesh.geometry,
              TriangleFanDrawMode
            );
          }
        } else if (primitive.mode === WEBGL_CONSTANTS.LINES) {
          mesh = new LineSegments(geometry, material);
        } else if (primitive.mode === WEBGL_CONSTANTS.LINE_STRIP) {
          mesh = new Line(geometry, material);
        } else if (primitive.mode === WEBGL_CONSTANTS.LINE_LOOP) {
          mesh = new LineLoop(geometry, material);
        } else if (primitive.mode === WEBGL_CONSTANTS.POINTS) {
          mesh = new Points(geometry, material);
        } else {
          throw new Error(
            "THREE.GLTFLoader: Primitive mode unsupported: " + primitive.mode
          );
        }

        if (Object.keys(mesh.geometry.morphAttributes).length > 0) {
          updateMorphTargets(mesh, meshDef);
        }

        mesh._usage = meshDef.usage;
        mesh._curUsage = 0;

        mesh.name = parser.createUniqueName(
          meshDef.name || "mesh_" + meshIndex
        );

        if (geometries.length > 1) mesh.name += "_" + i;

        assignExtrasToUserData(mesh, meshDef);

        parser.assignFinalMaterial(mesh);

        meshes.push(mesh);
      }

      if (meshes.length === 1) {
        return meshes[0];
      }

      const group = new Group();
      group._usage = meshDef.usage;
      group._curUsage = 0;

      for (let i = 0, il = meshes.length; i < il; i++) {
        group.add(meshes[i]);
      }

      return group;
    });
  }

  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#cameras
   * @param {number} cameraIndex
   * @return {Promise<THREE.Camera>}
   */
  loadCamera(cameraIndex: number): Promise<THREE.Camera> {
    const camera;
    const cameraDef = this.json.cameras[cameraIndex];
    const params = cameraDef[cameraDef.type];

    if (!params) {
      console.warn("THREE.GLTFLoader: Missing camera parameters.");
      return;
    }

    if (cameraDef.type === "perspective") {
      camera = new PerspectiveCamera(
        MathUtils.radToDeg(params.yfov),
        params.aspectRatio || 1,
        params.znear || 1,
        params.zfar || 2e6
      );
    } else if (cameraDef.type === "orthographic") {
      camera = new OrthographicCamera(
        -params.xmag,
        params.xmag,
        params.ymag,
        -params.ymag,
        params.znear,
        params.zfar
      );
    }

    if (cameraDef.name) camera.name = this.createUniqueName(cameraDef.name);

    assignExtrasToUserData(camera, cameraDef);

    return Promise.resolve(camera);
  }

  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#skins
   * @param {number} skinIndex
   * @return {Promise<Object>}
   */
  loadSkin(skinIndex: number): Promise<Object> {
    const skinDef = this.json.skins[skinIndex];

    const skinEntry = { joints: skinDef.joints };

    if (skinDef.inverseBindMatrices === undefined) {
      return Promise.resolve(skinEntry);
    }

    return this.getDependency("accessor", skinDef.inverseBindMatrices).then(
      (accessor) => {
        skinEntry.inverseBindMatrices = accessor;

        return skinEntry;
      }
    );
  }

  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#animations
   * @param {number} animationIndex
   * @return {Promise<AnimationClip>}
   */
  loadAnimation(animationIndex: number): Promise<AnimationClip> {
    const json = this.json;

    const animationDef = json.animations[animationIndex];

    const pendingNodes = [];
    const pendingInputAccessors = [];
    const pendingOutputAccessors = [];
    const pendingSamplers = [];
    const pendingTargets = [];

    for (const i = 0, il = animationDef.channels.length; i < il; i++) {
      const channel = animationDef.channels[i];
      const sampler = animationDef.samplers[channel.sampler];
      const target = channel.target;
      const name = target.node !== undefined ? target.node : target.id; // NOTE: target.id is deprecated.
      const input =
        animationDef.parameters !== undefined
          ? animationDef.parameters[sampler.input]
          : sampler.input;
      const output =
        animationDef.parameters !== undefined
          ? animationDef.parameters[sampler.output]
          : sampler.output;

      pendingNodes.push(this.getDependency("node", name));
      pendingInputAccessors.push(this.getDependency("accessor", input));
      pendingOutputAccessors.push(this.getDependency("accessor", output));
      pendingSamplers.push(sampler);
      pendingTargets.push(target);
    }

    return Promise.all([
      Promise.all(pendingNodes),
      Promise.all(pendingInputAccessors),
      Promise.all(pendingOutputAccessors),
      Promise.all(pendingSamplers),
      Promise.all(pendingTargets)
    ]).then((dependencies) => {
      const nodes = dependencies[0];
      const inputAccessors = dependencies[1];
      const outputAccessors = dependencies[2];
      const samplers = dependencies[3];
      const targets = dependencies[4];

      const tracks = [];

      for (const i = 0, il = nodes.length; i < il; i++) {
        const node = nodes[i];
        const inputAccessor = inputAccessors[i];
        const outputAccessor = outputAccessors[i];
        const sampler = samplers[i];
        const target = targets[i];

        if (node === undefined) continue;

        node.updateMatrix();
        node.matrixAutoUpdate = true;

        const TypedKeyframeTrack;

        switch (PATH_PROPERTIES[target.path]) {
          case PATH_PROPERTIES.weights:
            TypedKeyframeTrack = NumberKeyframeTrack;
            break;

          case PATH_PROPERTIES.rotation:
            TypedKeyframeTrack = QuaternionKeyframeTrack;
            break;

          case PATH_PROPERTIES.position:
          case PATH_PROPERTIES.scale:
          default:
            TypedKeyframeTrack = VectorKeyframeTrack;
            break;
        }

        const targetName = node.name ? node.name : node.uuid;

        const interpolation =
          sampler.interpolation !== undefined
            ? INTERPOLATION[sampler.interpolation]
            : InterpolateLinear;

        const targetNames = [];

        if (PATH_PROPERTIES[target.path] === PATH_PROPERTIES.weights) {
          // Node may be a Group (glTF mesh with several primitives) or a Mesh.
          node.traverse((object) => {
            if (object.isMesh === true && object.morphTargetInfluences) {
              targetNames.push(object.name ? object.name : object.uuid);
            }
          });
        } else {
          targetNames.push(targetName);
        }

        const outputArray = outputAccessor.array;

        if (outputAccessor.normalized) {
          const scale;

          if (outputArray.constructor === Int8Array) {
            scale = 1 / 127;
          } else if (outputArray.constructor === Uint8Array) {
            scale = 1 / 255;
          } else if (outputArray.constructor == Int16Array) {
            scale = 1 / 32767;
          } else if (outputArray.constructor === Uint16Array) {
            scale = 1 / 65535;
          } else {
            throw new Error(
              "THREE.GLTFLoader: Unsupported output accessor component type."
            );
          }

          const scaled = new Float32Array(outputArray.length);

          for (let j = 0, jl = outputArray.length; j < jl; j++) {
            scaled[j] = outputArray[j] * scale;
          }

          outputArray = scaled;
        }

        for (let j = 0, jl = targetNames.length; j < jl; j++) {
          const track = new TypedKeyframeTrack(
            targetNames[j] + "." + PATH_PROPERTIES[target.path],
            inputAccessor.array,
            outputArray,
            interpolation
          );

          // Override interpolation with custom factory method.
          if (sampler.interpolation === "CUBICSPLINE") {
            track.createInterpolant =
              function InterpolantFactoryMethodGLTFCubicSpline(result) {
                // A CUBICSPLINE keyframe in glTF has three output values for each input value,
                // representing inTangent, splineVertex, and outTangent. As a result, track.getValueSize()
                // must be divided by three to get the interpolant's sampleSize argument.

                return new GLTFCubicSplineInterpolant(
                  this.times,
                  this.values,
                  this.getValueSize() / 3,
                  result
                );
              };

            // Mark as CUBICSPLINE. `track.getInterpolation()` doesn't support custom interpolants.
            track.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline =
              true;
          }

          tracks.push(track);
        }
      }

      const name = animationDef.name
        ? animationDef.name
        : "animation_" + animationIndex;

      return new AnimationClip(name, undefined, tracks);
    });
  }

  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#nodes-and-hierarchy
   * @param {number} nodeIndex
   * @return {Promise<Object3D>}
   */
  loadNode(nodeIndex: number): Promise<Object3D> {
    const json = this.json;
    const extensions = this.extensions;
    const parser = this;

    const nodeDef = json.nodes[nodeIndex];

    // reserve node's name before its dependencies, so the root has the intended name.
    const nodeName = nodeDef.name ? parser.createUniqueName(nodeDef.name) : "";

    return (() => {
      const pending = [];

      if (nodeDef.mesh !== undefined) {
        pending.push(
          parser.getDependency("mesh", nodeDef.mesh).then((mesh) => {
            const node;

            if (nodeDef.instance) {
              // This node should actually just be an object3D with no children.
              // Instead it carries a reference to the InstancedMesh
              node = new Object3D();

              if (mesh._inst == null) {
                if (mesh.geometry) {
                  // Instance must not share geometry or material with regular rendered obj:
                  mesh._inst = new InstancedMesh(
                    mesh.geometry.clone(),
                    mesh.material.clone(),
                    mesh._usage
                  );
                  this.scene.add(mesh._inst);
                } else {
                  // It's a group
                  mesh._inst = [];
                  const children = mesh.children;
                  for (const i = 0; i < children.length; i++) {
                    const childMesh = children[i];
                    const im = new InstancedMesh(
                      childMesh.geometry.clone(),
                      childMesh.material.clone(),
                      mesh._usage
                    );
                    this.scene.add(im);
                    mesh._inst.push(im);
                  }
                }
              }

              node._instIndex = mesh._curUsage++;
              node._inst = mesh._inst;
            } else {
              node = parser._getNodeRef(parser.meshCache, nodeDef.mesh, mesh);

              // if weights are provided on the node, override weights on the mesh.
              if (nodeDef.weights !== undefined) {
                node.traverse((o) => {
                  if (!o.isMesh) return;

                  for (const i = 0, il = nodeDef.weights.length; i < il; i++) {
                    o.morphTargetInfluences[i] = nodeDef.weights[i];
                  }
                });
              }
            }

            return node;
          })
        );
      }

      if (nodeDef.camera !== undefined) {
        pending.push(
          parser.getDependency("camera", nodeDef.camera).then((camera) => {
            return parser._getNodeRef(
              parser.cameraCache,
              nodeDef.camera,
              camera
            );
          })
        );
      }

      parser
        ._invokeAll((ext) => {
          return (
            ext.createNodeAttachment && ext.createNodeAttachment(nodeIndex)
          );
        })
        .forEach((promise) => {
          pending.push(promise);
        });

      return Promise.all(pending);
    })().then((objects) => {
      const node;

      // .isBone isn't in glTF spec. See ._markDefs
      if (nodeDef.isBone === true) {
        node = new Bone();
      } else if (objects.length > 1) {
        node = new Group();
      } else if (objects.length === 1) {
        node = objects[0];
      } else {
        node = new Object3D();
      }

      if (node !== objects[0]) {
        for (const i = 0, il = objects.length; i < il; i++) {
          node.add(objects[i]);
        }
      }

      if (nodeDef.name) {
        node.userData.name = nodeDef.name;
        node.name = nodeName;
      }

      assignExtrasToUserData(node, nodeDef);

      if (nodeDef.extensions)
        addUnknownExtensionsToUserData(extensions, node, nodeDef);

      if (nodeDef.matrix !== undefined) {
        const matrix = new Matrix4();
        matrix.fromArray(nodeDef.matrix);
        node.applyMatrix4(matrix);
      } else {
        if (nodeDef.translation !== undefined) {
          node.position.fromArray(nodeDef.translation);
        }

        if (nodeDef.rotation !== undefined) {
          node.quaternion.fromArray(nodeDef.rotation);
        }

        if (nodeDef.scale !== undefined) {
          node.scale.fromArray(nodeDef.scale);
        }

        node.updateMatrix();
      }

      parser.associations.set(node, { type: "nodes", index: nodeIndex });

      return node;
    });
  }

  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#scenes
   * @param {number} sceneIndex
   * @return {Promise<Group>}
   */
  loadScene(sceneIndex: number): Promise<Group> {
    // scene node hierachy builder

    function buildNodeHierachy(nodeId, parentObject, json, parser) {
      const nodeDef = json.nodes[nodeId];

      return parser
        .getDependency("node", nodeId)
        .then((node) => {
          if (nodeDef.skin === undefined) return node;

          // build skeleton here as well

          const skinEntry;

          return parser
            .getDependency("skin", nodeDef.skin)
            .then((skin) => {
              skinEntry = skin;

              const pendingJoints = [];

              for (const i = 0, il = skinEntry.joints.length; i < il; i++) {
                pendingJoints.push(
                  parser.getDependency("node", skinEntry.joints[i])
                );
              }

              return Promise.all(pendingJoints);
            })
            .then((jointNodes) => {
              node.traverse((mesh) => {
                if (!mesh.isMesh) return;

                const bones = [];
                const boneInverses = [];

                for (const j = 0, jl = jointNodes.length; j < jl; j++) {
                  const jointNode = jointNodes[j];

                  if (jointNode) {
                    bones.push(jointNode);

                    const mat = new Matrix4();

                    if (skinEntry.inverseBindMatrices !== undefined) {
                      mat.fromArray(
                        skinEntry.inverseBindMatrices.array,
                        j * 16
                      );
                    }

                    boneInverses.push(mat);
                  } else {
                    console.warn(
                      'THREE.GLTFLoader: Joint "%s" could not be found.',
                      skinEntry.joints[j]
                    );
                  }
                }

                mesh.bind(new Skeleton(bones, boneInverses), mesh.matrixWorld);
              });

              return node;
            });
        })
        .then((node) => {
          // build node hierachy

          parentObject.add(node);

          const pending = [];

          if (nodeDef.children) {
            const children = nodeDef.children;

            for (const i = 0, il = children.length; i < il; i++) {
              const child = children[i];
              pending.push(buildNodeHierachy(child, node, json, parser));
            }
          }

          return Promise.all(pending);
        });
    }

    return function loadScene(sceneIndex) {
      const json = this.json;
      const extensions = this.extensions;
      const sceneDef = this.json.scenes[sceneIndex];
      const parser = this;

      // Loader returns Group, not Scene.
      // See: https://github.com/mrdoob/three.js/issues/18342#issuecomment-578981172
      const scene = new Group();
      this.scene = scene;
      if (sceneDef.name) scene.name = parser.createUniqueName(sceneDef.name);

      assignExtrasToUserData(scene, sceneDef);

      if (sceneDef.extensions)
        addUnknownExtensionsToUserData(extensions, scene, sceneDef);

      const nodeIds = sceneDef.nodes || [];

      const pending = [];

      for (const i = 0, il = nodeIds.length; i < il; i++) {
        pending.push(buildNodeHierachy(nodeIds[i], scene, json, parser));
      }

      return Promise.all(pending).then(() => {
        scene.updateMatrixWorld(true, true);

        scene.traverse((node) => {
          if (node._inst != null) {
            if (Array.isArray(node._inst)) {
              // Some are groups of meshes:
              const children = node._inst;
              for (const i = 0; i < children.length; i++) {
                const child = children[i];
                child.setMatrixAt(node._instIndex, node.matrixWorld);
                child.instanceMatrix.needsUpdate = true;
              }
            } else {
              node._inst.setMatrixAt(node._instIndex, node.matrixWorld);
              node._inst.instanceMatrix.needsUpdate = true;
            }
          }
        });

        return scene;
      });
    };
  }

  /**
   * @param {BufferGeometry} geometry
   * @param {GLTF.Primitive} primitiveDef
   * @param {GLTFParser} parser
   * @return {Promise<BufferGeometry>}
   */
  addPrimitiveAttributes = (
    geometry: BufferGeometry,
    primitiveDef: MeshPrimitive,
    parser: GLTFParser
  ): Promise<BufferGeometry> => {
    const attributes = primitiveDef.attributes;

    const pending = [];

    const assignAttributeAccessor = (accessorIndex, attributeName) => {
      return parser
        .getDependency("accessor", accessorIndex)
        .then((accessor) => {
          geometry.setAttribute(attributeName, accessor);
        });
    };

    for (const gltfAttributeName in attributes) {
      const threeAttributeName =
        getThreeAttributeName(gltfAttributeName) ||
        gltfAttributeName.toLowerCase();

      // Skip attributes already provided by e.g. Draco extension.
      if (threeAttributeName in geometry.attributes) continue;

      pending.push(
        assignAttributeAccessor(
          attributes[gltfAttributeName],
          threeAttributeName
        )
      );
    }

    if (primitiveDef.indices !== undefined && !geometry.index) {
      const accessor = parser
        .getDependency("accessor", primitiveDef.indices)
        .then((accessor) => {
          geometry.setIndex(accessor);
        });

      pending.push(accessor);
    }

    assignExtrasToUserData(geometry, primitiveDef);

    computeBounds(geometry, primitiveDef, parser);

    return Promise.all(pending).then(() => {
      return primitiveDef.targets !== undefined
        ? addMorphTargets(geometry, primitiveDef.targets, parser)
        : geometry;
    });
  };

  /**
   * @param {BufferGeometry} geometry
   * @param {Number} drawMode
   * @return {BufferGeometry}
   */
  toTrianglesDrawMode = (
    geometry: BufferGeometry,
    drawMode: number
  ): BufferGeometry => {
    let index = geometry.getIndex();

    // generate index if not present

    if (index === null) {
      const indices = [];

      const position = geometry.getAttribute("position");

      if (position !== undefined) {
        for (let i = 0; i < position.count; i++) {
          indices.push(i);
        }

        geometry.setIndex(indices);
        index = geometry.getIndex()!;
      } else {
        console.error(
          "THREE.GLTFLoader.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."
        );
        return geometry;
      }
    }

    //

    const numberOfTriangles = index.count - 2;
    const newIndices = [];

    if (drawMode === TriangleFanDrawMode) {
      // gl.TRIANGLE_FAN

      for (let i = 1; i <= numberOfTriangles; i++) {
        newIndices.push(index.getX(0));
        newIndices.push(index.getX(i));
        newIndices.push(index.getX(i + 1));
      }
    } else {
      // gl.TRIANGLE_STRIP

      for (let i = 0; i < numberOfTriangles; i++) {
        if (i % 2 === 0) {
          newIndices.push(index.getX(i));
          newIndices.push(index.getX(i + 1));
          newIndices.push(index.getX(i + 2));
        } else {
          newIndices.push(index.getX(i + 2));
          newIndices.push(index.getX(i + 1));
          newIndices.push(index.getX(i));
        }
      }
    }

    if (newIndices.length / 3 !== numberOfTriangles) {
      console.error(
        "THREE.GLTFLoader.toTrianglesDrawMode(): Unable to generate correct amount of triangles."
      );
    }

    // build final geometry

    const newGeometry = geometry.clone();
    newGeometry.setIndex(newIndices);

    return newGeometry;
  };

  /**
   * @param {BufferGeometry} geometry
   * @param {GLTF.Primitive} primitiveDef
   * @param {GLTFParser} parser
   */
  computeBounds = (
    geometry: BufferGeometry,
    primitiveDef: GLTF.Primitive,
    parser: GLTFParser
  ) => {
    const attributes = primitiveDef.attributes;

    const box = new Box3();

    if (attributes.POSITION !== undefined) {
      const accessor = parser.json.accessors[attributes.POSITION];

      const min = accessor.min;
      const max = accessor.max;

      // glTF requires 'min' and 'max', but VRM (which extends glTF) currently ignores that requirement.

      if (min !== undefined && max !== undefined) {
        box.set(
          new Vector3(min[0], min[1], min[2]),
          new Vector3(max[0], max[1], max[2])
        );
      } else {
        console.warn(
          "THREE.GLTFLoader: Missing min/max properties for accessor POSITION."
        );

        return;
      }
    } else {
      return;
    }

    const targets = primitiveDef.targets;

    if (targets !== undefined) {
      const maxDisplacement = new Vector3();
      const vector = new Vector3();

      for (const i = 0, il = targets.length; i < il; i++) {
        const target = targets[i];

        if (target.POSITION !== undefined) {
          const accessor = parser.json.accessors[target.POSITION];
          const min = accessor.min;
          const max = accessor.max;

          // glTF requires 'min' and 'max', but VRM (which extends glTF) currently ignores that requirement.

          if (min !== undefined && max !== undefined) {
            // we need to get max of absolute components because target weight is [-1,1]
            vector.setX(Math.max(Math.abs(min[0]), Math.abs(max[0])));
            vector.setY(Math.max(Math.abs(min[1]), Math.abs(max[1])));
            vector.setZ(Math.max(Math.abs(min[2]), Math.abs(max[2])));

            // Note: this assumes that the sum of all weights is at most 1. This isn't quite correct - it's more conservative
            // to assume that each target can have a max weight of 1. However, for some use cases - notably, when morph targets
            // are used to implement key-frame animations and as such only two are active at a time - this results in very large
            // boxes. So for now we make a box that's sometimes a touch too small but is hopefully mostly of reasonable size.
            maxDisplacement.max(vector);
          } else {
            console.warn(
              "THREE.GLTFLoader: Missing min/max properties for accessor POSITION."
            );
          }
        }
      }

      // As per comment above this box isn't conservative, but has a reasonable size for a very large number of morph targets.
      box.expandByVector(maxDisplacement);
    }

    geometry.boundingBox = box;

    const sphere = new Sphere();

    box.getCenter(sphere.center);
    sphere.radius = box.min.distanceTo(box.max) / 2;

    geometry.boundingSphere = sphere;
  };

  /* UTILITY FUNCTIONS */

  resolveURL = (url: string, path: string) => {
    // Invalid URL
    if (url === "") return "";

    // Host Relative URL
    if (/^https?:\/\//i.test(path) && /^\//.test(url)) {
      path = path.replace(/(^https?:\/\/[^\/]+).*/i, "$1");
    }

    // Absolute URL http://,https://,//
    if (/^(https?:)?\/\//i.test(url)) return url;

    // Data URI
    if (/^data:.*,.*$/i.test(url)) return url;

    // Blob URL
    if (/^blob:.*$/i.test(url)) return url;

    // Relative URL
    return path + url;
  };

  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#default-material
   */
  createDefaultMaterial = (cache: GLTFRegistry) => {
    if (!cache.get("DefaultMaterial")) {
      cache.add(
        "DefaultMaterial",
        new MeshStandardMaterial({
          color: 0xffffff,
          emissive: 0x000000,
          metalness: 1,
          roughness: 1,
          transparent: false,
          depthTest: true,
          side: FrontSide
        })
      );
    }

    return cache.get("DefaultMaterial");
  };

  addUnknownExtensionsToUserData = (
    knownExtensions: GLTFParser["extensions"],
    object: GLTFTile,
    objectDef: GLTFParser["json"]
  ) => {
    // Add unknown glTF extensions to an object's userData.

    for (const name in objectDef.extensions) {
      if (knownExtensions[name] === undefined) {
        object.userData.gltfExtensions = object.userData.gltfExtensions || {};
        object.userData.gltfExtensions[name] = objectDef.extensions[name];
      }
    }
  };

  /**
   * @param {Object3D|Material|BufferGeometry} object
   * @param {GlTF} gltfDef
   */
  assignExtrasToUserData = (
    object: Object3D | Material | BufferGeometry | GLTFTile,
    gltfDef: GlTF
  ) => {
    if (gltfDef.extras !== undefined) {
      if (typeof gltfDef.extras === "object") {
        Object.assign(object.userData, gltfDef.extras);
      } else {
        console.warn(
          "THREE.GLTFLoader: Ignoring primitive type .extras, " + gltfDef.extras
        );
      }
    }
  };

  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#morph-targets
   *
   * @param {BufferGeometry} geometry
   * @param {Array<GLTF.Target>} targets
   * @param {GLTFParser} parser
   * @return {Promise<BufferGeometry>}
   */
  addMorphTargets = (
    geometry: BufferGeometry,
    targets: MeshPrimitive["targets"],
    parser: GLTFParser
  ): Promise<BufferGeometry> => {
    let hasMorphPosition = false;
    let hasMorphNormal = false;

    for (let i = 0, il = targets.length; i < il; i++) {
      const target = targets[i];

      if (target.POSITION !== undefined) hasMorphPosition = true;
      if (target.NORMAL !== undefined) hasMorphNormal = true;

      if (hasMorphPosition && hasMorphNormal) break;
    }

    if (!hasMorphPosition && !hasMorphNormal) return Promise.resolve(geometry);

    const pendingPositionAccessors = [];
    const pendingNormalAccessors = [];

    for (let i = 0, il = targets.length; i < il; i++) {
      const target = targets[i];

      if (hasMorphPosition) {
        const pendingAccessor =
          target.POSITION !== undefined
            ? parser.getDependency("accessor", target.POSITION)
            : geometry.attributes.position;

        pendingPositionAccessors.push(pendingAccessor);
      }

      if (hasMorphNormal) {
        const pendingAccessor =
          target.NORMAL !== undefined
            ? parser.getDependency("accessor", target.NORMAL)
            : geometry.attributes.normal;

        pendingNormalAccessors.push(pendingAccessor);
      }
    }

    return Promise.all([
      Promise.all(pendingPositionAccessors),
      Promise.all(pendingNormalAccessors)
    ]).then((accessors) => {
      const morphPositions = accessors[0];
      const morphNormals = accessors[1];

      if (hasMorphPosition) geometry.morphAttributes.position = morphPositions;
      if (hasMorphNormal) geometry.morphAttributes.normal = morphNormals;
      geometry.morphTargetsRelative = true;

      return geometry;
    });
  };

  /**
   * @param {Mesh} mesh
   * @param {GLTF.Mesh} meshDef
   */
  updateMorphTargets = (mesh: Mesh, meshDef: GLTF.Mesh) => {
    mesh.updateMorphTargets();

    if (meshDef.weights !== undefined) {
      for (const i = 0, il = meshDef.weights.length; i < il; i++) {
        mesh.morphTargetInfluences[i] = meshDef.weights[i];
      }
    }

    // .extras has user-defined data, so check that .extras.targetNames is an array.
    if (meshDef.extras && Array.isArray(meshDef.extras.targetNames)) {
      const targetNames = meshDef.extras.targetNames;

      if (mesh.morphTargetInfluences.length === targetNames.length) {
        mesh.morphTargetDictionary = {};

        for (let i = 0, il = targetNames.length; i < il; i++) {
          mesh.morphTargetDictionary[targetNames[i]] = i;
        }
      } else {
        console.warn(
          "THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names."
        );
      }
    }
  };

  createPrimitiveKey = (primitiveDef: MeshPrimitive) => {
    const dracoExtension =
      primitiveDef.extensions &&
      primitiveDef.extensions[EXTENSIONS.KHR_DRACO_MESH_COMPRESSION];
    let geometryKey: string;

    if (dracoExtension) {
      geometryKey =
        "draco:" +
        dracoExtension.bufferView +
        ":" +
        dracoExtension.indices +
        ":" +
        this.createAttributesKey(dracoExtension.attributes);
    } else {
      geometryKey =
        primitiveDef.indices +
        ":" +
        this.createAttributesKey(primitiveDef.attributes) +
        ":" +
        primitiveDef.mode;
    }

    return geometryKey;
  };

  createAttributesKey = (attributes: any) => {
    let attributesKey = "";

    const keys = Object.keys(attributes).sort();

    for (let i = 0, il = keys.length; i < il; i++) {
      attributesKey += keys[i] + ":" + attributes[keys[i]] + ";";
    }

    return attributesKey;
  };
}
