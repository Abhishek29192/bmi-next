import { updateUser, getAccessToken } from "../auth0";

const SELECT_ACCOUNT = "SELECT id, role, email FROM account WHERE email=$1";
const UPDATE_ACCOUNT =
  "UPDATE account SET first_name=$1, last_name=$2 WHERE email=$3 RETURNING id, email, role";

export const createAccount = async (
  resolve,
  source,
  args,
  context,
  resolveInfo
) => {
  let result;
  let account_role;
  let account_id;
  const { pgClient, user } = context;
  const { email, firstName, lastName } = args.input;

  await pgClient.query("SAVEPOINT graphql_mutation");

  try {
    // Check if the user already exists
    const { rows } = await pgClient.query(SELECT_ACCOUNT, [email]);
    const userExists = rows.length > 0;

    // If it exists update name, surname, role of the user with email args.input.email
    if (userExists) {
      const { rows: updatedRows } = await pgClient.query(UPDATE_ACCOUNT, [
        firstName,
        lastName,
        email
      ]);

      // Create a compatible object
      result = { data: { "@account": updatedRows[0] } };
      account_id = updatedRows[0].id;
      account_role = updatedRows[0].role;
    } else {
      result = await resolve(source, args, context, resolveInfo);
      account_id = result.data.$account_id;
      account_role = result.data.$role;
    }

    // Update app_metadata in Auth0 so on the next login we can build the token with the right claims
    const { access_token } = await getAccessToken();
    const app_metadata: any = {
      intouch_user_id: account_id,
      intouch_role: account_role
    };

    // If the user is a company_admin then add a flag in auth0 to let him complete the registration of a company
    // we check rows.length === 0 because if the user already exist rows will be > 0 and the company will be already in the db (imported data)
    if (account_role === "COMPANY_ADMIN" && !userExists) {
      app_metadata.registration_to_complete = true;
    } else if (account_role === "COMPANY_ADMIN") {
      app_metadata.registration_to_complete = false;
    }

    await updateUser(access_token, user.auth0.sub, {
      app_metadata
    });

    return result;
  } catch (e) {
    await pgClient.query("ROLLBACK TO SAVEPOINT graphql_mutation");
    throw e;
  } finally {
    await pgClient.query("RELEASE SAVEPOINT graphql_mutation");
  }
};
