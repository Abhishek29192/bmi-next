/* eslint-disable react/prop-types */
import React from "react";
import * as THREE from "../Functions/ThreeJs/ThreeJs.js";
import { OrbitControls } from "../Functions/ThreeJsUtils/OrbitCamera/OrbitCamera.js";
import tileSlice from "../Functions/TileSlice/TileSlice.js";
import modelCache from "../Functions/ModelCache/ModelCache.jsx";
import textureCache from "../Functions/TextureCache/TextureCache.jsx";
import getRef from "../Functions/GetRef/GetRef.jsx";
import roofSegmentGenerator from "../Functions/RoofSegmentGenerator/RoofSegmentGenerator.jsx";

export default class HouseViewer extends React.Component {
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
    if (
      props.tile !== this.props.tile ||
      props.colour !== this.props.colour ||
      props.siding !== this.props.siding
    ) {
      this.setIsLoading(true);
      this.loadModel(props);
    }
  }

  async loadModel(props) {
    if (!this.ready) {
      return;
    }

    if (props.colour !== this.state.colour) {
      this.setState({
        colour: props.colour
      });

      await new Promise((resolve) =>
        resolve(this.loadHouse(props.colour, props.tile))
      );
    }

    if (props.siding !== this.state.siding) {
      this.setState({
        siding: props.siding
      });
      await this.loadSiding(props.siding);
    }
    this.setIsLoading(false);
  }

  async loadHouse(colour, tileInfo) {
    // Create roof tile material:
    this.diffuseImage = null;
    var mat = new THREE.MeshStandardMaterial();
    mat.name = colour.name;

    var { options } = this.props;
    var { contentSource } = options;

    var normalRef = colour.normalMapOverrideRef
      ? colour.normalMapOverrideRef
      : tileInfo.normalMapRef;
    var normalUrl = getRef(normalRef, {
      url: true,
      size: "original",
      contentSource
    });
    var metallicRef = colour.metallicRoughnessMapOverrideRef
      ? colour.metallicRoughnessMapOverrideRef
      : tileInfo.metallicRoughnessMapRef;
    var metalicUrl = getRef(metallicRef, {
      url: true,
      size: "original",
      contentSource
    });
    var diffuseUrl = getRef(colour.diffuseMapRef, {
      url: true,
      size: "original",
      contentSource
    });

    await textureCache(metalicUrl).then((tex) => {
      this.metalicImage = tex;
      mat.metalnessMap = this.metalicImage;
      mat.roughnessMap = this.metalicImage;
      mat.needsUpdate = true;
      this.renderFrame();
    });

    await textureCache(normalUrl).then((tex) => {
      this.normalImage = tex;
      mat.normalMap = tex;
      mat.needsUpdate = true;
      this.renderFrame();
    });

    await textureCache(diffuseUrl).then((tex) => {
      this.diffuseImage = tex;
      mat.map = tex;
      mat.needsUpdate = true;

      var tilePromise = modelCache(
        getRef(tileInfo.lowDetailMeshRef, { url: true, contentSource })
      );
      var ridgePromise = tileInfo.ridgeRef
        ? modelCache(getRef(tileInfo.ridgeRef, { url: true, contentSource }))
        : null;
      var ridgeEndPromise = tileInfo.ridgeEndRef
        ? modelCache(getRef(tileInfo.ridgeEndRef, { url: true, contentSource }))
        : null;

      // put inside this request to prevent 'white flashes'
      Promise.all([tilePromise, ridgePromise, ridgeEndPromise]).then(
        (results) => {
          // Find the meshes:
          var tileMesh = this.findMesh(results[0]);
          var ridgeMesh =
            results.length >= 2 && results[1]
              ? this.findMesh(results[1])
              : null;
          var ridgeEndMesh =
            results.length >= 3 && results[2]
              ? this.findMesh(results[2])
              : null;

          // Generate the roof now:
          this.generateRoof(tileInfo, tileMesh, ridgeMesh, ridgeEndMesh, mat);
        }
      );

      this.renderFrame();
    });

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
  findMesh(gltf) {
    var result;

    gltf.scene.traverse((node) => {
      if (!result && node && node.isMesh) {
        result = node;
      }
    });

    return result;
  }

  generateRoof(tileInfo, tileMesh, ridgeMesh, ridgeEndMesh, material) {
    var roofLayout = {
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
    var segs = roofLayout.segments;

    if (this.roof) {
      this.scene.remove(this.roof);
      this.roof = null;
    }

    var roof = new THREE.Group();

    for (var i = 0; i < segs.length; i++) {
      var seg = segs[i];

      var newRoofSeg = roofSegmentGenerator(
        new THREE.Box2(
          new THREE.Vector2(seg.minX, seg.minZ),
          new THREE.Vector2(seg.maxX, seg.maxZ)
        ),
        tileMesh,
        tileInfo,
        material
      );

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
      var boundingBox = ridgeMesh.geometry.boundingBox;
      var minZOffset = boundingBox.min.z;
      var ridgeTileLength = boundingBox.max.z - minZOffset;
      var ridges = roofLayout.ridges;

      for (let i = 0; i < ridges.length; i++) {
        var ridge = ridges[i];
        var ridgeEndLength = 0;

        if (ridgeEndMesh !== null) {
          // Ridge ends are the 2 specialised tiles that go
          // at the ends of ridges to cap them off.
          boundingBox = ridgeEndMesh.geometry.boundingBox;
          ridgeEndLength = boundingBox.max.z - boundingBox.min.z;
        }

        var numberOfRidgeTiles =
          (ridge.length - ridgeEndLength * 2) / ridgeTileLength;
        var intNumberOfRidgeTiles = Math.floor(numberOfRidgeTiles);

        var ridgeInstance = new THREE.InstancedMesh(
          ridgeMesh.geometry.clone(),
          material,
          intNumberOfRidgeTiles
        );
        var placementHelper = new THREE.Object3D();

        var posZ = 0;

        if (ridgeEndMesh !== null) {
          // Ridge ends are the 2 specialised tiles that go
          // at the ends of ridges to cap them off.
          posZ += ridgeEndLength;

          var ends = new THREE.InstancedMesh(
            ridgeEndMesh.geometry.clone(),
            material,
            2
          );

          // Offset along the axis by the min of the bounding box such that the min face
          // sits exactly at 0. This helps line up objects of varying length.
          placementHelper.position.set(0, -0.05, -boundingBox.min.z);
          placementHelper.rotation.y = Math.PI;
          placementHelper.updateMatrix();

          ends.setMatrixAt(0, placementHelper.matrix);

          placementHelper.position.set(
            0,
            -0.05,
            ridge.length - ridgeEndLength - boundingBox.min.z
          );
          placementHelper.rotation.y = 0;
          placementHelper.updateMatrix();

          ends.setMatrixAt(1, placementHelper.matrix);

          ridgeInstance.add(ends);
        }

        // The integer number of ridge tiles:
        for (var z = 0; z < intNumberOfRidgeTiles; z++) {
          placementHelper.position.set(0, 0, posZ - minZOffset);
          placementHelper.updateMatrix();

          ridgeInstance.setMatrixAt(z, placementHelper.matrix);

          posZ += ridgeTileLength;
        }

        // And finally a sliced tile to fill the little gap that remains:
        var remainingGap =
          (numberOfRidgeTiles - intNumberOfRidgeTiles) * ridgeTileLength;

        var ridgeGapTile = tileSlice(
          ridgeMesh.geometry,
          ridgeMesh.geometry.boundingBox.max.z - remainingGap,
          "z",
          "right"
        );

        // Note: uses InstancedMesh because materials can't be shared between THREE.Mesh and THREE.InstancedMesh.
        // It has no particular performance downside.
        var ridgeGap = new THREE.InstancedMesh(ridgeGapTile, material, 1);
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

    this.scene.add(roof);
    this.roof = roof;
    this.renderFrame();
  }

  async loadSiding(siding) {
    var mat = new THREE.MeshStandardMaterial();

    var { options } = this.props;
    var { contentSource } = options;

    var normalUrl = getRef(siding.normalMapRef, {
      url: true,
      size: "original",
      contentSource
    });
    var metalicUrl = getRef(siding.metallicRoughnessMapRef, {
      url: true,
      size: "original",
      contentSource
    });
    var diffuseUrl = getRef(siding.diffuseMapRef, {
      url: true,
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

  findMaterial(node, name) {
    if (node.material && node.material.name === name) {
      return node.material;
    }

    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        var cr = this.findMaterial(node.children[i], name);
        if (cr) {
          return cr;
        }
      }
    }
  }

  load() {
    if (!this.container) {
      // Dom not ready yet
      return;
    }

    var size = this.container.getBoundingClientRect();

    if (!this.camera) {
      var camera = new THREE.PerspectiveCamera(
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
      var scene = new THREE.Scene();
      this.scene = scene;

      // Key light. Directional light is at the given position and looks at the origin. Health warning: Rotating it will do nothing!
      var light = new THREE.DirectionalLight(0xffffff, 1);
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
      light.shadowBias = -0.0005;
      scene.add(light);

      /*
			// Use this to visualise where the light is and what the above shadow camera numbers do
			var shadowHelper = new THREE.CameraHelper( light.shadow.camera );
			scene.add( shadowHelper );
			*/

      // Backlight. Secondary directional ambient light which acts as slight sky bounce.
      // This just has the job of providing some directional light in the shadows.
      light = new THREE.DirectionalLight(0x4287f5, 0.5);
      light.position.set(83.5, 50.1, 75.3);
      scene.add(light);

      // Fill light. This drives the colour of shadowed areas. Stacks with the environment map.
      var amb = new THREE.AmbientLight(0x2f4352); // soft slightly blue light
      scene.add(amb);

      window.scene = scene;
    }

    if (!this.houseLoader) {
      var { options } = this.props;
      var { contentSource } = options;

      var housePath = getRef("public:models/house/v6", {
        url: true,
        contentSource
      });
      housePath = housePath.substring(0, housePath.length - 10) + "/";

      modelCache(housePath + "Ridge.glb").then((gltf) => {
        var ridge = gltf.scene.getObjectByName("Zara_hus_FBX_03_mone");
        this.scene.add(gltf.scene);
        ridge.position.y = -0.05;
      });

      this.houseLoader = modelCache(housePath + "Zara_house_FBX.glb").then(
        (gltf) => {
          // Mark everything as shadow casting:
          gltf.scene.traverse(function (node) {
            if (node.isMesh) {
              node.castShadow = true;
              node.receiveShadow = true;
            }
          });

          // Delete the rough roof:
          var roofMetal = gltf.scene.getObjectByName("Roof_metal_rough");
          if (roofMetal) {
            roofMetal.position.y = 5.275;
          }
          this.deleteObject(gltf.scene, "Roof_shielding_metal_rough");
          this.deleteObject(gltf.scene, "GRASS");
          this.deleteObject(gltf.scene, "Grass");

          this.scene.add(gltf.scene);

          var walls = gltf.scene.getObjectByName("Wall");
          this.walls = walls;
          this.sidingMaterial = walls.material;

          var fences = ["Snow_fence", "Snow_fence.001", "Snow_fence.002"];
          this.snowFences = fences.map((fenceName) =>
            gltf.scene.getObjectByName(fenceName)
          );

          /*
				if(this.sidingImage && this.sidingMaterial){
					this.sidingMaterial.map = this.sidingImage;
					this.sidingMaterial.needsUpdate = true;
					this.sidingMaterial.map.needsUpdate = true;
				}
				*/

          this.renderFrame();
          this.ready = true;
          this.loadModel(this.props);
        }
      );

      textureCache(`${contentSource}/content/whiteBackdrop.png`).then((tex) => {
        // '/content/HDRI_2k_8bit_graded.jpg' (field image)
        tex.mapping = THREE.EquirectangularReflectionMapping;
        this.scene.background = tex;
        this.scene.environment = tex;
      });
    }

    if (!this.renderer) {
      var renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer = renderer;
      renderer.setClearColor("#fff", 1);
      renderer.setFaceCulling(false);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(size.width, size.height);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      // renderer.toneMapping = THREE.ACESFilmicToneMapping;
      // renderer.toneMappingExposure = 1;
      renderer.outputEncoding = THREE.sRGBEncoding;
      this.container.appendChild(renderer.domElement);
    }

    if (!this.controls) {
      var controls = new OrbitControls(this.camera, this.renderer.domElement);
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

  deleteObject(scene, name) {
    var obj = scene.getObjectByName(name);
    obj && obj.parent.remove(obj);
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
      <div className="house-viewer">
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

HouseViewer.propTypes = {};
