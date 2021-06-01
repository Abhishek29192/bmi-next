import { Light, Material, PointsMaterial, Texture } from "three";

abstract class GLTFCache<T> {
  objects: {
    [index: string]: T;
  } = {};

  get(key: string): T | undefined {
    return this.objects[key];
  }

  add(key: string, object: T) {
    this.objects[key] = object;
  }

  remove(key: string) {
    delete this.objects[key];
  }

  removeAll() {
    this.objects = {};
  }
}

export class BufferViewCache extends GLTFCache<Promise<ArrayBuffer>> {}
export class PointsMaterialCache extends GLTFCache<PointsMaterial> {}
export class LightCache extends GLTFCache<Light> {}
export class MaterialCache extends GLTFCache<Promise<Material>> {}
export class TextureCache extends GLTFCache<Promise<Texture>> {}
