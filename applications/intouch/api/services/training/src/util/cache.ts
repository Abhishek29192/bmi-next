import LRU from "lru-cache";

const DEFAULT_MAXAGE = 1000 * 60 * 5; // 5 minutes

export default class Cache {
  cache: any;

  constructor() {
    const options = {
      max: 1000,
      maxAge: DEFAULT_MAXAGE,
      length: (n, key) => {
        return n.length;
      }
    };
    this.cache = new LRU(options);
  }

  get(key) {
    const cachedObj = this.cache.get(key);
    if (cachedObj) {
      return cachedObj;
    }
    return null;
  }

  set(key, value) {
    this.cache.set(key, value, DEFAULT_MAXAGE);
  }
}
