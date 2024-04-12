import type { RoleProps } from "contentful-management";

export interface IMarket {
  name: string;
  locales: string[];
}

export enum RolesEnum {
  publisher = "publisher",
  editor = "editor"
}

export type RolePolicy = RoleProps["policies"][number];
