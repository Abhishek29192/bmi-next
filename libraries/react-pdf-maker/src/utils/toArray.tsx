const toArray = (value: any, ignoreSingleUndefined?: boolean): any[] => {
  if (Array.isArray(value)) {
    return value;
  }
  const result: any[] = [];
  if (typeof value !== "undefined" || !ignoreSingleUndefined) {
    result.push(value);
  }
  return result;
};

export default toArray;
