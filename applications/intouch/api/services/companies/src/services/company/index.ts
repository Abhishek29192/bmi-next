import {
  Company,
  CompanyPatch,
  DeleteCompanyMemberInput,
  Tier,
  UpdateCompanyInput
} from "@bmi/intouch-api-types";
import { PoolClient } from "pg";
import { PostGraphileContext } from "../../types";
import { sendMessageWithTemplate } from "../../services/mailer";
import { tierBenefit } from "../contentful";

export const updateCompany = async (
  resolve,
  source,
  args: { input: UpdateCompanyInput },
  context: PostGraphileContext,
  resolveInfo
) => {
  const { GCP_PUBLIC_BUCKET_NAME } = process.env;
  const { pgClient, storageClient, user } = context;
  const { logoUpload, shouldRemoveLogo, tier }: CompanyPatch = args.input.patch;

  if (!logoUpload && shouldRemoveLogo) {
    args.input.patch.logo = null;
  }

  if (logoUpload) {
    const { GCP_PUBLIC_BUCKET_NAME } = process.env;

    const fileName = `companies/logos/${args.input.id}/${Date.now()}`;

    const uploadedFile = await logoUpload;

    await storageClient.uploadFileByStream(
      GCP_PUBLIC_BUCKET_NAME,
      fileName,
      uploadedFile
    );
    args.input.patch.logo = storageClient.getPublicFileUrl(fileName);
  }

  // if the admin wants to remove the logo OR a new logo has been uploaded
  if ((!logoUpload && shouldRemoveLogo) || logoUpload) {
    const {
      rows: [{ logo: currentLogoURL }]
    } = await pgClient.query("select company.logo from company where id = $1", [
      user.company.id
    ]);

    // delete the previous image if it exists & is hosted on GCP Cloud storage
    // for now, not trying to delete externally hosted images (e.g. mock data)
    if (currentLogoURL?.startsWith("https://storage.googleapis.com")) {
      await storageClient.deleteFile(
        GCP_PUBLIC_BUCKET_NAME,
        storageClient.getFileNameFromPublicUrl(currentLogoURL)
      );
    }
  }

  const activeCompanyTier = await getCompanyTier(args.input.id, pgClient);

  const result = await resolve(source, args, context, resolveInfo);

  const {
    data: {
      $name,
      $business_type,
      $tax_number,
      $status,
      $registered_address_id
    }
  } = result;

  const {
    rows: [registeredAddress]
  } = await pgClient.query(
    "select address.* from address where address.id = $1",
    [$registered_address_id]
  );

  if (
    $status === "NEW" &&
    // mandatory fields to activate company
    $name &&
    $business_type &&
    $tax_number &&
    ["first_line", "town", "postcode", "country"].every(
      (line) => registeredAddress[line]
    )
  ) {
    await pgClient.query("SELECT * FROM activate_company($1)", [args.input.id]);
    await sendMessageWithTemplate(context, "COMPANY_REGISTERED", {
      email: user.email,
      accountId: user.id,
      firstname: user.firstName,
      company: $name
    });
  }

  if (tier && activeCompanyTier !== tier) {
    const { shortDescription = "", name = "" } = await tierBenefit(
      context.clientGateway,
      tier
    );
    //Get all company admins and send mail
    const { rows: accounts } = await pgClient.query(
      `select account.* from account 
  join company_member on company_member.account_id =account.id 
  where company_member.company_id=$1`,
      [args.input.id]
    );

    for (let i = 0; i < accounts?.length; i++) {
      const account = accounts[+i];
      await sendMessageWithTemplate(context, "TIER_ASSIGNED", {
        email: account.email,
        accountId: account.id,
        firstname: account.first_name,
        tier: name || tier,
        tierBenefitsShortDescription: shortDescription
      });
    }
  }

  return result;
};

export const deleteCompanyMember = async (
  resolve,
  source,
  args,
  context,
  resolveInfo
) => {
  const { pgClient } = context;
  const { id }: DeleteCompanyMemberInput = args.input;

  const logger = context.logger("delete:companyMember");

  const { rows } = await pgClient.query(
    `
    SELECT
      account.id,
      account.role,
      account.first_name,
      account.last_name,
      account.email,
      company_member.company_id AS company_id,
      company.name
    FROM
      account
      JOIN company_member ON account.id = company_member.account_id
      JOIN company ON company.id = company_member.company_id
    WHERE
      company_member.id = $1
    `,
    [id]
  );

  if (!rows.length) {
    throw new Error("user not in this company");
  }

  const userToRemove = rows[0];

  if (userToRemove.role !== "INSTALLER") {
    throw new Error("you can remove only installers");
  }

  try {
    await pgClient.query("SAVEPOINT graphql_mutation");

    await pgClient.query(
      "delete from project_member where account_id = $1 returning *",
      [userToRemove.id]
    );

    logger.info(
      `Removing user with id: ${userToRemove.id} from the company's projects`
    );

    const result = await resolve(source, args, context, resolveInfo);

    await sendMessageWithTemplate(context, "COMPANY_MEMBER_REMOVED", {
      account: userToRemove.email,
      accountId: userToRemove.id,
      firstname: userToRemove.first_name,
      company: userToRemove.name,
      email: userToRemove.email
    });
    logger.info(`Email sent to the user ${userToRemove.id}`);

    return result;
  } catch (error) {
    logger.error(
      `Error removing user with id: ${userToRemove.id} from company ${userToRemove.company_id}`
    );

    await pgClient.query("ROLLBACK TO SAVEPOINT graphql_mutation");
    throw error;
  } finally {
    await pgClient.query("RELEASE SAVEPOINT graphql_mutation");
  }
};

const getCompanyTier = async (
  id: number,
  pgClient: PoolClient
): Promise<Tier> => {
  const { rows } = await pgClient.query<Company>(
    `SELECT company.tier FROM company where company.id=$1`,
    [id]
  );

  return rows?.[0]?.tier;
};
