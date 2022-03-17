import {
  EquirectangularReflectionMapping,
  LinearEncoding,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  sRGBEncoding,
  WebGLRenderer
} from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import modelCache from "./ModelCache";
import getRef from "./GetRef";
import textureCache from "./TextureCache";
import Viewer, { Props, State } from "./Viewer";

export default class TileViewer extends Viewer<Props, State> {
  tile?: GLTF;
  tileMaterial?: MeshStandardMaterial;

  constructor(props: Props) {
    super(props, { isLoading: true });
  }

  UNSAFE_componentWillReceiveProps(props: Props) {
    super.UNSAFE_componentWillReceiveProps(props);
    this.controls?.reset();
  }

  async loadModel(props: Props) {
    if (
      !this.props ||
      !this.tile ||
      props.tile !== this.props.tile ||
      props.colour !== this.props.colour
    ) {
      const { contentSource } = props.options;

      const modelUrl = getRef(props.tile.highDetailMeshRef, {
        contentSource
      }); // The url to the HD mesh:

      const normalRef = props.colour.normalMapOverrideRef
        ? props.colour.normalMapOverrideRef
        : props.tile.normalMapRef;
      const normalUrl = getRef(normalRef, {
        size: "original",
        contentSource
      });
      const metallicRef = props.colour.metallicRoughnessMapOverrideRef
        ? props.colour.metallicRoughnessMapOverrideRef
        : props.tile.metallicRoughnessMapRef;
      const metalicUrl = getRef(metallicRef, {
        size: "original",
        contentSource
      });
      const diffuseUrl = getRef(props.colour.diffuseMapRef, {
        size: "original",
        contentSource
      });

      if (typeof diffuseUrl === "string") {
        this.diffuseImage = await textureCache(diffuseUrl);
      }
      if (typeof metalicUrl === "string") {
        this.metalicImage = await textureCache(metalicUrl);
      }
      if (typeof normalUrl === "string") {
        this.normalImage = await textureCache(normalUrl);
      }

      if (this.tileMaterial) {
        this.tileMaterial.map = this.diffuseImage || null;
        this.tileMaterial.metalnessMap = this.metalicImage || null;
        this.tileMaterial.roughnessMap = this.metalicImage || null;
        this.tileMaterial.normalMap = this.normalImage || null;
        this.tileMaterial.needsUpdate = true;
      }

      let gltf: GLTF | undefined;
      // Load it:
      if (typeof modelUrl === "string") {
        gltf = await modelCache(modelUrl);
      }
      if (this.tile) {
        this.scene?.remove(this.tile.scene);
      }
      if (this.camera) {
        const zoomFactor = this.props.tile.isLargeTile ? 0.34 : 0.17; // if its a large tile, then we zoom out a bit more
        this.camera.position.set(
          -1.8 * zoomFactor,
          7.5 * zoomFactor,
          2.7 * zoomFactor
        );
      }

      if (gltf) {
        this.tile = gltf;
      }

      // Create roof tile material
      this.tileMaterial = new MeshStandardMaterial();
      this.tileMaterial.name = this.props.colour.name;
      if (this.diffuseImage) {
        this.tileMaterial.map = this.diffuseImage;
      }

      if (this.metalicImage) {
        this.tileMaterial.metalnessMap = this.metalicImage;
        this.tileMaterial.roughnessMap = this.metalicImage;
      }

      if (this.normalImage) {
        this.tileMaterial.normalMap = this.normalImage;
      }

      this.tileMaterial.needsUpdate = true;
      if (gltf) {
        (gltf.scene.children[1] as Mesh).material = this.tileMaterial;

        // Add to scene:
        this.scene?.add(gltf.scene);
      }
      // Redraw:
      this.renderFrame();
      this.setIsLoading(false);
    }
  }

  load() {
    if (!this.container) {
      // Dom not ready yet
      return;
    }

    const size = this.container.getBoundingClientRect();

    if (!this.scene) {
      const scene = new Scene();
      this.scene = scene;

      let light = new PointLight(0xffffff, 1, 100);
      light.position.set(1, 5, 1);
      light.castShadow = true;
      scene.add(light);

      // Backlight. Secondary light which throws some light onto the underside.
      // This just has the job of providing some directional light in the shadows.

      light = new PointLight(0xffffff, 1, 100);
      light.intensity = 0.8;
      light.position.set(-1, -5, -1);
      scene.add(light);

      window.scene = scene;
    }

    if (!this.renderer) {
      const camera = new PerspectiveCamera(
        45,
        size.width / size.height,
        0.01,
        80
      );
      const zoomFactor = this.props.tile.isLargeTile ? 0.34 : 0.17; // if its a large tile, then we zoom out a bit more
      camera.position.set(
        -1.8 * zoomFactor,
        7.5 * zoomFactor,
        2.7 * zoomFactor
      );

      const renderer = new WebGLRenderer({ antialias: true });
      renderer.setClearColor("#fff", 1);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(size.width, size.height);
      /*renderer.toneMapping = ACESFilmicToneMapping;
			renderer.toneMappingExposure = 1;*/
      renderer.outputEncoding = sRGBEncoding;
      this.container.appendChild(renderer.domElement);

      this.renderer = renderer;
      this.camera = camera;

      const { contentSource } = this.props.options;

      // Product owner suggestion - display tiles on a white background.
      textureCache(`${contentSource}/content/whiteBackdrop.png`).then((tex) => {
        tex.mapping = EquirectangularReflectionMapping;
        tex.encoding = LinearEncoding;
        if (this.scene) {
          this.scene.background = tex;
          this.scene.environment = tex;
        }

        // Backdrop has loaded - redraw now:
        this.renderFrame();
      });
    }

    if (!this.controls) {
      const controls = new OrbitControls(
        this.camera!,
        this.renderer.domElement
      );
      controls.addEventListener("change", () => this.renderFrame()); // use if there is no animation loop
      controls.minDistance = 0.5;
      controls.maxDistance = 3;
      this.controls = controls;

      controls.target.set(0, 0, 0);
      controls.update();
    }

    this.renderFrame();
    this.loadModel(this.props);
  }
}
