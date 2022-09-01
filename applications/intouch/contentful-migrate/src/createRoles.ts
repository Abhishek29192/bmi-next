import { createRoles } from "@bmi-digital/contentful-migration";
import "dotenv/config";
import roles from "./roles";

const { MANAGEMENT_ACCESS_TOKEN, SPACE_ID } = process.env;

const main = async () => {
  if (!SPACE_ID || !MANAGEMENT_ACCESS_TOKEN) {
    throw Error(
      "Missing env config `SPACE_ID` or` or `MANAGEMENT_ACCESS_TOKEN`"
    );
  }

  await createRoles(roles, SPACE_ID, MANAGEMENT_ACCESS_TOKEN);
};

main().catch((error) => {
  console.error(error);
});
