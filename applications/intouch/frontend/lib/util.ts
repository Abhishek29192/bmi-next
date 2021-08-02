export const groupBy = <T>(collection: T[], iteratee: (value: T) => string) =>
  collection.reduce(
    (a, b) => ((a[iteratee(b)] = a[iteratee(b)] || []).push(b), a),
    {} as Record<string, T[]>
  );
