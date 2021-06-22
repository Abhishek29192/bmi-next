import * as THREE from "three";

/*
 * Downloads and caches images as loaded textures.
 * Returns a promise which resolves as the texture object.
 */

let cache: { [index: string]: Promise<any> } = {};

export default (url: string): Promise<THREE.Texture> => {
  if (cache[url]) {
    return cache[url];
  }

  const promise = new Promise<THREE.Texture>((success) => {
    new THREE.TextureLoader().load(url, (tex) => {
      tex.encoding = THREE.sRGBEncoding;
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      success(tex);
    });
  });

  cache[url] = promise;
  return promise;
};
