import { updateProject } from "../mutations";

describe("Project", () => {
  const resolve = jest.fn();
  const source = {};
  let args;
  let context;
  const resolveInfo = {};
  const query = jest.fn();

  beforeEach(() => {
    context = {
      pubSub: {},
      logger: () => ({ info: jest.fn(), error: jest.fn() }),
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
  });
});
