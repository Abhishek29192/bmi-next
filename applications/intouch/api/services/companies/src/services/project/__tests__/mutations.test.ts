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
  });
});
