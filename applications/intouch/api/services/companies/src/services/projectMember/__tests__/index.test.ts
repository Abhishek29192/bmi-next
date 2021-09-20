import { UpdateProjectMemberInput } from "@bmi/intouch-api-types";
import { updateProjectMember } from "..";

describe("ProjectMember", () => {
  const mockQuery = jest.fn();
  const context: any = {
    pubSub: {},
    logger: jest.fn().mockReturnValue({
      debug: jest.fn(),
      log: jest.fn(),
      error: jest.fn()
    }),
    pgRootPool: null,
    pgClient: {
      query: mockQuery
    },
    user: {
      id: 3,
      company: {
        id: 1
      },
      can: jest.fn()
    }
  };
  const resolve = jest.fn();
  const source = {};
  const args: {
    input: UpdateProjectMemberInput;
  } = {
    input: {
      id: 1,
      patch: {
        isResponsibleInstaller: true
      }
    }
  };
  const resolveInfo = {};

  it("shouldn't be able to update project when user unauthorised", async () => {
    context.user.can = () => false;

    await expect(
      updateProjectMember(resolve, source, args, context, resolveInfo)
    ).rejects.toThrow("unauthorized");
  });
  it("should update the responsible installer", async () => {
    context.user.can = () => true;

    mockQuery
      .mockImplementationOnce(() => {})
      .mockImplementationOnce(() => ({
        rows: []
      }));

    await updateProjectMember(resolve, source, args, context, resolveInfo);

    expect(resolve).toBeCalled();
  });
  it("should not update the responsible installer if the guarantee is not submitted", async () => {
    context.user.can = () => true;

    mockQuery
      .mockImplementationOnce(() => {})
      .mockImplementationOnce(() => ({
        rows: [{}]
      }));

    await expect(
      updateProjectMember(resolve, source, args, context, resolveInfo)
    ).rejects.toThrow("The guarantee status must be NEW or REJECTED");
  });
});
