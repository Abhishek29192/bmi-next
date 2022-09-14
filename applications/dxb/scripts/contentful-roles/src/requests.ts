// istanbul ignore file
import fetchRetry from "@bmi/fetch-retry";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createRoles = async (body: any) => {
  try {
    await fetchRetry(
      `https://api.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/roles`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CONTENTFUL_MANAGEMENT_TOKEN}`,
          "Content-Type": "application/vnd.contentful.management.v1+json"
        },
        body: JSON.stringify(body)
      }
    );
    console.info(`Created role`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error.message);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateRole = async (body: any, role: any) => {
  try {
    console.info(`Triggering update ${role.name} role`);
    await fetchRetry(
      `https://api.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/roles/${role.sys.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${process.env.CONTENTFUL_MANAGEMENT_TOKEN}`,
          "Content-Type": "application/vnd.contentful.management.v1+json",
          "X-Contentful-Version": role.sys.version
        },
        body: JSON.stringify(body)
      }
    );
    console.info(`Updated ${role.name} role`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error.message);
  }
};

export const getSpaceRoles = async () => {
  try {
    const response = await fetchRetry(
      `https://api.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/roles`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.CONTENTFUL_MANAGEMENT_TOKEN}`,
          "Content-Type": "application/vnd.contentful.management.v1+json"
        }
      }
    );
    return response.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error.message);
  }
};
