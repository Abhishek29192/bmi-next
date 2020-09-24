declare module "**/get-credentials-data" {
  type CountryData = {
    spaceId: string;
    accessToken: string;
  };

  const getCredentialsData: (
    env: Record<string, string>,
    data?: CountryData[],
    index?: number
  ) => CountryData[];

  export default getCredentialsData;
}
