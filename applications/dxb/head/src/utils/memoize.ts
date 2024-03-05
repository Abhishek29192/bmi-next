type Func<T extends unknown[], R> = (...args: T) => R;

const cache: Map<string, unknown> = new Map();

const memoize = <T extends unknown[], R>(
  func: Func<T, R>
): Func<[...T, unknown[]], R> => {
  return (...args: [...T, unknown[]]): R => {
    const deps = args.pop() as unknown[];

    const key = [...args, ...deps]
      .map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : arg))
      .join("|");

    if (!cache.has(key)) {
      cache.set(key, func(...(args as unknown as T)));
    }
    return cache.get(key)! as R;
  };
};

export default memoize;
