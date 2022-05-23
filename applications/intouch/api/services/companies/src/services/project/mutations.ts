import { UpdateProjectInput, Guarantee } from "@bmi/intouch-api-types";
import { PoolClient } from "pg";
import { sub, format } from "date-fns";

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
    const dateToCompare = format(sub(new Date(), { days: 100 }), "yyyy-MM-dd");
    const { rows: projects } = await pgClient.query(
      `SELECT project.id FROM project LEFT JOIN guarantee ON guarantee.project_id = project.id WHERE guarantee.project_id IS NULL AND project.end_date < $1 AND project.hidden = false`,
      [dateToCompare]
    );

    if (projects.length) {
      const { rows: archivedProjects } = await pgClient.query(
        `UPDATE project SET hidden = true WHERE id IN (${projects.map(
          (_, id) => `$${id + 1}`
        )}) RETURNING id`,
        [...projects.map(({ id }) => id)]
      );
      if (archivedProjects.length) {
        logger.info(
          `Projects with id(s) ${archivedProjects.map(
            ({ id }) => id
          )} has be archived.`
        );
      }
    } else {
      logger.info(`No projects to be archived.`);
    }
    return "ok";
  } catch (error) {
    logger.error(`Failed to archive projects`);
    await pgClient.query(`ROLLBACK TO SAVEPOINT ${savepointName}`);

    throw error;
  } finally {
    await pgClient.query(`RELEASE SAVEPOINT ${savepointName}`);
  }
};
