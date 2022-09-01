import { UpdateProjectInput, Guarantee } from "@bmi/intouch-api-types";
import { PoolClient, QueryResult } from "pg";
import { sub, format } from "date-fns";
import { sendMailToMarketAdmins } from "../guarantee";

// Checks if some of the values in disallowed exist in input
const checkDisallowedInputs = (input, disallowed) =>
  disallowed.some((value) => input.includes(value));

const findProjectGuarantee = async (
  projectId: number,
  pgClient: PoolClient
) => {
  const { rows } = await pgClient.query<Guarantee>(
    `SELECT * FROM guarantee where project_id=$1`,
    [projectId]
  );

  return rows[0];
};

type ProjectQuery = QueryResult<{ id: number }>;

export const updateProject = async (
  resolve,
  source,
  args: { input: UpdateProjectInput },
  context,
  resolveInfo
) => {
  const { id: projectId, patch } = args.input;
  const { pgClient } = context;

  const guarantee = await findProjectGuarantee(projectId, pgClient);

  // All the Project's details can be edited while there is no Guarantee associated with the Project.
  if (!guarantee) {
    return resolve();
  }

  // If a Project has a Guarantee associated with it, the technology cannot be edited
  if (patch.technology) {
    throw new Error(
      "Cannot update project technology if there is a guarantee on a project."
    );
  }

  // If an associated Guarantee has a status of APPROVED, SUBMITTED or REVIEW, you CANNOT edit the following Project details:
  // If a Guarantee has a status of NEW or REJECTED then these fields CAN be edited
  // You cannot edit the Building Owner details if the project has any Guarantee that is in a status of APPROVED, SUBMITTED or REVIEW.
  if (["APPROVED", "SUBMITTED", "REVIEW"].includes(guarantee.status)) {
    const disallowedInputs = [
      "name",
      "description",
      "roofArea",
      "startDate",
      "endDate",

      // represents siteAddress create/update via nested mutation
      "addressToSiteAddressId",
      // Site address via change of ID
      "siteAddressId",

      // Building owner
      "buildingOwnerAddressId",
      "buildingOwnerMail",
      "buildingOwnerFirstname",
      "buildingOwnerLastname",
      "buildingOwnerCompany"
    ];

    if (checkDisallowedInputs(Object.keys(patch), disallowedInputs)) {
      throw new Error(
        `Cannot update these fields once guarantee on project is SUBMITTED, REVIEW, or APPROVED: ${disallowedInputs.join(
          ", "
        )}`
      );
    }
  }

  return resolve();
};

export const archiveProjects = async (
  resolve,
  source,
  args,
  context,
  resolveInfo
) => {
  const savepointName = "graphql_archive_projects_mutation";
  const { pgClient, logger: Logger } = context;
  const logger = Logger("service:projects");

  await pgClient.query(`SAVEPOINT ${savepointName}`);

  try {
    const criteria1 = format(sub(new Date(), { days: 100 }), "yyyy-MM-dd");
    const criteria2 = format(sub(new Date(), { days: 200 }), "yyyy-MM-dd");
    const result = await Promise.allSettled([
      pgClient.query(
        `SELECT p.id FROM project p LEFT JOIN guarantee g ON g.project_id = p.id WHERE g.project_id IS NULL AND p.end_date < $1 AND p.hidden = false`,
        [criteria1]
      ),
      pgClient.query(
        `SELECT p.id FROM project p LEFT JOIN guarantee g ON g.project_id = p.id WHERE g.project_id IS NOT NULL AND g.status != $1 AND p.end_date < $2 AND p.hidden = false group by p.id`,
        ["APPROVED", criteria2]
      ),
      pgClient.query(
        `SELECT p.id FROM project p LEFT JOIN guarantee g ON g.project_id = p.id WHERE g.project_id IS NOT NULL AND g.status = $1 AND g.start_date < $2 AND p.hidden = false group by p.id`,
        ["APPROVED", criteria2]
      )
    ]);
    const projectToBeArchived = result
      .reduce(
        (prev, current) =>
          current.status === "fulfilled"
            ? [
                ...prev,
                ...(current as PromiseFulfilledResult<ProjectQuery>).value.rows
              ]
            : prev,
        []
      )
      .filter(Boolean);

    if (projectToBeArchived.length) {
      const { rows: archivedProjects } = await pgClient.query(
        `UPDATE project SET hidden = true WHERE id IN (${projectToBeArchived.map(
          (_, id) => `$${id + 1}`
        )}) RETURNING id`,
        [...projectToBeArchived.map(({ id }) => id)]
      );
      if (archivedProjects.length) {
        const message = `Projects with id(s) ${archivedProjects.map(
          ({ id }) => id
        )} has be archived.`;
        logger.info(message);

        return message;
      }
    }
    const message = `No projects to be archived.`;
    logger.info(message);

    return message;
  } catch (error) {
    logger.error(`Failed to archive projects`);
    await pgClient.query(`ROLLBACK TO SAVEPOINT ${savepointName}`);

    throw error;
  } finally {
    await pgClient.query(`RELEASE SAVEPOINT ${savepointName}`);
  }
};

export const annualProjectsInspection = async (
  resolve,
  source,
  args,
  context,
  resolveInfo
) => {
  const savepointName = "graphql_annual_inspection_mutation";
  const { pgClient, logger: Logger } = context;
  const logger = Logger("service:projects");

  await pgClient.query(`SAVEPOINT ${savepointName}`);
  try {
    const market = context?.user?.market?.domain;

    const criteria = format(sub(new Date(), { months: 11 }), "yyyy-MM-dd");
    const { rows } = await pgClient.query(
      `SELECT p.id FROM project p INNER JOIN company c ON c.id = p.company_id INNER JOIN market m ON m.id = c.market_id LEFT JOIN guarantee g ON g.project_id = p.id WHERE p.inspected_at IS NULL AND p.inspection = true AND g.status = $1 AND g.project_id IS NOT NULL AND g.approved_at < $2 AND p.hidden = false and g.coverage = $3 AND m.domain = $4`,
      ["APPROVED", criteria, "SOLUTION", market]
    );
    if (rows.length) {
      const { rows: inspectedProjects } = await pgClient.query(
        `UPDATE project SET inspected_at = NOW() WHERE id IN (${rows.map(
          (_, id) => `$${id + 1}`
        )}) RETURNING id`,
        [...rows.map(({ id }) => id)]
      );
      for (let i = 0; i < inspectedProjects.length; i++) {
        const projectId = inspectedProjects[+i].id;
        // Send message to market admins.
        sendMailToMarketAdmins(context, projectId, "ANNUAL_INSPECTION1");
      }
      const message = `Projects with id(s) ${inspectedProjects.map(
        ({ id }) => id
      )} has been inspected for market ${market}.`;
      logger.info(message);

      return message;
    }
    const message = `No projects to be inspected for market ${market}.`;
    logger.info(message);

    return message;
  } catch (error) {
    logger.error("Failed to perform annual inspection");
    await pgClient.query(`ROLLBACK TO SAVEPOINT ${savepointName}`);

    throw error;
  } finally {
    await pgClient.query(`RELEASE SAVEPOINT ${savepointName}`);
  }
};
