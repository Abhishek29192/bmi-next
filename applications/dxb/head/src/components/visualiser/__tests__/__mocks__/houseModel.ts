import { BufferGeometry, Group, Mesh, Object3D } from "three";
import { GLTF, GLTFParser } from "three/examples/jsm/loaders/GLTFLoader";
import houseConfig from "../../data/house.json";

const createHouseModelMock = (): GLTF => {
  const scene = new Group();
  const roofSegment = new Mesh(new BufferGeometry());
  roofSegment.name = houseConfig.roofSegmentName;

  const ridgeSegment = new Object3D();
  ridgeSegment.name = houseConfig.roofRidgeName;

  const metalSegment = new Object3D();
  metalSegment.name = "Roof_metal";

  const wallsSegment = new Mesh();
  wallsSegment.name = "Wall";

  const fenceSegment = new Object3D();
  fenceSegment.name = "Snow_fence";
  scene.children = [
    new Mesh(),
    new Object3D(),
    roofSegment,
    ridgeSegment,
    metalSegment,
    wallsSegment,
    fenceSegment
  ];

  return {
    scene,
    asset: {},
    parser: {} as GLTFParser,
    cameras: [],
    scenes: [],
    userData: {},
    animations: []
  };
};

export default createHouseModelMock();
