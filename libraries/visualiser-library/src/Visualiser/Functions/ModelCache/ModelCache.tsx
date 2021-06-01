import { GLTFTile } from "../../../Types";
import GLTFLoader from "../ThreeJsUtils/Gltf/Gltf.js";

/*
 * Downloads and caches GLB or GLTF models.
 * Returns a promise which resolves as the gltf object.
 */

const cache: { [index: string]: Promise<GLTFTile> } = {};

export default (url: string) => {
  if (cache[url]) {
    return cache[url];
  }

  var promise = new Promise<GLTFTile>((success) => {
    var pieces = url.split("/");
    var name = pieces.pop()!;
    var path = pieces.join("/") + "/";

    var loader = new GLTFLoader().setPath(path);

    loader.load(name, (tileGltf: GLTFTile) => {
      success(tileGltf);
    });
  });

  cache[url] = promise;
  return promise;
};
