import { RepeatWrapping, sRGBEncoding, Texture, TextureLoader } from "three";

/*
 * Downloads and caches images as loaded textures.
 * Returns a promise which resolves as the texture object.
 */

let cache: { [index: string]: Promise<any> } = {};

export default async (url: string): Promise<Texture> => {
  // eslint-disable-next-line security/detect-object-injection
  if (cache[url]) {
    // eslint-disable-next-line security/detect-object-injection
    return cache[url];
  }

  const promise = new Promise<Texture>((success) => {
    new TextureLoader().load(url, (tex) => {
      tex.encoding = sRGBEncoding;
      tex.wrapS = RepeatWrapping;
      tex.wrapT = RepeatWrapping;
      success(tex);
    });
  });

  // eslint-disable-next-line security/detect-object-injection
  cache[url] = promise;
  return promise;
};
