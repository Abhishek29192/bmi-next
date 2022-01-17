export enum PimTypes {
  Products = "products",
  Systems = "systems"
}

export type CatalogVersion = "Online" | "Staged";

export type ApiResponse = {
  catalog: string;
  currentPage: number;
  totalPageCount: number;
};

export type ProductsApiResponse = ApiResponse & {
  products: any[];
  version: CatalogVersion;
  totalProductCount: number;
};

export type SystemsApiResponse = ApiResponse & {
  systems: any[];
  totalSystemsCount: number;
};

export type AuthResponse = {
  access_token: string;
  token_type: "bearer";
  expires_in: number;
  scope: "basic openid";
};

export type ErrorResponse = {
  errors: [
    {
      type: string;
      message: string;
    }
  ];
};
