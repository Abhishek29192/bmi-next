/* eslint-disable react/prop-types */
import React from "react";
import * as THREE from "../Functions/ThreeJs/ThreeJs.js";
import { OrbitControls } from "../Functions/ThreeJsUtils/OrbitCamera/OrbitCamera.js";
import modelCache from "../Functions/ModelCache/ModelCache.jsx";
import getRef from "../Functions/GetRef/GetRef.jsx";
import textureCache from "../Functions/TextureCache/TextureCache.jsx";

export default class TileViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
    this.onWindowResize = this.onWindowResize.bind(this);
    this.setIsLoading = this.setIsLoading.bind(this);
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(props) {
    if (props.tile !== this.props.tile || props.colour !== this.props.colour) {
      this.setIsLoading(true);
      this.loadModel(props);
      this.controls.reset();
    }
  }

  componentWillUnmount() {
    if (this.renderer) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
    window.removeEventListener("resize", this.onWindowResize);
  }

  componentDidMount() {
    this.setIsLoading(true);
    window.addEventListener("resize", this.onWindowResize, false);
  }

  async loadModel(props) {
    if (
      !this.props ||
      !this.tile ||
      props.tile !== this.props.tile ||
      props.colour !== this.props.colour
    ) {
      var { contentSource } = props.options;

      var modelUrl = getRef(props.tile.highDetailMeshRef, {
        url: true,
        contentSource
      }); // The url to the HD mesh:

      var normalRef = props.colour.normalMapOverrideRef
        ? props.colour.normalMapOverrideRef
        : props.tile.normalMapRef;
      var normalUrl = getRef(normalRef, {
        url: true,
        size: "original",
        contentSource
      });
      var metallicRef = props.colour.metallicRoughnessMapOverrideRef
        ? props.colour.metallicRoughnessMapOverrideRef
        : props.tile.metallicRoughnessMapRef;
      var metalicUrl = getRef(metallicRef, {
        url: true,
        size: "original",
        contentSource
      });
      var diffuseUrl = getRef(props.colour.diffuseMapRef, {
        url: true,
        size: "original",
        contentSource
      });

      this.diffuseImage = await textureCache(diffuseUrl);
      this.metalicImage = await textureCache(metalicUrl);
      this.normalImage = await textureCache(normalUrl);

      if (this.tileMaterial) {
        this.tileMaterial.map = this.diffuseImage;
        this.tileMaterial.metalnessMap = this.metalicImage;
        this.tileMaterial.roughnessMap = this.metalicImage;
        this.tileMaterial.normalMap = this.normalImage;
        this.tileMaterial.needsUpdate = true;
      }

      // Load it:
      modelCache(modelUrl)
        .then((gltf) => {
          if (this.tile) {
            this.scene.remove(this.tile.scene);
          }
          if (this.camera) {
            var zoomFactor = this.props.tile.isLargeTile ? 0.34 : 0.17; // if its a large tile, then we zoom out a bit more
            this.camera.position.set(
              -1.8 * zoomFactor,
              7.5 * zoomFactor,
              2.7 * zoomFactor
            );
          }

          this.tile = gltf;

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
          gltf.scene.children[1].material = this.tileMaterial;

          // Add to scene:
          this.scene.add(gltf.scene);
        })
        .then(() =>
          // Redraw:
          this.renderFrame()
        )
        .then(() => this.setIsLoading(false));
    }
  }

  load() {
    if (!this.container) {
      // Dom not ready yet
      return;
    }

    var size = this.container.getBoundingClientRect();

    if (!this.scene) {
      var scene = new THREE.Scene();
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
      var camera = new THREE.PerspectiveCamera(
        45,
        size.width / size.height,
        0.01,
        80
      );
      var zoomFactor = this.props.tile.isLargeTile ? 0.34 : 0.17; // if its a large tile, then we zoom out a bit more
      camera.position.set(
        -1.8 * zoomFactor,
        7.5 * zoomFactor,
        2.7 * zoomFactor
      );

      var renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setClearColor("#fff", 1);
      renderer.setFaceCulling(false);
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
        this.scene.background = tex;
        this.scene.environment = tex;

        // Backdrop has loaded - redraw now:
        this.renderFrame();
      });
    }

    if (!this.controls) {
      var controls = new OrbitControls(this.camera, this.renderer.domElement);
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
    var size = this.container.getBoundingClientRect();
    this.camera.aspect = size.width / size.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(size.width, size.height);
    this.renderer.render(this.scene, this.camera);
  }

  setIsLoading(isLoading) {
    if (this.props.setIsLoading) {
      this.props.setIsLoading(isLoading);
    }
    this.setState({ isLoading });
  }

  render() {
    return (
      <div className="tile-viewer">
        <div
          ref={(r) => {
            this.container = r;
            this.load();
          }}
        />
      </div>
    );
  }
}

TileViewer.propTypes = {};
