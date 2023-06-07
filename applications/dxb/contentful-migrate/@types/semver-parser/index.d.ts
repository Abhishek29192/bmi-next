declare module "semver-parser" {
  export type ParsedSemVer = {
    version: string;
    matches: boolean;
    major?: number;
    minor?: number;
    patch?: number;
    pre?: (string | number)[];
    build?: (string | number)[];
  };

  export const compareSemVer: (
    version: string,
    base: string,
    strict?: boolean
  ) => number;
  export const compareSemVerAsync: (
    version: string,
    base: string,
    strict?: boolean
  ) => Promise<number>;
  export const isValidSemVer: (version: string, strict?: boolean) => boolean;
  export const isValidSemVerAsync: (
    version: string,
    strict?: boolean
  ) => Promise<boolean>;
  export const parseSemVer: (version: string, strict?: boolean) => ParsedSemVer;
  export const parseSemVerAsync: (
    version: string,
    strict?: boolean
  ) => Promise<ParsedSemVer>;
}
