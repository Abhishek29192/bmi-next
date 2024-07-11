import gqlmin from "gqlmin";

const getContentfulData = async <T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<{ data: T; errors?: Record<string, unknown> }> => {
  const res = await fetch(
    `${process.env.CONTENTFUL_GRAPHQL_API_URL}/content/v1/spaces/${process.env.SPACE_ID}/environments/${process.env.ENVIRONMENT}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        query: gqlmin(query),
        variables
      })
    }
  );

  return res.json();
};

export default getContentfulData;
