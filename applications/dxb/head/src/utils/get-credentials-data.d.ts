type CountryData = {
  spaceId: string;
  accessToken: string;
};

export default function getCredentialsData(
  env: Record<string, string>,
  data?: CountryData[],
  index?: number
): CountryData[];
