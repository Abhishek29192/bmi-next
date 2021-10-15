declare module "**/path" {
  export const getPathWithCountryCode = (
    countryCode: string,
    path?: string | null
  ) => string;
}
