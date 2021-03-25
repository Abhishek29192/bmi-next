// TODO: resolve eslint issues:
/* eslint-disable */
import * as THREE from "../ThreeJs/ThreeJs.js";
import GLTFLoader from "../ThreeJsUtils/Gltf/Gltf.js";

/*
 * Downloads and caches GLB or GLTF models.
 * Returns a promise which resolves as the gltf object.
 */

var cache = {};

export default (url) => {
  if (cache[url]) {
    return cache[url];
  }

  var promise = new Promise((success, reject) => {
    var pieces = url.split("/");
    var name = pieces.pop();
    var path = pieces.join("/") + "/";

    var loader = new GLTFLoader().setPath(path);

    loader.load(name, (tileGltf) => {
      success(tileGltf);
    });
  });

  cache[url] = promise;
  return promise;
};
