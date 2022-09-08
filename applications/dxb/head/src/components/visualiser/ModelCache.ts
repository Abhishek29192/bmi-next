import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

/*
 * Downloads and caches GLB or GLTF models.
 * Returns a promise which resolves as the gltf object.
 */

const cache: { [index: string]: Promise<GLTF> } = {};

export default (url: string) => {
  // eslint-disable-next-line security/detect-object-injection
  if (cache[url]) {
    // eslint-disable-next-line security/detect-object-injection
    return cache[url];
  }

  const promise = new Promise<GLTF>((resolve, reject) => {
    const pieces = url.split("/");
    const name = pieces.pop()!;
    const path = pieces.join("/") + "/";

    const loader = new GLTFLoader().setPath(path);

    loader.load(
      name,
      function onLoad(tileGltf: GLTF) {
        resolve(tileGltf);
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      function onProgress() {},
      function onError(err) {
        reject(err);
      }
    );
  });

  // eslint-disable-next-line security/detect-object-injection
  cache[url] = promise;
  return promise;
};
