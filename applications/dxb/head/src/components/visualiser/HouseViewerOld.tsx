import {
  AmbientLight,
  AxesHelper,
  Box2,
  DirectionalLight,
  EquirectangularReflectionMapping,
  Group,
  InstancedMesh,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  sRGBEncoding,
  Vector2,
  WebGLRenderer
} from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import tileSlice from "./TileSlice";
import modelCache from "./ModelCache";
import textureCache from "./TextureCache";
import getRef from "./GetRef";
import roofSegmentGenerator from "./RoofSegmentGeneratorOld";
import { Colour, Siding, Tile } from "./Types";
import Viewer, {
  Props as ViewerProps,
  State as ViewerState
} from "./ViewerOld";

interface Props extends ViewerProps {
  siding: Siding;
}

interface State extends ViewerState {
  colour?: Colour;
  siding?: Siding;
}

export default class HouseViewer extends Viewer<Props, State> {
  snowFences?: Object3D[];
  roof?: Group;
  walls?: Mesh;
  houseLoader?: unknown;
  sidingMaterial?: unknown;

  constructor(props: Props) {
    super(props, { isLoading: true });
  }

  propsChanged(props: Props) {
    return super.propsChanged(props) || props.siding !== this.props.siding;
  }

  async loadModel(props: Props) {
    if (props.colour !== this.state.colour) {
      this.setState({
        colour: props.colour
      });
      await this.loadHouse(props.colour, props.tile);
    }

    if (props.siding !== this.state.siding) {
      this.setState({
        siding: props.siding
      });
      await this.loadSiding(props.siding);
    }
    this.setIsLoading(false);
  }

  async loadHouse(colour: Colour, tileInfo: Tile) {
    // Create roof tile material:
    this.diffuseImage = undefined;
    const mat = new MeshStandardMaterial();
    mat.name = colour.name;

    const { options } = this.props;
    const { contentSource } = options;

    const normalRef = colour.normalMapOverrideRef
      ? colour.normalMapOverrideRef
      : tileInfo.normalMapRef;
    const normalUrl = getRef(normalRef, {
      size: "original",
      contentSource
    });
    const metallicRef = colour.metallicRoughnessMapOverrideRef
      ? colour.metallicRoughnessMapOverrideRef
      : tileInfo.metallicRoughnessMapRef;
    const metalicUrl = getRef(metallicRef, {
      size: "original",
      contentSource
    });
    const diffuseUrl = getRef(colour.diffuseMapRef, {
      size: "original",
      contentSource
    });

    if (metalicUrl) {
      const metalicTexture = await textureCache(metalicUrl);
      this.metalicImage = metalicTexture;
      mat.metalnessMap = this.metalicImage;
      mat.roughnessMap = this.metalicImage;
      mat.needsUpdate = true;
      this.renderFrame();
    }

    if (normalUrl) {
      const normalTexture = await textureCache(normalUrl);
      this.normalImage = normalTexture;
      mat.normalMap = normalTexture;
      mat.needsUpdate = true;
      this.renderFrame();
    }

    if (diffuseUrl) {
      const diffuseTexture = await textureCache(diffuseUrl);
      this.diffuseImage = diffuseTexture;
      mat.map = diffuseTexture;
      mat.needsUpdate = true;

      const tileRef = getRef(tileInfo.lowDetailMeshRef, { contentSource });
      const tilePromise = tileRef ? modelCache(tileRef) : undefined;
      const ridgeRef = getRef(tileInfo.ridgeRef, { contentSource });
      const ridgePromise = ridgeRef ? modelCache(ridgeRef) : undefined;
      const ridgeEndRef = getRef(tileInfo.ridgeEndRef, { contentSource });
      const ridgeEndPromise = ridgeEndRef ? modelCache(ridgeEndRef) : undefined;

      // put inside this request to prevent 'white flashes'
      const promiseResults = await Promise.all([
        tilePromise,
        ridgePromise,
        ridgeEndPromise
      ]);
      const results = promiseResults.filter(Boolean) as GLTF[];
      // Find the meshes:
      const tileMesh = this.findMesh(results[0]);
      if (!tileMesh) {
        return;
      }
      const ridgeMesh =
        results.length >= 2 && results[1]
          ? this.findMesh(results[1])
          : undefined;
      if (!ridgeMesh) {
        return;
      }
      const ridgeEndMesh =
        results.length >= 3 && results[2]
          ? this.findMesh(results[2])
          : undefined;

      // Generate the roof now:
      this.generateRoof(tileInfo, mat, tileMesh, ridgeMesh, ridgeEndMesh);

      this.renderFrame();
    }

    if (this.snowFences) {
      this.snowFences.forEach((fence) => {
        fence.visible = tileInfo.snowFenceActive;
      });
      this.renderFrame();
    }
  }

  /*
   * Finds the first threejs Mesh node in the given gltf
   */
  findMesh(gltf: GLTF): Mesh | undefined {
    let result: Mesh | undefined;

    gltf.scene.traverse((node) => {
      if (!result && node && "isMesh" in node && node["isMesh"]) {
        result = node as Mesh;
      }
    });

    return result;
  }

  generateRoof(
    tileInfo: Tile,
    material: MeshStandardMaterial,
    tileMesh: Mesh,
    ridgeMesh: Mesh,
    ridgeEndMesh?: Mesh
  ) {
    const roofLayout = {
      ridges: [
        {
          length: 12.7,
          position: {
            x: -6.55,
            y: 6.85,
            z: 0.22
          },
          rotation: {
            x: 0,
            y: 1.57079,
            z: 0
          }
        }
      ],
      segments: [
        {
          // Largest one at the back
          minX: 0,
          maxX: 12.6,
          minZ: 0,
          maxZ: 5,
          position: {
            x: 6.1,
            y: 3.66,
            z: 4.55
          },
          rotation: {
            x: 0.634,
            y: 3.1415,
            z: 0
          }
        },
        {
          // Front left
          minX: 0,
          maxX: 4.23,
          minZ: 0,
          maxZ: 5,
          position: {
            x: 1.9,
            y: 3.66,
            z: -4.15
          },
          rotation: {
            x: -0.634,
            y: 0,
            z: 0
          }
        },
        {
          // Front right
          minX: 0,
          maxX: 4.23,
          minZ: 0,
          maxZ: 5,
          position: {
            x: -6.5,
            y: 3.66,
            z: -4.15
          },
          rotation: {
            x: -0.634,
            y: 0,
            z: 0
          }
        },
        {
          // Front middle
          minX: 0,
          maxX: 5.08,
          minZ: 0,
          maxZ: 4.4,
          position: {
            x: -2.75,
            y: 5.33,
            z: -4.35
          },
          rotation: {
            x: -0.32,
            y: 0,
            z: 0
          }
        },
        {
          // Smaller one at the back
          minX: 0,
          maxX: 4.2,
          minZ: 0,
          maxZ: 1.6,
          position: {
            x: 1.9,
            y: 2.4,
            z: 5.8
          },
          rotation: {
            x: 0.4,
            y: 3.1415,
            z: 0
          }
        }
      ]
    };

    // The "segments" of the roof. These are rectangular segments of tiles.
    const segs = roofLayout.segments;

    if (this.roof) {
      this.scene?.remove(this.roof);
      this.roof = undefined;
    }

    const roof = new Group();

    for (let i = 0; i < segs.length; i++) {
      // eslint-disable-next-line security/detect-object-injection
      const seg = segs[i];

      const newRoofSeg = roofSegmentGenerator(
        new Box2(
          new Vector2(seg.minX, seg.minZ),
          new Vector2(seg.maxX, seg.maxZ)
        ),
        tileMesh,
        tileInfo,
        material
      );

      if (!newRoofSeg) {
        return;
      }

      newRoofSeg.position.x = seg.position.x;
      newRoofSeg.position.y = seg.position.y;
      newRoofSeg.position.z = seg.position.z;

      newRoofSeg.rotation.x = seg.rotation.x;
      newRoofSeg.rotation.y = seg.rotation.y;
      newRoofSeg.rotation.z = seg.rotation.z;
      roof.add(newRoofSeg);
    }

    if (ridgeMesh && roofLayout.ridges) {
      // Generating the ridge(s) for this roof.
      let boundingBox = ridgeMesh.geometry.boundingBox;
      if (!boundingBox) {
        return;
      }
      const minZOffset = boundingBox.min.z;
      const ridgeTileLength = boundingBox.max.z - minZOffset;
      const ridges = roofLayout.ridges;

      for (let i = 0; i < ridges.length; i++) {
        // eslint-disable-next-line security/detect-object-injection
        const ridge = ridges[i];
        let ridgeEndLength = 0;

        if (ridgeEndMesh) {
          // Ridge ends are the 2 specialised tiles that go
          // at the ends of ridges to cap them off.
          boundingBox = ridgeEndMesh.geometry.boundingBox;
          ridgeEndLength = boundingBox
            ? boundingBox.max.z - boundingBox.min.z
            : 0;
        }

        const numberOfRidgeTiles =
          (ridge.length - ridgeEndLength * 2) / ridgeTileLength;
        const intNumberOfRidgeTiles = Math.floor(numberOfRidgeTiles);

        const ridgeInstance = new InstancedMesh(
          ridgeMesh.geometry.clone(),
          material,
          intNumberOfRidgeTiles
        );
        const placementHelper = new Object3D();

        let posZ = 0;

        if (ridgeEndMesh) {
          // Ridge ends are the 2 specialised tiles that go
          // at the ends of ridges to cap them off.
          posZ += ridgeEndLength;

          const ends = new InstancedMesh(
            ridgeEndMesh.geometry.clone(),
            material,
            2
          );

          // Offset along the axis by the min of the bounding box such that the min face
          // sits exactly at 0. This helps line up objects of varying length.
          placementHelper.position.set(0, -0.05, -(boundingBox?.min.z || 0));
          placementHelper.rotation.y = Math.PI;
          placementHelper.updateMatrix();

          ends.setMatrixAt(0, placementHelper.matrix);

          placementHelper.position.set(
            0,
            -0.05,
            ridge.length - ridgeEndLength - (boundingBox?.min.z || 0)
          );
          placementHelper.rotation.y = 0;
          placementHelper.updateMatrix();

          ends.setMatrixAt(1, placementHelper.matrix);

          ridgeInstance.add(ends);
        }

        // The integer number of ridge tiles:
        for (let z = 0; z < intNumberOfRidgeTiles; z++) {
          placementHelper.position.set(0, 0, posZ - minZOffset);
          placementHelper.updateMatrix();

          ridgeInstance.setMatrixAt(z, placementHelper.matrix);

          posZ += ridgeTileLength;
        }

        // And finally a sliced tile to fill the little gap that remains:
        const remainingGap =
          (numberOfRidgeTiles - intNumberOfRidgeTiles) * ridgeTileLength;

        const ridgeGapTile = tileSlice(
          ridgeMesh.geometry,
          (ridgeMesh.geometry.boundingBox?.max.z || 0) - remainingGap,
          "z",
          "right"
        );

        // Note: uses InstancedMesh because materials can't be shared between Mesh and InstancedMesh.
        // It has no particular performance downside.
        const ridgeGap = new InstancedMesh(ridgeGapTile, material, 1);
        placementHelper.position.set(
          0,
          0,
          posZ - (ridgeTileLength - remainingGap) - minZOffset
        );
        placementHelper.updateMatrix();
        ridgeGap.setMatrixAt(0, placementHelper.matrix);
        ridgeInstance.add(ridgeGap);

        ridgeInstance.position.x = ridge.position.x;
        ridgeInstance.position.y = ridge.position.y;
        ridgeInstance.position.z = ridge.position.z;

        ridgeInstance.rotation.x = ridge.rotation.x;
        ridgeInstance.rotation.y = ridge.rotation.y;
        ridgeInstance.rotation.z = ridge.rotation.z;
        roof.add(ridgeInstance);
      }
    }

    this.scene?.add(roof);
    this.roof = roof;
    this.renderFrame();
  }

  async loadSiding(siding: Siding) {
    const mat = new MeshStandardMaterial();

    const { options } = this.props;
    const { contentSource } = options;

    const normalUrl = getRef(siding.normalMapRef, {
      size: "original",
      contentSource
    });
    const metalicUrl = getRef(siding.metallicRoughnessMapRef, {
      size: "original",
      contentSource
    });
    const diffuseUrl = getRef(siding.diffuseMapRef, {
      size: "original",
      contentSource
    });

    if (diffuseUrl) {
      await textureCache(diffuseUrl).then((tex) => {
        this.diffuseImage = tex;
        mat.map = tex;
        mat.needsUpdate = true;
        if (this.walls) {
          this.walls.material = mat;
        }

        this.renderFrame();
      });
    }

    if (metalicUrl) {
      await textureCache(metalicUrl).then((tex) => {
        this.metalicImage = tex;
        mat.metalnessMap = this.metalicImage;
        mat.roughnessMap = this.metalicImage;
        mat.needsUpdate = true;
        if (this.walls) {
          this.walls.material = mat;
        }

        this.renderFrame();
      });
    }

    if (normalUrl) {
      await textureCache(normalUrl).then((tex) => {
        this.normalImage = tex;
        mat.normalMap = tex;
        mat.needsUpdate = true;

        if (this.walls) {
          this.walls.material = mat;
        }

        this.renderFrame();
      });
    }

    if (this.walls) {
      this.walls.material = mat;
    }
  }

  load() {
    if (!this.container) {
      // Dom not ready yet
      return;
    }

    const size = this.container.getBoundingClientRect();

    if (!this.camera) {
      const camera = new PerspectiveCamera(
        45,
        size.width / size.height,
        0.25,
        80
      );

      // default position was obtained by moving the camera to a suitable spot and just grabbing the values:
      camera.position.set(-4.8511, 10.942, -10.438);
      camera.rotation.x = -2.37;
      camera.rotation.y = -0.327;
      camera.rotation.z = -2.838;
      this.camera = camera;
    }

    if (!this.scene) {
      const scene = new Scene();
      this.scene = scene;

      // Key light. Directional light is at the given position and looks at the origin. Health warning: Rotating it will do nothing!
      const light = new DirectionalLight(0xffffff, 1);
      light.position.set(-20, 20, -20);
      light.castShadow = true;

      // Shadow cameras have to be explicitly configured. Use the "camera helper" below to get a visual of what the shadow cam looks like.
      light.shadow.mapSize.width = 2048;
      light.shadow.mapSize.height = 2048;
      light.shadow.camera.near = 0.5;
      light.shadow.camera.far = 60;
      light.shadow.camera.left = -10;
      light.shadow.camera.right = 10;
      light.shadow.camera.top = 10;
      light.shadow.camera.bottom = -10;
      light.shadow.bias = -0.0005;
      scene.add(light);

      /*
			// Use this to visualise where the light is and what the above shadow camera numbers do
			const shadowHelper = new CameraHelper( light.shadow.camera );
			scene.add( shadowHelper );
			*/

      // Backlight. Secondary directional ambient light which acts as slight sky bounce.
      // This just has the job of providing some directional light in the shadows.
      const secondaryLight = new DirectionalLight(0x4287f5, 0.5);
      secondaryLight.position.set(83.5, 50.1, 75.3);
      scene.add(secondaryLight);

      // Fill light. This drives the colour of shadowed areas. Stacks with the environment map.
      const amb = new AmbientLight(0x2f4352); // soft slightly blue light
      scene.add(amb);

      // Add axes to help with debugging any changes required with the co-ordinates
      if (process.env.NODE_ENV === "development") {
        this.scene?.add(new AxesHelper(20));
      }

      window.scene = scene;
    }

    if (!this.houseLoader) {
      const { options } = this.props;
      const { contentSource } = options;

      let housePath = getRef("public:models/house/v6", {
        contentSource
      });
      housePath = housePath?.substring(0, housePath.length - 10) + "/";

      modelCache(housePath + "Ridge.glb").then((gltf) => {
        const ridge = gltf.scene.getObjectByName("Zara_hus_FBX_03_mone");
        this.scene?.add(gltf.scene);
        ridge && (ridge.position.y = -0.05);
      });

      this.houseLoader = modelCache(housePath + "Zara_house_FBX.glb").then(
        (gltf) => {
          // Mark everything as shadow casting:
          gltf.scene.traverse((node) => {
            if ("isMesh" in node && node["isMesh"]) {
              (node as Mesh).castShadow = true;
              (node as Mesh).receiveShadow = true;
            }
          });

          // Delete the rough roof:
          const roofMetal = gltf.scene.getObjectByName("Roof_metal_rough");
          if (roofMetal) {
            roofMetal.position.y = 5.275;
          }
          this.deleteObject(gltf.scene, "Roof_shielding_metal_rough");
          this.deleteObject(gltf.scene, "GRASS");
          this.deleteObject(gltf.scene, "Grass");

          this.scene?.add(gltf.scene);

          const walls = gltf.scene.getObjectByName("Wall");
          if (walls && "isMesh" in walls && walls["isMesh"]) {
            this.walls = walls as Mesh;
            this.sidingMaterial = (walls as Mesh).material;
          }

          const fences = ["Snow_fence", "Snow_fence.001", "Snow_fence.002"];
          this.snowFences = fences
            .map((fenceName) => gltf.scene.getObjectByName(fenceName))
            .filter(Boolean) as Object3D[];

          /*
				if(this.sidingImage && this.sidingMaterial){
					this.sidingMaterial.map = this.sidingImage;
					this.sidingMaterial.needsUpdate = true;
					this.sidingMaterial.map.needsUpdate = true;
				}
				*/

          this.renderFrame();
          this.loadModel(this.props);
        }
      );

      textureCache(`${contentSource}/content/whiteBackdrop.png`).then((tex) => {
        // '/content/HDRI_2k_8bit_graded.jpg' (field image)
        tex.mapping = EquirectangularReflectionMapping;
        if (this.scene) {
          this.scene.background = tex;
          this.scene.environment = tex;
        }
      });
    }

    if (!this.renderer) {
      const renderer = new WebGLRenderer({ antialias: true });
      this.renderer = renderer;
      renderer.setClearColor("#fff", 1);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(size.width, size.height);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = PCFSoftShadowMap;
      // renderer.toneMapping = ACESFilmicToneMapping;
      // renderer.toneMappingExposure = 1;
      renderer.outputEncoding = sRGBEncoding;
      this.container.appendChild(renderer.domElement);
    }

    if (!this.controls) {
      const controls = new OrbitControls(this.camera, this.renderer.domElement);
      controls.addEventListener("change", () => this.renderFrame());
      this.controls = controls;
      controls.minDistance = 10;
      controls.maxDistance = 30;
      controls.maxPolarAngle = 1.35;

      controls.target.set(0, 1, 0);
      controls.update();
    }
    this.renderFrame();
  }

  deleteObject(scene: Group, name: string) {
    const obj = scene.getObjectByName(name);
    obj?.parent?.remove(obj);
  }
}
