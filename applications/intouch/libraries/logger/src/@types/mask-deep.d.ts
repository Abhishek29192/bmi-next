declare module "mask-deep" {
  function maskDeep<T>(
    source: T,
    keysToMaks: string[],
    options?: {
      percentage?: number;
      maskFromRight?: boolean;
      maskTimePropsNormally?: boolean;
      isMaskable?: (value: any) => boolean;
    }
  ): T;
  export = maskDeep;
}
