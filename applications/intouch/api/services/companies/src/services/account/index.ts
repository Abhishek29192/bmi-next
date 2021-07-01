import crypto from "crypto";
import camelcaseKeys from "camelcase-keys";
import { Account } from "../../types";
import { publish, TOPICS } from "../../services/events";

export const createAccount = async (
  resolve,
  source,
  args,
  context,
  resolveInfo,
  auth0
) => {
  const { pgClient, user, logger: Logger } = context;
  const { marketCode } = args.input;

  let company;
  const logger = Logger("service:account");

  await pgClient.query("SAVEPOINT graphql_mutation");

  try {
    logger.info("creating account ", args);
    const result = await resolve(source, args, context, resolveInfo);

    logger.info("setting the current account in pg_config");
    // Set the account ID
    await pgClient.query(
      `SELECT set_config('app.current_account_id', $1, true);`,
      [result.data.$account_id]
    );

    // Update app_metadata in Auth0 so on the next login we can build the token with the right claims
    const app_metadata: any = {
      intouch_market_code: marketCode,
      intouch_user_id: result.data.$account_id,
      intouch_role: result.data.$role
    };

    // If row > 1 means I'm already in a company
    const { rows } = await pgClient.query(`SELECT * FROM company`, []);

    // If row = 0 I don't have a company so I'll create one
    if (rows.length == 0 && result.data.$role === "COMPANY_ADMIN") {
      const { rows: companies } = await pgClient.query(
        `SELECT * FROM create_company()`,
        []
      );
      if (companies[0].status === "NEW") {
        app_metadata.registration_to_complete = true;
      } else {
        app_metadata.registration_to_complete = false;
      }
      company = companies[0];
    }

    await auth0.updateUser(user.sub, {
      app_metadata
    });

    const { rows: markets } = await pgClient.query(
      "select * from market where id = $1",
      [result.data.$market_id]
    );

    return {
      ...result,
      data: {
        ...result.data,
        "@account": {
          ...result.data["@account"],
          "@market": {
            ...camelcaseKeys(markets[0])
          },
          "@companyMembers": {
            data: [
              {
                "@nodes": {
                  "@company": camelcaseKeys(company)
                }
              }
            ]
          }
        }
      }
    };
  } catch (e) {
    logger.error("Error creating a user");

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
  resolveInfo,
  auth0
) => {
  let result;

  const { pgClient, user } = context;
  const logger = context.logger("service:account");

  await pgClient.query("SAVEPOINT graphql_mutation");

  try {
    result = await resolve(source, args, context, resolveInfo);

    const doceboUserId = result.data["@account"].doceboUserId;

    const app_metadata: any = {
      intouch_docebo_id: doceboUserId
    };

    await auth0.updateUser(user.sub, {
      app_metadata
    });

    return result;
  } catch (error) {
    logger.error("update account", error);
    await pgClient.query("ROLLBACK TO SAVEPOINT graphql_mutation");
    throw error;
  } finally {
    await pgClient.query("RELEASE SAVEPOINT graphql_mutation");
  }
};

export const invite = async (_query, args, context, resolveInfo, auth0) => {
  const logger = context.logger("service:account");

  const user: Account = context.user;
  const { pgClient, pubSub } = context;
  const { email, firstName, lastName, role, note } = args.input;

  if (user.role === "INSTALLER")
    throw new Error("you must be an admin to invite other users");

  let [auth0User] = await auth0.getUserByEmail(email);

  const password = `Gj$1${crypto.randomBytes(20).toString("hex")}`;

  /**
   * Creating the user in Auth0
   *
   * We use an initial random password because Auth0 requires it,
   * at the same time we set the email_verified as false so we force the user
   * to validate the email (in this case with a password reset) before be able
   * to login. We set verify_email false becuase we don't want to send an email
   * to verify the email as we are already sending the password reset email
   */
  if (!auth0User) {
    auth0User = await auth0.createUser({
      email,
      connection: "Username-Password-Authentication",
      email_verified: false,
      password,
      verify_email: false,
      user_metadata: {
        type: role.toLowerCase(),
        email,
        first_name: firstName,
        last_name: lastName
      }
    });
    logger.info(`Created new user in auth0 with id: ${auth0User?.user_id}`);
  }

  await pgClient.query("SAVEPOINT graphql_mutation");

  try {
    // Creating a new invitation record
    const { rows: invitations } = await pgClient.query(
      "INSERT INTO invitation (sender_account_id, company_id, status, invitee, personal_note) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [user.intouchUserId, user.companyId, "NEW", email, note]
    );
    logger.info(
      `Created invitation record with id ${invitations[0].id}`,
      invitations
    );

    // Creating a passsword reset ticket
    const ticket = await auth0.createResetPasswordTicket({
      user_id: auth0User?.user_id,
      result_url: `${process.env.FRONTEND_URL}/api/invitation?company_id=${user.companyId}`
    });

    // Send the email with the link to reset the password to the user
    await publish(pubSub, TOPICS.TRANSACTIONAL_EMAIL, {
      title: `You have been invited by ${user.companyId}`,
      text: `
      You are invited by company ${user.companyId}.
      Please follow this link to set your password:
      ${ticket.ticket}
    `,
      html: `
        You are invited by company ${user.companyId}.
        Please follow this link to set your password:
        ${ticket.ticket}
      `,
      email: email
    });

    // Update app_metadata in Auth0 so on the next login we can build the token with the right claims
    const app_metadata: any = {
      intouch_role: role,
      intouch_invited: true,
      registration_to_complete: false
    };

    await auth0.updateUser(auth0User.user_id, {
      app_metadata
    });
    logger.info(`app_metadata for user: ${auth0User.user_id} updated`);

    return invitations[0];
  } catch (error) {
    logger.error("complete invitation", error);
    // TODO: delete the auth0 user?
    await pgClient.query("ROLLBACK TO SAVEPOINT graphql_mutation");
    throw error;
  } finally {
    await pgClient.query("RELEASE SAVEPOINT graphql_mutation");
  }
};

export const completeInvitation = async (
  _query,
  args,
  context,
  resolveInfo,
  auth0
) => {
  const { pgClient } = context;
  const { companyId } = args;
  const logger = context.logger("service:account");

  const user: Account = context.user;
  const firstName = user.firstName;
  const lastName = user.lastName;
  const role = user.role;

  await pgClient.query("SAVEPOINT graphql_mutation");

  try {
    // Get the invitation record to check if the request is legit
    const { rows: invitations } = await pgClient.query(
      "select * from invitation JOIN company ON invitation.company_id = company.id where invitation.company_id = $1",
      [companyId]
    );

    logger.info("invitations", invitations);

    logger.info("input:", user);

    const { rows: users } = await pgClient.query(
      "INSERT INTO account (market_id, email, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [invitations[0].market_id, user.email, firstName, lastName, role]
    );

    logger.info("users", users);

    await pgClient.query(
      `SELECT set_config('app.current_account_id', $1, true);`,
      [users[0].id]
    );

    const { rows: company_members } = await pgClient.query(
      "select * from link_account_to_company ($1, $2)",
      [users[0].id, invitations[0].id]
    );

    logger.info("company_members", users);

    const { rows: markets } = await pgClient.query(
      "select * from market where id = $1",
      [users[0].market_id]
    );

    logger.info("markets", markets);

    logger.info(
      `Added reletion with id: ${company_members[0].id} between user: ${company_members[0].account_id} and company ${company_members[0].company_id}`
    );

    // Update app_metadata in Auth0 so on the next login we can build the token with the right claims
    const app_metadata: any = {
      intouch_market_code: markets[0].domain,
      intouch_user_id: users[0].id,
      intouch_role: role
    };

    await auth0.updateUser(user.sub, {
      app_metadata
    });

    return {
      ...users[0],
      ["@market"]: camelcaseKeys(markets[0])
    };
  } catch (error) {
    logger.error("complete invitation", error);
    await pgClient.query("ROLLBACK TO SAVEPOINT graphql_mutation");
    throw error;
  } finally {
    await pgClient.query("RELEASE SAVEPOINT graphql_mutation");
  }
};
