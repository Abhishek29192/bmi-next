import { sub, format } from "date-fns";
import { updateProject, archiveProjects } from "../mutations";

describe("Project", () => {
  const resolve = jest.fn();
  const source = {};
  let args;
  let context;
  const resolveInfo = {};
  const query = jest.fn();
  const loggerInfo = jest.fn();
  const loggerError = jest.fn();

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
      it("normal case", async () => {
        const dateToCompare = format(
          sub(new Date(), { days: 100 }),
          "yyyy-MM-dd"
        );
        query
          .mockImplementationOnce(() => jest.fn())
          .mockImplementationOnce(() => ({ rows: [{ id: 1 }] }))
          .mockImplementationOnce(() => ({ rows: [{ id: 1 }] }));
        const result = await archiveProjects(
          resolve,
          source,
          args,
          context,
          resolveInfo
        );

        expect(result).toBe("ok");
        expect(query).toHaveBeenNthCalledWith(
          1,
          "SAVEPOINT graphql_archive_projects_mutation"
        );
        expect(query).toHaveBeenNthCalledWith(
          2,
          `SELECT project.id FROM project LEFT JOIN guarantee ON guarantee.project_id = project.id WHERE guarantee.project_id IS NULL AND project.end_date < $1 AND project.hidden = false`,
          [dateToCompare]
        );
        expect(query).toHaveBeenNthCalledWith(
          3,
          `UPDATE project SET hidden = true WHERE id IN ($1) RETURNING id`,
          [1]
        );
        expect(query).toHaveBeenNthCalledWith(
          4,
          "RELEASE SAVEPOINT graphql_archive_projects_mutation"
        );
        expect(loggerInfo).toHaveBeenCalledWith(
          `Projects with id(s) 1 has be archived.`
        );
      });

      it("show logger info when no project to archive", async () => {
        query
          .mockImplementationOnce(() => jest.fn())
          .mockImplementationOnce(() => ({ rows: [] }));
        await archiveProjects(resolve, source, args, context, resolveInfo);

        expect(loggerInfo).toHaveBeenCalledWith("No projects to be archived.");
      });

      it("throw error when failed to update DB", async () => {
        const errorObject = new Error("error");
        query
          .mockImplementationOnce(() => jest.fn())
          .mockImplementationOnce(() => ({ rows: [{ id: 1 }] }))
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
  });
});
