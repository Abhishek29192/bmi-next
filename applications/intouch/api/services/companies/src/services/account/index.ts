import crypto from "crypto";
import Auth0 from "../auth0";
import { publish, TOPICS } from "../../services/events";

const AUTH0_NAMESPACE = "https://intouch";

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
  const { pgClient, user } = context;
  const {
    account: { email, firstName, lastName, marketCode }
  } = args.input;

  await pgClient.query("SAVEPOINT graphql_mutation");

  try {
    const logger = context.logger("service:account");

    const auth0 = await Auth0.init(logger);

    // Check if the user already exists
    const { rows } = await pgClient.query(
      "select id, role, email from account where email=$1",
      [email]
    );
    const userExists = rows.length > 0;

    const { rows: markets } = await pgClient.query(
      "select * from market_id_by_domain($1)",
      [marketCode]
    );

    if (markets.length === 0) {
      logger.error(`Market ${marketCode} not found`);
      throw new Error("market_not_found");
    }

    const [{ market_id_by_domain }] = markets;

    // If it exists update name, surname, role of the user with email args.input.email
    if (userExists) {
      const { rows: updatedRows } = await pgClient.query(
        "update account set first_name=$1, last_name=$2 where email=$3 returning *",
        [firstName, lastName, email, market_id_by_domain]
      );

      // Create a compatible object
      result = { data: { "@account": updatedRows[0] } };
      account_id = updatedRows[0].id;
      account_role = updatedRows[0].role;
    } else {
      const { marketCode, ...rest } = args.input.account;
      args.input.account = {
        ...rest,
        marketId: market_id_by_domain
      };
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
    if (account_role === "COMPANY_ADMIN") {
      const { rows: companies } = await pgClient.query(
        "insert into company (status, market_id) values ('new', $1) returning id",
        [result.data.$market_id]
      );
      const [company] = companies;

      await pgClient.query(
        "insert into company_member (account_id, market_id, company_id) values ($1, $2, $3);",
        [account_id, result.data.$market_id, company.id]
      );
      if (!userExists) {
        app_metadata.registration_to_complete = true;
      } else {
        app_metadata.registration_to_complete = false;
      }
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

export const invite = async (_query, args, context, resolveInfo) => {
  const logger = context.logger("service:account");
  const auth0 = await Auth0.init(logger);

  try {
    const { pgClient, pubSub, user } = context;
    const { email, firstName, lastName, role, note } = args.input;

    /**
     * Creating the user in Auth0
     *
     * We use an initial random password because Auth0 requires it,
     * at the same time we set the email_verified as false so we force the user
     * to validate the email (in this case with a password reset) before be able
     * to login. We set verify_email false becuase we don't want to send an email
     * to verify the email as we are already sending the password reset email
     */
    const auth0User = await auth0.createUser({
      email,
      connection: "Username-Password-Authentication",
      email_verified: false,
      password: crypto.randomBytes(20).toString("hex"),
      verify_email: false,
      user_metadata: {
        type: role.toLowerCase(),
        email,
        firstname: firstName,
        lastname: lastName
      }
    });
    logger.info(`Created new user in auth0 with id: ${auth0User.user_id}`);

    // Creating a new invitation record
    const { rows: invitations } = await pgClient.query(
      "INSERT INTO invitation (sender_account_id, company_id, status, invitee, personal_note) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [user.id, user.company_id, "NEW", email, note]
    );
    logger.info(
      `Created invitation record with id ${invitations[0].id}`,
      invitations
    );

    // Creating a passsword reset ticket
    const ticket = await auth0.createResetPasswordTicket({
      user_id: auth0User.user_id,
      result_url: `http://en.local.intouch:3000/api/invitation?company_id=${user.company_id}`
    });

    // Send the email with the link to reset the password to the user
    await publish(pubSub, TOPICS.TRANSACTIONAL_EMAIL, {
      title: `You have been invited by ${user.company_id}`,
      text: `
      You are invited by company ${user.company_id}.
      Please follow this link to set your password:
      ${ticket.ticket}
    `,
      html: `
        You are invited by company ${user.company_id}.
        Please follow this link to set your password:
        ${ticket.ticket}
      `,
      email: email
    });

    // Update app_metadata in Auth0 so on the next login we can build the token with the right claims
    const app_metadata: any = {
      intouch_role: role,
      intouch_invitation: true,
      registration_to_complete: false
    };

    await auth0.updateUser(auth0User.user_id, {
      app_metadata
    });
    logger.info(`app_metadata for user: ${auth0User.user_id} updated`);

    return invitations[0];
  } catch (error) {
    logger.error(error);
  }
};

export const completeInvitation = async (
  _query,
  args,
  context,
  resolveInfo
) => {
  const { pgClient, user } = context;
  const { company_id } = args.input;
  const logger = context.logger("service:account");

  try {
    const firstName = user[`${AUTH0_NAMESPACE}/firstname`];
    const lastName = user[`${AUTH0_NAMESPACE}/lastname`];
    const role =
      user[`${AUTH0_NAMESPACE}/type`] === "company"
        ? "COMPANY_ADMIN"
        : "INSTALLER";

    // Get the invitation record to check if the request is legit
    const { rows: invitations } = await pgClient.query(
      "SELECT * FROM invitation WHERE invitee = $1 AND company_id = $2",
      [user.email, parseInt(company_id)]
    );

    const { rows: companies } = await pgClient.query(
      "SELECT * FROM company WHERE id = $1",
      [invitations[0].company_id]
    );

    const { rows: users } = await pgClient.query(
      "INSERT INTO account (market_id, email, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [companies[0].market_id, user.email, firstName, lastName, role]
    );

    // Connect user to the company
    const { rows: company_members } = await pgClient.query(
      "INSERT INTO company_member (market_id, account_id, company_id) VALUES ($1, $2, $3) RETURNING *",
      [users[0].market_id, users[0].id, companies[0].id]
    );

    logger.info(
      `Added reletion with id: ${company_members[0].id} between user: ${company_members[0].account_id} and company ${company_members[0].company_id}`
    );

    return users[0];
  } catch (error) {
    logger.error(error);
    throw error;
  }
};
