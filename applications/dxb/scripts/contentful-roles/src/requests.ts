import fetchRetry from "@bmi/fetch-retry";
import type { CreateRoleProps, RoleProps } from "contentful-management";

export const createRoles = async (body: CreateRoleProps) => {
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
  } catch (error: any) {
    console.error(error.message);
  }
};

export const updateRole = async (role: RoleProps) => {
  try {
    console.info(`Triggering update ${role.name} role`);
    await fetchRetry(
      `https://api.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/roles/${role.sys.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${process.env.CONTENTFUL_MANAGEMENT_TOKEN}`,
          "Content-Type": "application/vnd.contentful.management.v1+json",
          "X-Contentful-Version": role.sys.version.toString()
        },
        body: JSON.stringify(role)
      }
    );
    console.info(`Updated ${role.name} role`);
  } catch (error: any) {
    console.error(error.message);
  }
};

type GetSpaceRoles = () => Promise<
  | {
      items: RoleProps[];
      total: number;
      skip: number;
      limit: number;
      sys: { type: "Array" };
    }
  | undefined
>;

export const getSpaceRoles: GetSpaceRoles = async () => {
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
  } catch (error: any) {
    console.error(error.message);
  }
};
