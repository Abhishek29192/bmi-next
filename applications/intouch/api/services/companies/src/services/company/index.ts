import { DeleteCompanyMemberInput } from "@bmi/intouch-api-types";
import { publish, TOPICS } from "../../services/events";

export const updateCompany = async (
  resolve,
  source,
  args,
  context,
  resolveInfo
) => {
  const result = await resolve(source, args, context, resolveInfo);
  const { pgClient } = context;
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
    "SELECT account.id, account.role, account.email, company_member.company_id AS company_id FROM account JOIN company_member ON account.id = company_member.account_id WHERE company_member.id = $1",
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
      `Removing user with id: ${userToRemove.id} from the projects that is a member of`
    );

    const result = await resolve(source, args, context, resolveInfo);

    await publish(context, TOPICS.TRANSACTIONAL_EMAIL, {
      title: `You have been removed from the company ${userToRemove.company_id}`,
      text: `
        You have been removed from the company ${userToRemove.company_id}
      `,
      html: `
        You have been removed from the company <b>${userToRemove.company_id}</b>
      `,
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
