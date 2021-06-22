import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

/*
 * Downloads and caches GLB or GLTF models.
 * Returns a promise which resolves as the gltf object.
 */

const cache: { [index: string]: Promise<GLTF> } = {};

export default (url: string) => {
  if (cache[url]) {
    return cache[url];
  }

  const promise = new Promise<GLTF>((success) => {
    const pieces = url.split("/");
    const name = pieces.pop()!;
    const path = pieces.join("/") + "/";

    const loader = new GLTFLoader().setPath(path);

    loader.load(name, (tileGltf: GLTF) => {
      success(tileGltf);
    });
  });

  cache[url] = promise;
  return promise;
};
