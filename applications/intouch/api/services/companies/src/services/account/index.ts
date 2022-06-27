import crypto from "crypto";
import camelcaseKeys from "camelcase-keys";
import { FileUpload } from "graphql-upload";
import { AccountPatch, InviteInput, Role } from "@bmi/intouch-api-types";
import { UpdateAccountInput, Market } from "@bmi/intouch-api-types";
import axios from "axios";
import { sendMessageWithTemplate } from "../../services/mailer";
import { updateUser } from "../../services/training";
import { Account, PostGraphileContext } from "../../types";
import { tierBenefit } from "../contentful";
import { getTranslatedRole, getTargetDomain } from "../../utils/account";

const INSTALLER: Role = "INSTALLER";
const COMPANY_ADMIN: Role = "COMPANY_ADMIN";

const ERROR_ALREADY_MEMBER = "errorAlreadyMember";
const ERROR_INVITATION_NOT_FOUND = "errorInvitationNotFound";

const { FRONTEND_URL } = process.env;

export const createAccount = async (
  resolve,
  source,
  args,
  context: PostGraphileContext,
  resolveInfo
) => {
  const { pgSql: sql } = resolveInfo.graphile.build;
  const { pgClient, logger: Logger, protocol } = context;

  const logger = Logger("service:account");

  try {
    await pgClient.query("SAVEPOINT graphql_mutation");

    args.input.account.role =
      args.input.account.role === COMPANY_ADMIN ? COMPANY_ADMIN : INSTALLER;

    const result = await resolve(source, args, context, resolveInfo);
    logger.info(`User with id: ${result.data.$account_id} created`);

    // Set the account ID as pg setting in order to get RLS working correctly
    await pgClient.query(
      `SELECT set_config('app.current_account_id', $1, true);`,
      [result.data.$account_id]
    );

    // If row === 1 means somehow (imported?) there is already a company
    const { rows } = await pgClient.query(`SELECT * FROM company`, []);

    // If row = 0 I don't have a company so I'll create one
    if (rows.length === 0 && args.input.account.role === COMPANY_ADMIN) {
      await pgClient.query(
        `SELECT * FROM create_company($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [
          null,
          null,
          null,
          null,
          null,
          "NEW",
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null
        ]
      );
    }

    const { rows: markets } = await pgClient.query(
      `SELECT * FROM market WHERE id = $1`,
      [result.data.$market_id]
    );

    // When the request started the user wasn't in the db so the parseUSer middleware didn't
    // append any information to the request object
    const updatedContext: PostGraphileContext = {
      ...context,
      user: {
        ...context.user,
        id: result.data.$account_id,
        market: {
          sendMailbox: markets[0].send_mailbox
        } as Market
      }
    };

    await sendMessageWithTemplate(updatedContext, "ACCOUNT_ACTIVATED", {
      email: result.data.$email,
      firstname: result.data.$first_name,
      marketUrl: `${protocol}://${getTargetDomain(
        markets[0].domain
      )}.${FRONTEND_URL}`
    });

    // Query the requested value
    const [row] = await resolveInfo.graphile.selectGraphQLResultFromTable(
      sql.fragment`public.account`,
      (tableAlias, queryBuilder) =>
        queryBuilder.where(
          sql.fragment`${tableAlias}.id = ${sql.value(result.data.$account_id)}`
        )
    );

    return {
      data: row
    };
  } catch (error) {
    logger.error("Error creating a user", error);
    await pgClient.query("ROLLBACK TO SAVEPOINT graphql_mutation");
    throw error;
  } finally {
    await pgClient.query("RELEASE SAVEPOINT graphql_mutation");
  }
};

export const updateAccount = async (
  resolve,
  source,
  args: { input: UpdateAccountInput },
  context: PostGraphileContext,
  resolveInfo,
  auth0
) => {
  const { GCP_PRIVATE_BUCKET_NAME, AUTH0_NAMESPACE } = process.env;

  const { pgClient, user, logger: Logger, storageClient } = context;
  const { photoUpload, role, shouldRemovePhoto, status }: AccountPatch =
    args.input.patch;

  const logger = Logger("service:account");

  await pgClient.query("SAVEPOINT graphql_mutation");

  try {
    const termsToAccept = user?.[`${AUTH0_NAMESPACE}/terms_to_accept`];

    if (termsToAccept && args.input.patch.termsCondition) {
      await auth0.updateUser(user.sub, {
        app_metadata: {
          terms_to_accept: false
        }
      });
    }

    // If an installer or a company admin try to change the role to installer or company_admin
    if (
      (role === "COMPANY_ADMIN" || role === "INSTALLER") &&
      (!user.can("grant:market_admin") || !user.can("grant:super_admin")) // if grant:super_admin or grant:market_admin we have high privilege
    ) {
      // get all the user in the current company
      const { rows: users } = await pgClient.query(
        "select account.* from account join company_member on account.id = company_member.account_id where company_member.company_id = $1",
        [user.company?.id]
      );

      const accountToEdit = users.find(({ id }) => id === args.input.id);

      const admins = users.filter(({ role }) => role === "COMPANY_ADMIN");

      // If these values are different means we are trying to change the role
      // By default an installer can't update the role columns so we don't need to check this
      if (role !== accountToEdit.role) {
        if (admins.length === 1 && role === "INSTALLER") {
          logger.error(
            `User with id: ${user.id} is trying to grant company admin to user ${args.input.id}`
          );
          throw new Error("last_company_admin");
        }

        if (!user.can("grant:company_admin") && role === "COMPANY_ADMIN") {
          logger.error(
            `User with id: ${user.id} is trying to grant company admin to user ${args.input.id}`
          );
          throw new Error("unauthorized");
        }

        const result = await resolve(source, args, context, resolveInfo);

        const POWER_USER_LEVEL = 4;
        const REGULAR_USER_LEVEL = 6;

        const level =
          role === "COMPANY_ADMIN" ? POWER_USER_LEVEL : REGULAR_USER_LEVEL;

        await updateUser(context.clientGateway, {
          userid: `${result.data.$docebo_user_id}`,
          level
        });

        const { rows: markets } = await pgClient.query(
          `SELECT * FROM market WHERE id = $1`,
          [user.marketId]
        );

        const locale = `${
          markets[0].language
        }_${markets[0].domain?.toUpperCase()}`;

        const roleTranslated = getTranslatedRole(locale, role);

        await sendMessageWithTemplate(context, "ROLE_ASSIGNED", {
          accountId: args.input.id,
          email: result.data.$email,
          firstname: result.data.$first_name,
          role: roleTranslated
        });

        return result;
      }
    }

    if (role === "MARKET_ADMIN" && !user.can("grant:market_admin")) {
      throw new Error("unauthorized");
    }

    if (role === "SUPER_ADMIN" && !user.can("grant:super_admin")) {
      throw new Error("unauthorized");
    }

    if (!photoUpload && shouldRemovePhoto) {
      args.input.patch.photo = null;
    }

    if (photoUpload) {
      const newFileName = `profile/${args.input.id}-${Date.now()}`;

      const uploadedFile: FileUpload = await photoUpload;

      try {
        await storageClient.uploadFileByStream(
          GCP_PRIVATE_BUCKET_NAME,
          newFileName,
          uploadedFile
        );
        // update the photo only if successful
        args.input.patch.photo = newFileName;
        logger.info(`Succesfully uploaded profile picture file ${newFileName}`);
      } catch (error) {
        logger.error(
          `Could not upload profile picture file ${newFileName}`,
          error.toString()
        );
      }
    }

    // if the user wants to remove the image OR a new photo has been uploaded
    if ((!photoUpload && shouldRemovePhoto) || photoUpload) {
      const {
        rows: [{ photo: currentPhoto }]
      } = await pgClient.query(
        "select account.photo from account where id = $1",
        [user.id]
      );

      // delete the previous image if it exists & is hosted on GCP Cloud storage
      // if the current image is externally hosted (i.e. starts with https://) it is probably mock data
      if (currentPhoto && !/^http(s):\/\//.test(currentPhoto)) {
        await storageClient.deleteFile(GCP_PRIVATE_BUCKET_NAME, currentPhoto);
      }
    }

    if (status) {
      if (status === "SUSPENDED") {
        await pgClient.query(
          "delete from company_member where account_id = $1",
          [args.input.id]
        );
        await pgClient.query(
          "delete from project_member where account_id = $1",
          [args.input.id]
        );
        args.input.patch.role = "INSTALLER";
      }

      const { rows: accounts } = await pgClient.query(
        "select account.* from account where account.id = $1",
        [args.input.id]
      );

      const auth0User = await auth0.getUserByEmail(accounts[0].email);
      if (auth0User) {
        await auth0.updateUser(auth0User.user_id, {
          blocked: status === "SUSPENDED"
        });
      }
    }

    return await resolve(source, args, context, resolveInfo);
  } catch (e) {
    logger.error("Error updating a user", e);

    await pgClient.query("ROLLBACK TO SAVEPOINT graphql_mutation");
    throw e;
  } finally {
    await pgClient.query("RELEASE SAVEPOINT graphql_mutation");
  }
};

export const invite = async (
  _query,
  args,
  context: PostGraphileContext,
  resolveInfo,
  auth0
) => {
  const logger = context.logger("service:account");

  const user: Account = context.user;
  const { pgClient, pgRootPool, protocol } = context;

  const {
    emails = [],
    firstName,
    lastName,
    personalNote = ""
  }: InviteInput = args.input;

  const result = [];

  if (!user.can("invite")) {
    throw new Error("you must be an admin to invite other users");
  }

  if (emails.length === 0) {
    throw new Error("email missing");
  }

  const emailToSend = emails.length > 11 ? emails.slice(0, 10) : emails;

  for (const invetee of emailToSend) {
    let auth0User = await auth0.getUserByEmail(invetee);

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
        email: invetee,
        connection: "Username-Password-Authentication",
        email_verified: false,
        password: `Gj$1${crypto.randomBytes(20).toString("hex")}`,
        verify_email: false,
        user_metadata: {
          intouch_role: INSTALLER,
          market: user.market.domain,
          first_name: firstName,
          last_name: lastName
        }
      });
      logger.info(`Created new user in auth0 with id: ${auth0User?.user_id}`);
    }

    await pgClient.query("SAVEPOINT graphql_mutation");

    // Check if the user already exists
    const { rows: invetees } = await pgRootPool.query(
      "SELECT * FROM account WHERE email = $1",
      [invetee]
    );

    if (invetees.length > 0) {
      logger.info(`User with id: ${invetees[0].id} found`);

      // Check if the user is a member of a company
      const { rows } = await pgRootPool.query(
        "SELECT * FROM company_member WHERE account_id = $1",
        [invetees[0].id]
      );

      // a member can't be invited to another company
      if (rows.length > 0) {
        throw new Error(ERROR_ALREADY_MEMBER);
      }
    }

    try {
      // Creating a new invitation record
      const { rows: invitations } = await pgClient.query(
        "INSERT INTO invitation (sender_account_id, company_id, status, invitee, personal_note) VALUES ($1,$2,$3,$4,$5) RETURNING *",
        [user.id, user.company.id, "NEW", invetee, personalNote]
      );
      logger.info(
        `Created invitation record with id ${invitations[0].id}`,
        invitations
      );

      // When the request started the user wasn't in the db so the parseUSer middleware didn't
      // append any information to the request object
      const updatedContext: PostGraphileContext = {
        ...context,
        user: {
          ...context.user,
          market: {
            ...context.user.market,
            sendMailbox: user.market.sendMailbox
          }
        }
      };

      const targetDomain = getTargetDomain(user.market.domain);

      if (invetees.length === 0) {
        // Creating a passsword reset ticket
        const ticket = await auth0.createResetPasswordTicket({
          user_id: auth0User.user_id,
          result_url: `${protocol}://${targetDomain}.${FRONTEND_URL}/api/invitation?company_id=${user.company.id}`
        });
        await sendMessageWithTemplate(updatedContext, "NEWUSER_INVITED", {
          firstname: invetee,
          company: user.company.name,
          registerlink: `${ticket.ticket}${user.market.domain}`,
          email: invetee
        });
        logger.info("Reset password email sent");
      } else {
        await sendMessageWithTemplate(updatedContext, "MEMBER_INVITED", {
          accountId: invetees[0].id,
          firstname: invetees[0].first_name,
          company: user.company.name,
          registerlink: `${protocol}://${targetDomain}.${FRONTEND_URL}/api/invitation?company_id=${user.company.id}`,
          sender: `${user.firstName} ${user.lastName}`,
          email: invetee
        });
        logger.info("Invitation email sent");
      }

      result.push(invitations[0]);
    } catch (error) {
      logger.error("Error completing invitation", error);
      await pgClient.query("ROLLBACK TO SAVEPOINT graphql_mutation");
    } finally {
      await pgClient.query("RELEASE SAVEPOINT graphql_mutation");
    }
  }

  return result;
};

export const completeInvitation = async (
  _query,
  args,
  context,
  resolveInfo,
  auth0,
  build
) => {
  const { pgSql: sql } = build;
  const { companyId } = args;
  const { pgClient, pgRootPool, protocol } = context;
  const logger = context.logger("service:account");

  let user: Account = context.user;
  const auth0User = await auth0.getUserByEmail(user.email);

  if (!auth0User) {
    throw new Error("User missing in auth0, please contact the support");
  }

  // Get the invitation record to check if the request is legit
  const { rows: invitations } = await pgRootPool.query(
    "select company.market_id, company.name, company.tier, invitation.* from invitation JOIN company ON invitation.company_id = company.id WHERE invitation.company_id = $1 AND invitation.invitee = $2 AND invitation.status = $3",
    [companyId, user.email, "NEW"]
  );

  if (invitations.length === 0) {
    throw new Error(ERROR_INVITATION_NOT_FOUND);
  }

  if (user.company?.id >= 0) {
    throw new Error(ERROR_ALREADY_MEMBER);
  }

  await pgClient.query("SAVEPOINT graphql_mutation");

  try {
    // If the user doesn't exists we create it
    if (!user.id) {
      const { rows } = await pgClient.query(
        "INSERT INTO account (market_id, email, first_name, last_name, role, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [
          invitations[0].market_id,
          user.email,
          auth0User.user_metadata?.first_name,
          auth0User.user_metadata?.last_name,
          INSTALLER,
          "ACTIVE"
        ]
      );

      // Set the account ID
      await pgClient.query(
        `SELECT set_config('app.current_account_id', $1, true);`,
        [rows[0].id]
      );

      user = camelcaseKeys(rows[0]);

      const { rows: markets } = await pgClient.query(
        `SELECT * FROM market WHERE id = $1`,
        [user.marketId]
      );

      // When the request started the user wasn't in the db so the parseUSer middleware didn't
      // append any information to the request object
      const updatedContext: PostGraphileContext = {
        ...context,
        user: {
          ...context.user,
          id: user.id,
          market: {
            ...context.user.market,
            sendMailbox: markets[0].send_mailbox
          }
        }
      };

      const targetDomain = getTargetDomain(markets[0].domain);
      await sendMessageWithTemplate(updatedContext, "ACCOUNT_ACTIVATED", {
        accountId: user.id,
        email: user.email,
        firstname: user.firstName,
        marketUrl: `${protocol}://${targetDomain}.${FRONTEND_URL}`
      });
    }

    // Add the user to the company
    const { rows: company_members } = await pgClient.query(
      "select * from link_account_to_company ($1, $2)",
      [user.id, invitations[0].company_id]
    );

    logger.info(
      `Added reletion with id: ${company_members[0].id} between user: ${company_members[0].account_id} and company ${company_members[0].company_id}`
    );

    const { shortDescription = "", name = "" } = await tierBenefit(
      context.clientGateway,
      invitations[0].tier
    );

    await sendMessageWithTemplate(context, "TEAM_JOINED", {
      email: user.email,
      accountId: user.id,
      firstname: user.firstName,
      company: invitations[0].name,
      tier: name || invitations[0].tier,
      tierBenefitsShortDescription: shortDescription
    });

    const [row] = await resolveInfo.graphile.selectGraphQLResultFromTable(
      sql.fragment`public.account`,
      (tableAlias, queryBuilder) => {
        queryBuilder.where(
          sql.fragment`${tableAlias}.id = ${sql.value(user.id)}`
        );
      }
    );

    await pgRootPool.query(
      "update invitation set status = $1 where id = $2 returning *",
      ["ACCEPTED", invitations[0].id]
    );
    await pgRootPool.query(
      "update invitation set status = $1 where invitee = $2 and status = $3 returning *",
      ["CANCELLED", user.email, "NEW"]
    );

    return row;
  } catch (error) {
    logger.error("complete invitation", error);
    await pgClient.query("ROLLBACK TO SAVEPOINT graphql_mutation");
  } finally {
    await pgClient.query("RELEASE SAVEPOINT graphql_mutation");
  }
};

export const resetPassword = async (
  _query,
  args,
  context,
  resolveInfo,
  auth0
) => {
  const { user } = context;
  const logger = context.logger("service:reset-password");

  try {
    await auth0.changePassword(user.email);
    return "ok";
  } catch (error) {
    logger.error("Email not sent", error);
    return "fail";
  }
};

export const resetPasswordImportedUsers = async (
  _query,
  args,
  context: PostGraphileContext,
  resolveInfo,
  auth0
) => {
  const { pgClient, user } = context;

  const logger = context.logger("service:account");
  if (!user.can("resetImportedUsersPasswords")) {
    throw new Error("you must be an admin to reset passwords");
  }

  let accounts;
  const ids = [];
  const { market }: any = args.input || { market: null };

  // If we are not passing a market we query all the user that need a new password
  if (!market) {
    accounts = await pgClient.query(
      "SELECT * FROM account WHERE migration_id IS NOT NULL AND migrated_to_auth0 IS NOT true ORDER BY id",
      []
    );
  } else {
    // If we are sending the market we query all the user for that particular market
    accounts = await pgClient.query(
      `
      SELECT account.* FROM account
        JOIN market ON market.id = account.market_id
        WHERE migration_id IS NOT NULL AND migrated_to_auth0 IS NOT true AND market.domain = $1 ORDER BY account.id
      `,
      [market]
    );
  }

  for (const account of accounts.rows) {
    try {
      await auth0.changePassword(account.email);
      logger.info(`Reset email sent for user with id: ${account.id}`);

      ids.push(account.id);
    } catch (error) {
      logger.info(`Email not send for user with id: ${account.id}`);
    }
  }

  await pgClient.query(
    "UPDATE account SET migrated_to_auth0 = true WHERE id = ANY($1)",
    [ids]
  );

  return "All done";
};

export const validateSignupUser = async (
  _query,
  args,
  context,
  resolveInfo,
  auth0
) => {
  const logger = context.logger("service:account");
  try {
    const { access_token } = await auth0.getAccessToken();
    const email = encodeURIComponent(args.email);
    const { data } = await axios({
      method: "GET",
      url: `https://${process.env.AUTH0_API_DOMAIN}/api/v2/users-by-email?email=${email}`,
      headers: { Authorization: `Bearer ${access_token}` }
    });
    if (data.length > 0) {
      return data[0].email_verified;
    }
    return true;
  } catch (err) {
    logger.error(`Unable to validate auth0 user: ${args.email}, ${err}`);
    throw new Error("fail");
  }
};

export const deleteInvitedUser = async (
  _query,
  args,
  context,
  resolveInfo,
  auth0
) => {
  const { pgRootPool } = context;
  const logger = context.logger("service:account");
  try {
    const { access_token } = await auth0.getAccessToken();
    const email = encodeURIComponent(args.email);
    const { data } = await axios({
      method: "GET",
      url: `https://${process.env.AUTH0_API_DOMAIN}/api/v2/users-by-email?email=${email}`,
      headers: { Authorization: `Bearer ${access_token}` }
    });
    if (data.length > 0 && !data[0].email_verified) {
      const { user_id } = data[0];
      await axios({
        method: "DELETE",
        url: `https://${process.env.AUTH0_API_DOMAIN}/api/v2/users/${user_id}`,
        headers: { Authorization: `Bearer ${access_token}` }
      });
      logger.info(`Successfully deleted auth0 user: ${args.email}`);

      const { rows: invitations } = await pgRootPool.query(
        `DELETE FROM invitation WHERE invitee = $1 RETURNING *`,
        [args.email]
      );
      if (invitations.length) {
        logger.info(`Deleted invitation with email: ${args.email}`);
      }
    } else if (data.length > 0 && data[0].email_verified) {
      logger.info(`Auth0 user has been verified: ${args.email}`);
      return "fail";
    } else {
      logger.info(`Unable to find user: ${args.email}`);
      return "fail";
    }
    return "ok";
  } catch (err) {
    logger.error(`Unable to delete auth0 user: ${args.email}, ${err}`);
    throw new Error("fail");
  }
};
