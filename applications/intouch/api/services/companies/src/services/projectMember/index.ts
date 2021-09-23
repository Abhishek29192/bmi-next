import { Guarantee, UpdateProjectMemberInput } from "@bmi/intouch-api-types";
import { PoolClient } from "pg";
import { PostGraphileContext } from "../../types";

export const updateProjectMember = async (
  resolve,
  source,
  args: { input: UpdateProjectMemberInput },
  context: PostGraphileContext,
  resolveInfo
) => {
  const { pgClient, logger: Logger, user } = context;

  const logger = Logger("service:projectMember");

  await pgClient.query("SAVEPOINT graphql_update_project_member");

  try {
    const { id, patch } = args.input;

    if (!user.can("grant:nominate_responsible_installer")) {
      logger.error(
        `User with id: ${user.id} and role: ${user.role} is trying to update project member ${id}`
      );
      throw new Error("unauthorized");
    }

    if (patch.isResponsibleInstaller) {
      const isSubmit = await isSolutionGuaranteeSubmitted(id, pgClient);
      if (isSubmit) {
        logger.error(
          `User with id: ${user.id} and role: ${user.role} is trying to update project member ${id}`
        );
        throw new Error("The guarantee status must be NEW or REJECTED");
      }

      await pgClient.query(
        `update project_member p1 set is_responsible_installer = false
        from project_member p2 
        where p2.project_id=p1.project_id 
        and p2.id=$1 and p1.id<>$1
        and p1.is_responsible_installer =true`,
        [id]
      );
    }

    return await resolve(source, args, context, resolveInfo);
  } catch (e) {
    logger.error("Error update project member:", e);

    await pgClient.query("ROLLBACK TO SAVEPOINT graphql_update_project_member");
    throw e;
  } finally {
    await pgClient.query("RELEASE SAVEPOINT graphql_update_project_member");
  }
};

/**
A project can only have one SYSTEM or SOLUTION, and multiple PRODUCT guarantee 
which will always be approved automatically. We can nominate the responsible Installer 
if the Guarantee is in a state of NEW or REJECTED
 */
const isSolutionGuaranteeSubmitted = async (
  id: number,
  pgClient: PoolClient
): Promise<boolean> => {
  const { rows } = await pgClient.query<Guarantee>(
    `select g.* from guarantee g
  join project_member pm on g.project_id = pm.project_id 
  where pm.id=$1 and g.coverage='SOLUTION' and g.status not in ('NEW','REJECTED')`,
    [id]
  );

  //You can nominate the responsible Installer for a Solution Guarantee from the Project’s Team tab if the Guarantee is in a state of NEW or REJECTED
  return rows.length > 0;
};
