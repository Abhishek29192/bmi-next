import Auth0 from "../auth0";

const SELECT_ACCOUNT = "SELECT id, role, email FROM account WHERE email=$1";
const UPDATE_ACCOUNT =
  "UPDATE account SET first_name=$1, last_name=$2 WHERE email=$3 RETURNING id, email, role, market_id";

export const createAccount = async (
  resolve,
  source,
  args,
  context,
  resolveInfo
) => {
  let result;
  let account_id;
  let account_role;
  const { pgClient, user, Logger } = context;
  const { email, firstName, lastName, marketCode } = args.input;

  await pgClient.query("SAVEPOINT graphql_mutation");

  try {
    const logger = Logger("service:account");

    const auth0 = await Auth0.init(logger);

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
    const app_metadata: any = {
      intouch_market_code: marketCode,
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

    await auth0.updateUser(user.sub, {
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
export const updateAccount = async (
  resolve,
  source,
  args,
  context,
  resolveInfo
) => {
  let result;

  const { pgClient, user } = context;
  const logger = context.logger("service:account");

  await pgClient.query("SAVEPOINT graphql_mutation");

  try {
    result = await resolve(source, args, context, resolveInfo);

    const doceboUserId = result.data["@account"].doceboUserId;

    const auth0 = await Auth0.init(logger);
    const app_metadata: any = {
      intouch_docebo_id: doceboUserId
    };

    await auth0.updateUser(user.sub, {
      app_metadata
    });

    return result;
  } catch (error) {
    logger.error(error);
    await pgClient.query("ROLLBACK TO SAVEPOINT graphql_mutation");
    throw error;
  } finally {
    await pgClient.query("RELEASE SAVEPOINT graphql_mutation");
  }
};

export const invite = async (graphql, _query, args, context, resolveInfo) => {
  const { logger: Logger } = context;
  const { email, firstName, lastName, type } = args.input;

  const logger = Logger("service:account");

  const auth0 = await Auth0.init(logger);

  const user = await auth0.createUser({
    email,
    connection: "Username-Password-Authentication",
    email_verified: false,
    password: "Password1@",
    verify_email: false,
    user_metadata: {
      type,
      email,
      firstname: firstName,
      lastname: lastName
    }
  });

  const result = await auth0.changePassword(email);

  console.log("result", result);

  return {};
};
