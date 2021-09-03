import { UserUpdateInput } from "@bmi/intouch-api-types";

export const updateUser = async (client, input: UserUpdateInput) => {
  const query = `
  mutation updateDoceboUser($input: UserUpdateInput!) {
    updateDoceboUser (input:$input) {
      success
      user_id
    }
  }`;

  return client(query, { input });
};
