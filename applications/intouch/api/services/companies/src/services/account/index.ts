import crypto from "crypto";
import camelcaseKeys from "camelcase-keys";
import { InviteInput, Role } from "@bmi/intouch-api-types";
import { Account } from "../../types";
import { publish, TOPICS } from "../../services/events";

const INSTALLER: Role = "INSTALLER";
const COMPANY_ADMIN: Role = "COMPANY_ADMIN";

export const createAccount = async (
  resolve,
  source,
  args,
  context,
  resolveInfo,
  auth0
) => {
  const { pgClient, logger: Logger } = context;

  let company;
  const logger = Logger("service:account");

  await pgClient.query("SAVEPOINT graphql_mutation");

  try {
    args.input.account.role =
      args.input.account.role === COMPANY_ADMIN ? COMPANY_ADMIN : INSTALLER;

    const result = await resolve(source, args, context, resolveInfo);

    logger.info("setting the current account in pg_config");
    // Set the account ID
    await pgClient.query(
      `SELECT set_config('app.current_account_id', $1, true);`,
      [result.data.$account_id]
    );

    // If row > 1 means I'm already in a company
    const { rows } = await pgClient.query(`SELECT * FROM company`, []);

    // If row = 0 I don't have a company so I'll create one
    if (rows.length == 0 && result.data.$role === COMPANY_ADMIN) {
      const { rows: companies } = await pgClient.query(
        `SELECT * FROM create_company()`,
        []
      );
      company = companies[0];
    }

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
) => await resolve(source, args, context, resolveInfo);

export const invite = async (_query, args, context, resolveInfo, auth0) => {
  const logger = context.logger("service:account");

  const user: Account = context.user;
  const { pgClient, pubSub } = context;
  const { email, firstName, lastName, role, personal_note }: InviteInput =
    args.input;

  if (!user.role || user.role === INSTALLER)
    throw new Error("you must be an admin to invite other users");

  let auth0User = await auth0.getUserByEmail(email);

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
        intouch_role: role === COMPANY_ADMIN ? COMPANY_ADMIN : INSTALLER,
        market: user.marketDomain,
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
      [user.id, user.company.id, "NEW", email, personal_note]
    );
    logger.info(
      `Created invitation record with id ${invitations[0].id}`,
      invitations
    );

    // Creating a passsword reset ticket
    const ticket = await auth0.createResetPasswordTicket({
      user_id: auth0User?.user_id,
      result_url: `${process.env.FRONTEND_URL}/api/invitation?company_id=${user.company.id}`
    });

    // Send the email with the link to reset the password to the user
    await publish(pubSub, TOPICS.TRANSACTIONAL_EMAIL, {
      title: `You have been invited by ${user.company.id}`,
      text: `
      You are invited by company ${user.company.id}.
      Please follow this link to set your password:
      ${ticket.ticket}
    `,
      html: `
        You are invited by company ${user.company.id}.
        Please follow this link to set your password:
        ${ticket.ticket}
      `,
      email: email
    });

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

  let auth0User = await auth0.getUserByEmail(user.email);

  if (!auth0User) {
    throw new Error("User missing in auth0, please contact the support");
  }

  await pgClient.query("SAVEPOINT graphql_mutation");

  try {
    const first_name = auth0User.user_metadata?.first_name;
    const last_name = auth0User.user_metadata?.last_name;

    // Let's be sure we create only installer or company_admin
    let role: Role =
      auth0User.user_metadata?.intouch_role === COMPANY_ADMIN
        ? COMPANY_ADMIN
        : INSTALLER;

    // Get the invitation record to check if the request is legit
    const { rows: invitations } = await pgClient.query(
      "select * from invitation JOIN company ON invitation.company_id = company.id where invitation.company_id = $1",
      [companyId]
    );

    const { rows: users } = await pgClient.query(
      "INSERT INTO account (market_id, email, first_name, last_name, role, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        invitations[0].market_id,
        user.email,
        first_name,
        last_name,
        role,
        "ACTIVE"
      ]
    );

    await pgClient.query(
      `SELECT set_config('app.current_account_id', $1, true);`,
      [users[0].id]
    );

    const { rows: company_members } = await pgClient.query(
      "select * from link_account_to_company ($1, $2)",
      [users[0].id, invitations[0].id]
    );

    const { rows: markets } = await pgClient.query(
      "select * from market where id = $1",
      [users[0].market_id]
    );

    logger.info(
      `Added reletion with id: ${company_members[0].id} between user: ${company_members[0].account_id} and company ${company_members[0].company_id}`
    );

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
