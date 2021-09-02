import { fetch } from "cross-fetch";
import { UserUpdateInput } from "@bmi/intouch-api-types";

import { getGCPToken } from "../../utils";

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
  const { GATEWAY_URL } = process.env;
  const bearer = await getGCPToken(GATEWAY_URL);
  const fetchResult = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization: ": bearer
    },
    body: JSON.stringify({ query, variables })
  });
  return fetchResult.json();
};
