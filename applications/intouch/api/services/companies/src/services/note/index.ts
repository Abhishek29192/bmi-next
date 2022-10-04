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

    await sendMessage(note, context);

    return newNote;
  } catch (e) {
    logger.error("Error insert note:", e);

    await pgClient.query("ROLLBACK TO SAVEPOINT graphql_create_note");
    throw e;
  } finally {
    await pgClient.query("RELEASE SAVEPOINT graphql_create_note");
  }
};

const getProjectDetails = async (
  projectId: number,
  pgClient: PoolClient
): Promise<ProjectDetail> => {
  const {
    rows: [projectDetail]
  } = await pgClient.query(
    `select project.name, project.company_id as "companyId",company.market_id as "marketId" 
     from project join company on company.id=project.company_id
     where project.id=$1`,
    [projectId]
  );

  return projectDetail;
};

const sendMessage = async (
  { projectId, authorId, body }: CreateNoteInput["note"],
  context: PostGraphileContext
) => {
  const { pgRootPool } = context;

  const projectDetails = await getProjectDetails(projectId, pgRootPool);

  //Get all company admins and send mail
  const { rows: companyAdmins } = await pgRootPool.query(
    `select account.* from account 
join company_member on company_member.account_id =account.id 
where company_member.company_id=$1 and account.role='COMPANY_ADMIN'`,
    [projectDetails.companyId]
  );

  //Get all market admins and send mail
  const { rows: marketAdmins } = await pgRootPool.query(
    `select account.* from account 
        join market on market.id =account.market_id 
        where market.id=$1 and account.role='MARKET_ADMIN'`,
    [projectDetails.marketId]
  );

  const {
    rows: [{ first_name: firstName, last_name: lastName, email }]
  } = await pgRootPool.query(
    `SELECT email, first_name, last_name FROM account WHERE id = $1 `,
    [authorId]
  );

  const users: Account[] = [...companyAdmins, ...marketAdmins];

  for (let i = 0; i < users.length; i++) {
    const account = users[+i];
    await sendMessageWithTemplate(context, "NOTE_ADDED", {
      accountId: account.id,
      email: account.email,
      project: `${projectDetails.name}`,
      projectId,
      noteAuthor: `${firstName} ${lastName} (${email})`,
      noteSnippet: body
    });
  }
};

type ProjectDetail = {
  name: string;
  companyId: number;
  marketId: number;
};
