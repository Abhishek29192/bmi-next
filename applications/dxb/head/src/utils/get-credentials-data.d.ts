type CountryData = {
  spaceId: string;
  accessToken: string;
  environment: string;
};

export default function getCredentialsData(
  env: Record<string, string>,
  data?: CountryData[],
  index?: number
): CountryData[];
