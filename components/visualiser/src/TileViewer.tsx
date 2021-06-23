import React from "react";
import * as THREE from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import modelCache from "./ModelCache";
import getRef from "./GetRef";
import textureCache from "./TextureCache";
import { Colour, Siding, Tile } from "./Types";
import styles from "./styles/TileViewer.module.scss";

interface Props {
  tile: Tile;
  colour: Colour;
  options: { contentSource: string };
  siding: Siding;
  setIsLoading: (isLoading: boolean) => void;
}

interface State {
  isLoading: boolean;
}

export default class TileViewer extends React.Component<Props, State> {
  tile?: GLTF;
  controls?: OrbitControls;
  renderer?: THREE.WebGLRenderer;
  diffuseImage?: THREE.Texture;
  metalicImage?: THREE.Texture;
  normalImage?: THREE.Texture;
  tileMaterial?: THREE.MeshStandardMaterial;
  scene?: THREE.Scene;
  camera?: THREE.PerspectiveCamera;
  container?: HTMLDivElement | null;

  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: true
    };
    this.onWindowResize = this.onWindowResize.bind(this);
    this.setIsLoading = this.setIsLoading.bind(this);
  }

  UNSAFE_componentWillReceiveProps(props: Props) {
    if (props.tile !== this.props.tile || props.colour !== this.props.colour) {
      this.setIsLoading(true);
      this.loadModel(props);
      this.controls?.reset();
    }
  }

  componentWillUnmount() {
    if (this.renderer) {
      this.renderer.domElement?.parentNode?.removeChild(
        this.renderer.domElement
      );
    }
    window.removeEventListener("resize", this.onWindowResize);
  }

  componentDidMount() {
    this.setIsLoading(true);
    this.load();
    window.addEventListener("resize", this.onWindowResize, false);
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
      this.tileMaterial = new THREE.MeshStandardMaterial();
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
        (gltf.scene.children[1] as THREE.Mesh).material = this.tileMaterial;

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
      const scene = new THREE.Scene();
      this.scene = scene;

      let light = new THREE.PointLight(0xffffff, 1, 100);
      light.position.set(1, 5, 1);
      light.castShadow = true;
      scene.add(light);

      // Backlight. Secondary light which throws some light onto the underside.
      // This just has the job of providing some directional light in the shadows.

      light = new THREE.PointLight(0xffffff, 1, 100);
      light.intensity = 0.8;
      light.position.set(-1, -5, -1);
      scene.add(light);

      window.scene = scene;
    }

    if (!this.renderer) {
      const camera = new THREE.PerspectiveCamera(
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

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setClearColor("#fff", 1);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(size.width, size.height);
      /*renderer.toneMapping = THREE.ACESFilmicToneMapping;
			renderer.toneMappingExposure = 1;*/
      renderer.outputEncoding = THREE.sRGBEncoding;
      this.container.appendChild(renderer.domElement);

      this.renderer = renderer;
      this.camera = camera;

      const { contentSource } = this.props.options;

      // Product owner suggestion - display tiles on a white background.
      textureCache(`${contentSource}/content/whiteBackdrop.png`).then((tex) => {
        tex.mapping = THREE.EquirectangularReflectionMapping;
        tex.encoding = THREE.LinearEncoding;
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

  onWindowResize() {
    this.renderFrame();
  }

  renderFrame() {
    if (!this.container) {
      return;
    }

    const size = this.container.getBoundingClientRect();
    this.camera!.aspect = size.width / size.height;
    this.camera!.updateProjectionMatrix();

    this.renderer!.setSize(size.width, size.height);
    this.renderer!.render(this.scene!, this.camera!);
  }

  setIsLoading(isLoading: boolean) {
    if (this.props.setIsLoading) {
      this.props.setIsLoading(isLoading);
    }
    this.setState({ isLoading });
  }

  render() {
    return (
      <div className={styles["tile-viewer"]}>
        <div
          ref={(r) => {
            this.container = r;
          }}
        />
      </div>
    );
  }
}
