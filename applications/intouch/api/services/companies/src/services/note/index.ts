import { Account, CreateNoteInput } from "@bmi/intouch-api-types";
import { PoolClient } from "pg";
import { PostGraphileContext } from "../../types";
import { sendMessageWithTemplate, sendMailToMarketAdmins } from "../mailer";

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
  const event = "NOTE_ADDED";
  const projectDetails = await getProjectDetails(projectId, pgRootPool);
  const { rows: companyAdmins } = await pgRootPool.query(
    `select account.* from account 
join company_member on company_member.account_id =account.id 
where company_member.company_id=$1 and account.role='COMPANY_ADMIN'`,
    [projectDetails.companyId]
  );

  const {
    rows: [author]
  } = await pgRootPool.query(
    `SELECT email, first_name, last_name FROM account WHERE id = $1 `,
    [authorId]
  );
  const users: Account[] = [...companyAdmins];
  const dynamicContent = {
    project: `${projectDetails.name}`,
    projectId,
    noteAuthor: author
      ? `${author.first_name} ${author.last_name} (${author.email})`
      : "",
    noteSnippet: body
  };

  for (let i = 0; i < users.length; i++) {
    const account = users[+i];
    await sendMessageWithTemplate(context, event, {
      accountId: account.id,
      email: account.email,
      ...dynamicContent
    });
  }
  await sendMailToMarketAdmins(context, event, dynamicContent);
};

type ProjectDetail = {
  name: string;
  companyId: number;
  marketId: number;
};
