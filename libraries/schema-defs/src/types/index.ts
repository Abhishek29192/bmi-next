export type Product = {
  name: string;
  description: string;
  approvalStatus: string;
  code: string;
  isSampleOrderAllowed: boolean;
  summary: string;
};

export type Query = {
  products: (ctx) => Promise<Product[]>;
};
