import { fetch } from "cross-fetch";
import { UserUpdateInput } from "@bmi/intouch-api-types";

export const updateUser = async (input: UserUpdateInput) => {
  const query = `
  mutation updateDoceboUser($input: UserUpdateInput!) {
    updateDoceboUser (input:$input) {
      success
      user_id
    }
  }`;

  return trainingHandler(query, { input });
};

const trainingHandler = async (query: string, variables: Object) => {
  const fetchResult = await fetch(process.env.GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query, variables })
  });
  return fetchResult.json();
};
