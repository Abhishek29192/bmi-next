import { UpdateProjectInput, Guarantee } from "@bmi/intouch-api-types";
import { PoolClient } from "pg";

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
