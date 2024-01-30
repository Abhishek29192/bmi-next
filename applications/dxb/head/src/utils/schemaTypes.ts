import type { Organization, Product } from "schema-dts";

export type Schema<T> = Exclude<T, string> & {
  "@context": "https://schema.org";
};

export type ProductSchema = Schema<Product>;
export type OrganisationSchema = Schema<Organization>;
