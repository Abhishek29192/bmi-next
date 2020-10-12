export type TreeType = {
  field: string;
  paths: Array<{
    option: string;
    target: TreeType | string;
  }>;
};
