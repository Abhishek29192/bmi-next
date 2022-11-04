import { sub, format } from "date-fns";
import {
  updateProject,
  archiveProjects,
  annualProjectsInspection
} from "../mutations";
// import * as emailsFactory from "../../guarantee";
import { sendMailToMarketAdmins } from "../../../services/mailer";

jest.mock("../../../services/mailer", () => ({
  sendMailToMarketAdmins: jest.fn()
}));

describe("Project", () => {
  const resolve = jest.fn();
  const source = {};
  let args;
  let context;
  const resolveInfo = {};
  const query = jest.fn();
  const loggerInfo = jest.fn();
  const loggerError = jest.fn();

  const mockGetDbPoolQuery = jest.fn();
  jest.mock("../../../db", () => ({
    getDbPool: () => ({
      query: (...params) => mockGetDbPoolQuery(...params)
    })
  }));

  beforeEach(() => {
    context = {
      pubSub: {},
      logger: () => ({
        info: (message) => loggerInfo(message),
        error: (message) => loggerError(message)
      }),
      pgClient: {
        query
      },
      user: {
        role: "COMPANY_ADMIN"
      }
    };

    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  describe("mutations", () => {
    describe("updateProject", () => {
      it("should update project if no guarantee is associated with it", async () => {
        query.mockImplementationOnce(() => ({ rows: [] }));
        args = {
          input: {
            id: 1,
            patch: {}
          }
        };

        await updateProject(resolve, source, args, context, resolveInfo);
        expect(resolve).toBeCalledTimes(1);
      });

      it("should throw error if updating technology when project has guarantee", async () => {
        query.mockImplementationOnce(() => ({ rows: [{ status: "NEW" }] }));
        args = {
          input: {
            id: 1,
            patch: {
              technology: "FLAT"
            }
          }
        };

        try {
          await updateProject(resolve, source, args, context, resolveInfo);
        } catch (error) {
          expect(error.message).toEqual(
            "Cannot update project technology if there is a guarantee on a project."
          );
        }
      });

      it("should allow update if project has guarantee in NEW or REJECTED state", async () => {
        args = {
          input: {
            id: 1,
            patch: {
              name: "Company Name"
            }
          }
        };

        const testStatus = async (status: string) => {
          query.mockImplementationOnce(() => ({
            rows: [{ status }]
          }));

          await updateProject(resolve, source, args, context, resolveInfo);
          expect(resolve).toBeCalledTimes(1);

          // Resetting so `testStatus` can be considered as an individual test
          jest.resetAllMocks();
        };

        await testStatus("NEW");
        await testStatus("REJECTED");
      });

      it("should throw error if project has guarantee in SUBMITTED, APPROVED, or REVIEW state", async () => {
        args = {
          input: {
            id: 1,
            patch: {
              name: "Company Name"
            }
          }
        };

        const testStatus = async (status: string) => {
          query.mockImplementationOnce(() => ({
            rows: [{ status }]
          }));

          try {
            await updateProject(resolve, source, args, context, resolveInfo);
          } catch (error) {
            expect(error.message).toMatchSnapshot();
          }
        };

        await testStatus("SUBMITTED");
        await testStatus("APPROVED");
        await testStatus("REVIEW");
      });
    });

    describe("archiveProjects", () => {
      const criteria1 = format(sub(new Date(), { days: 100 }), "yyyy-MM-dd");
      const criteria2 = format(sub(new Date(), { days: 200 }), "yyyy-MM-dd");
      const resultMessage = "Projects with id(s) 1,2,3 has be archived.";
      it("normal case", async () => {
        query
          .mockImplementationOnce(() => jest.fn())
          .mockImplementationOnce(() => ({ rows: [{ id: 1 }] }))
          .mockImplementationOnce(() => ({ rows: [{ id: 2 }] }))
          .mockImplementationOnce(() => ({ rows: [{ id: 3 }] }))
          .mockImplementationOnce(() => ({
            rows: [{ id: 1 }, { id: 2 }, { id: 3 }]
          }));
        const result = await archiveProjects(
          resolve,
          source,
          args,
          context,
          resolveInfo
        );

        expect(result).toBe(resultMessage);
        expect(query).toHaveBeenNthCalledWith(
          1,
          "SAVEPOINT graphql_archive_projects_mutation"
        );
        expect(query).toHaveBeenNthCalledWith(
          2,
          `SELECT p.id FROM project p LEFT JOIN guarantee g ON g.project_id = p.id WHERE g.project_id IS NULL AND p.end_date < $1 AND p.hidden = false`,
          [criteria1]
        );
        expect(query).toHaveBeenNthCalledWith(
          3,
          `SELECT p.id FROM project p LEFT JOIN guarantee g ON g.project_id = p.id WHERE g.project_id IS NOT NULL AND g.status != $1 AND p.end_date < $2 AND p.hidden = false group by p.id`,
          ["APPROVED", criteria2]
        );
        expect(query).toHaveBeenNthCalledWith(
          4,
          `SELECT p.id FROM project p LEFT JOIN guarantee g ON g.project_id = p.id WHERE g.project_id IS NOT NULL AND g.status = $1 AND g.start_date < $2 AND p.hidden = false group by p.id`,
          ["APPROVED", criteria2]
        );
        expect(query).toHaveBeenNthCalledWith(
          5,
          `UPDATE project SET hidden = true WHERE id IN ($1,$2,$3) RETURNING id`,
          [1, 2, 3]
        );
        expect(query).toHaveBeenNthCalledWith(
          6,
          "RELEASE SAVEPOINT graphql_archive_projects_mutation"
        );
        expect(loggerInfo).toHaveBeenCalledWith(resultMessage);
      });

      it("show logger info when no project to archive", async () => {
        query
          .mockImplementationOnce(() => jest.fn())
          .mockImplementationOnce(() => ({ rows: [] }))
          .mockImplementationOnce(() => ({ rows: [] }))
          .mockImplementationOnce(() => ({ rows: [] }));
        await archiveProjects(resolve, source, args, context, resolveInfo);

        expect(loggerInfo).toHaveBeenCalledWith("No projects to be archived.");
      });

      it("when either of the query settled as rejected", async () => {
        query
          .mockImplementationOnce(() => jest.fn())
          .mockImplementationOnce(() => ({ rows: [{ id: 1 }] }))
          .mockImplementationOnce(() => ({ rows: [] }))
          .mockImplementationOnce(() => Promise.reject("rejected"))
          .mockImplementationOnce(() => ({ rows: [{ id: 1 }] }));

        const result = await archiveProjects(
          resolve,
          source,
          args,
          context,
          resolveInfo
        );

        expect(result).toBe("Projects with id(s) 1 has be archived.");
      });

      it("when all of the queries settled as rejected", async () => {
        query
          .mockImplementationOnce(() => jest.fn())
          .mockImplementationOnce(() => Promise.reject("rejected"))
          .mockImplementationOnce(() => Promise.reject("rejected"))
          .mockImplementationOnce(() => Promise.reject("rejected"));
        await archiveProjects(resolve, source, args, context, resolveInfo);

        expect(loggerInfo).toHaveBeenCalledWith("No projects to be archived.");
      });

      it("throw error when failed to update DB", async () => {
        const errorObject = new Error("error");
        query
          .mockImplementationOnce(() => jest.fn())
          .mockImplementationOnce(() => ({ rows: [{ id: 1 }] }))
          .mockImplementationOnce(() => ({ rows: [] }))
          .mockImplementationOnce(() => ({ rows: [] }))
          .mockRejectedValueOnce(errorObject);
        try {
          await archiveProjects(resolve, source, args, context, resolveInfo);
        } catch (err) {
          expect(err).toBe(errorObject);
        }
        expect(loggerError).toHaveBeenCalledWith("Failed to archive projects");
        expect(query).toHaveBeenCalledWith(
          "ROLLBACK TO SAVEPOINT graphql_archive_projects_mutation"
        );
      });
    });

    describe("annualProjectsInspection", () => {
      const project = (id = 1) => ({
        id,
        project_name: `projectName${id}`,
        company_name: `companyName${id}`
      });

      it("normal case", async () => {
        const projectList = [project()];
        const resultMessage =
          "Projects with id(s) 1 has been inspected for market undefined.";
        query
          .mockImplementationOnce(() => jest.fn())
          .mockImplementationOnce(() => ({ rows: projectList }))
          .mockImplementationOnce(() => ({ rows: projectList }));

        const result = await annualProjectsInspection(
          resolve,
          source,
          args,
          context,
          resolveInfo
        );

        expect(result).toBe(resultMessage);

        expect(query).toHaveBeenNthCalledWith(
          1,
          "SAVEPOINT graphql_annual_inspection_mutation"
        );
        expect(query).toHaveBeenNthCalledWith(
          4,
          "RELEASE SAVEPOINT graphql_annual_inspection_mutation"
        );
        expect(loggerInfo).toHaveBeenCalledWith(resultMessage);
        expect(sendMailToMarketAdmins).toHaveBeenCalledWith(
          context,
          "ANNUAL_INSPECTION1",
          {
            project: `${projectList[0].project_name}`,
            company: `${projectList[0].company_name}`
          }
        );
      });

      it("Multiple projects being inspected", async () => {
        const projectList = [project(), project(2)];
        const resultMessage =
          "Projects with id(s) 1,2 has been inspected for market undefined.";
        query
          .mockImplementationOnce(() => jest.fn())
          .mockImplementationOnce(() => ({
            rows: projectList
          }))
          .mockImplementationOnce(() => ({ rows: projectList }));

        const result = await annualProjectsInspection(
          resolve,
          source,
          args,
          context,
          resolveInfo
        );

        expect(result).toBe(resultMessage);

        expect(query).toHaveBeenNthCalledWith(
          1,
          "SAVEPOINT graphql_annual_inspection_mutation"
        );
        expect(query).toHaveBeenNthCalledWith(
          4,
          "RELEASE SAVEPOINT graphql_annual_inspection_mutation"
        );
        expect(loggerInfo).toHaveBeenCalledWith(resultMessage);
        expect(sendMailToMarketAdmins).toHaveBeenNthCalledWith(
          1,
          context,
          "ANNUAL_INSPECTION1",
          {
            project: `${projectList[0].project_name}`,
            company: `${projectList[0].company_name}`
          }
        );
        expect(sendMailToMarketAdmins).toHaveBeenNthCalledWith(
          2,
          context,
          "ANNUAL_INSPECTION1",
          {
            project: `${projectList[1].project_name}`,
            company: `${projectList[1].company_name}`
          }
        );
      });

      it("show logger info when no project to be inspected", async () => {
        query
          .mockImplementationOnce(() => jest.fn())
          .mockImplementationOnce(() => ({ rows: [] }))
          .mockImplementationOnce(() => ({ rows: [] }));
        await annualProjectsInspection(
          resolve,
          source,
          args,
          context,
          resolveInfo
        );

        expect(loggerInfo).toHaveBeenCalledWith(
          "No projects to be inspected for market undefined."
        );
        expect(sendMailToMarketAdmins).not.toBeCalled();
      });

      it("throw error when failed to update DB", async () => {
        const errorObject = new Error("error");
        query
          .mockImplementationOnce(() => jest.fn())
          .mockRejectedValueOnce(errorObject);
        try {
          await annualProjectsInspection(
            resolve,
            source,
            args,
            context,
            resolveInfo
          );
        } catch (err) {
          expect(err).toBe(errorObject);
        }
        expect(loggerError).toHaveBeenCalledWith(
          "Failed to perform annual inspection"
        );
        expect(query).toHaveBeenCalledWith(
          "ROLLBACK TO SAVEPOINT graphql_annual_inspection_mutation"
        );
      });
    });
  });
});
