import { Account, CreateNoteInput } from "@bmi/intouch-api-types";
import { PoolClient } from "pg";
import { PostGraphileContext } from "../../types";
import { sendMessageWithTemplate } from "../mailer";

export const createNote = async (
  resolve,
  source,
  args: { input: CreateNoteInput },
  context: PostGraphileContext,
  resolveInfo
) => {
  const { pgClient, logger: Logger } = context;

  const logger = Logger("service:note");

  await pgClient.query("SAVEPOINT graphql_create_note");

  try {
    const { note } = args.input;
    const newNote = await resolve(source, args, context, resolveInfo);

    await sendMessage(note.projectId, context);

    return newNote;
  } catch (e) {
    logger.error("Error insert note:", e);

    await pgClient.query("ROLLBACK TO SAVEPOINT graphql_create_note");
    throw e;
  } finally {
    await pgClient.query("RELEASE SAVEPOINT graphql_create_note");
  }
};

const getProjectName = async (
  projectId: number,
  pgClient: PoolClient
): Promise<string> => {
  const {
    rows: [{ name: projectName }]
  } = await pgClient.query(
    `select project.name from project
     where project.id=$1`,
    [projectId]
  );

  return projectName;
};

const sendMessage = async (projectId: number, context: PostGraphileContext) => {
  const { pgClient, user } = context;

  const projectName = await getProjectName(projectId, pgClient);

  //Get all company admins and send mail
  const { rows: companyAdmins } = await pgClient.query(
    `select account.* from account 
join company_member on company_member.account_id =account.id 
where company_member.company_id=$1 and account.role='COMPANY_ADMIN'`,
    [user.company.id]
  );

  //Get all market admins and send mail
  const { rows: marketAdmins } = await pgClient.query(
    `select account.* from account 
        join market on market.id =account.market_id 
        where market.id=$1 and account.role='MARKET_ADMIN'`,
    [user.marketId]
  );

  const users: Account[] = [...companyAdmins, ...marketAdmins];

  for (let i = 0; i < users?.length; i++) {
    const account = users[+i];
    await sendMessageWithTemplate(context, "NOTE_ADDED", {
      accountId: account.id,
      email: account.email,
      project: `${projectName}`
    });
  }
};
