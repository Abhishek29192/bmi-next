import { BufferGeometry, Group, Material, Mesh } from "three";
import { GLTF, GLTFParser } from "three/examples/jsm/loaders/GLTFLoader";

const createTileModelMock = (): GLTF => {
  const scene = new Group();
  const mesh1 = new Mesh(new BufferGeometry());
  mesh1.material = new Material();
  const mesh2 = new Mesh(new BufferGeometry());
  mesh2.material = new Material();
  scene.children = [mesh1, mesh2];

  return {
    scene,
    scenes: [],
    animations: [],
    userData: {},
    cameras: [],
    parser: {} as GLTFParser,
    asset: {}
  };
};

export default createTileModelMock();
