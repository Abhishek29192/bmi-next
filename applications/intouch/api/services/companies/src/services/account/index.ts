import crypto from "crypto";
import camelcaseKeys from "camelcase-keys";
import { FileUpload } from "graphql-upload";
import { InviteInput, Role } from "@bmi/intouch-api-types";
import { UpdateAccountInput } from "@bmi/intouch-api-types";
import { sendEmailWithTemplate } from "../../services/mailer";
import { updateUser } from "../../services/training";
import StorageClient from "../storage-client";
import { Account } from "../../types";

const INSTALLER: Role = "INSTALLER";
const COMPANY_ADMIN: Role = "COMPANY_ADMIN";

const ERROR_ALREADY_MEMBER = "The user is already a member of another company";
const ERROR_INVITATION_NOT_FOUND = "Invitation not found";

export const createAccount = async (
  resolve,
  source,
  args,
  context,
  resolveInfo
) => {
  const { pgSql: sql } = resolveInfo.graphile.build;
  const { pgClient, logger: Logger } = context;

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
        ["", "", "", null, null, "NEW", "", "", "", "", "", "", "", ""]
      );
    }

    const { rows: markets } = await pgClient.query(
      `SELECT * FROM market WHERE id = $1`,
      [result.data.$market_id]
    );

    // When the request started the user wasn't in the db so the parseUSer middleware didn't
    // append any information to the request object
    const updatedContext = {
      ...context,
      user: {
        ...context.user,
        id: result.data.$account_id,
        market: {
          sendMailbox: markets[0].send_mailbox
        }
      }
    };

    await sendEmailWithTemplate(updatedContext, "ACCOUNT_ACTIVATED", {
      email: result.data.$email,
      firstname: result.data.$first_name,
      marketUrl: `https://${markets[0].domain}.${process.env.FRONTEND_URL}`
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
  args: { input: UpdateAccountInput },
  context,
  resolveInfo
) => {
  const { GCP_BUCKET_NAME } = process.env;

  const { pgClient, user, logger: Logger } = context;
  const { photoUpload, role, shouldRemovePhoto } = args.input.patch;

  const logger = Logger("service:account");

  await pgClient.query("SAVEPOINT graphql_mutation");

  try {
    if (role) {
      const { rows: users } = await pgClient.query(
        "select account.* from account join company_member on account.id = company_member.account_id where company_member.company_id = $1",
        [user.company.id]
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
        if (!user.can("grant:market_admin") && role === "MARKET_ADMIN") {
          logger.error(
            `User with id: ${user.id} is trying to grant market admin to user ${args.input.id}`
          );
          throw new Error("unauthorized");
        }
        if (!user.can("grant:super_admin") && role === "SUPER_ADMIN") {
          logger.error(
            `User with id: ${user.id} is trying to grant super admin to user ${args.input.id}`
          );
          throw new Error("unauthorized");
        }

        const result = await resolve(source, args, context, resolveInfo);

        const POWER_USER_LEVEL = 4;
        const REGULAR_USER_LEVEL = 6;

        const level =
          role === "COMPANY_ADMIN" ? POWER_USER_LEVEL : REGULAR_USER_LEVEL;

        await updateUser({
          userid: `${result.data.$docebo_user_id}`,
          level
        });

        await sendEmailWithTemplate(context, "ROLE_ASSIGNED", {
          email: result.data.$email,
          firstname: result.data.$first_name,
          role: role?.toLowerCase().replace("_", " ")
        });

        return result;
      }
    }

    if (!photoUpload && shouldRemovePhoto) {
      args.input.patch.photo = null;
    }

    if (photoUpload) {
      const newFileName = `profile/${args.input.id}-${Date.now()}`;

      const uploadedFile: FileUpload = await photoUpload;

      args.input.patch.photo = newFileName;

      const storageClient = new StorageClient();
      await storageClient.uploadFileByStream(
        GCP_BUCKET_NAME,
        newFileName,
        uploadedFile
      );
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
        const storageClient = new StorageClient();
        await storageClient.deleteFile(GCP_BUCKET_NAME, currentPhoto);
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

export const invite = async (_query, args, context, resolveInfo, auth0) => {
  const logger = context.logger("service:account");

  const user: Account = context.user;
  const { pgClient, pgRootPool } = context;

  const {
    emails,
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

  for (const invetee of emails) {
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
      const updatedContext = {
        ...context,
        user: {
          ...context.user,
          market: {
            sendMailbox: user.market.sendMailbox
          }
        }
      };

      if (invetees.length === 0) {
        // Creating a passsword reset ticket
        const ticket = await auth0.createResetPasswordTicket({
          user_id: auth0User?.user_id,
          result_url: `https://${process.env.FRONTEND_URL}/api/invitation?company_id=${user.company.id}`
        });
        await sendEmailWithTemplate(updatedContext, "NEWUSER_INVITED", {
          firstname: invetee,
          company: user.company.name,
          registerlink: ticket.ticket,
          email: invetee
        });
        logger.info("Reset password email sent");
      } else {
        await sendEmailWithTemplate(updatedContext, "NEWUSER_INVITED", {
          firstname: invetees[0].first_name,
          company: user.company.name,
          registerlink: `https://${process.env.FRONTEND_URL}/api/invitation?company_id=${user.company.id}`,
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
  const { pgClient, pgRootPool } = context;
  const logger = context.logger("service:account");

  let user: Account = context.user;
  let auth0User = await auth0.getUserByEmail(user.email);

  if (!auth0User) {
    throw new Error("User missing in auth0, please contact the support");
  }

  // Get the invitation record to check if the request is legit
  const { rows: invitations } = await pgRootPool.query(
    "select company.market_id, invitation.* from invitation JOIN company ON invitation.company_id = company.id WHERE invitation.company_id = $1 AND invitation.invitee = $2 AND invitation.status = $3",
    [companyId, user.email, "NEW"]
  );

  if (invitations.length === 0) {
    throw new Error(ERROR_INVITATION_NOT_FOUND);
  }

  if (user?.company?.id >= 0) {
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
      const updatedContext = {
        ...context,
        user: {
          ...context.user,
          id: user.id,
          market: {
            sendMailbox: markets[0].send_mailbox
          }
        }
      };

      await sendEmailWithTemplate(updatedContext, "ACCOUNT_ACTIVATED", {
        email: user.email,
        firstname: user.firstName,
        marketUrl: `https://${markets[0].domain}.${process.env.FRONTEND_URL}`
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

export const getAccountSignedPhotoUrl = async (photoName: string) => {
  const { GCP_BUCKET_NAME } = process.env;
  if (!photoName) {
    return "";
  }

  const expireDate = new Date();
  expireDate.setDate(expireDate.getDate() + 1);

  const storageClient = new StorageClient();
  return await storageClient.getFileSignedUrl(
    GCP_BUCKET_NAME,
    photoName,
    expireDate
  );
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
