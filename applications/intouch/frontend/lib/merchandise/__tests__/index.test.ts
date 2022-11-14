import Merchandise, { mutationPerformMerchandiseSso } from "../";

describe("Merchandise", () => {
  let merchandiseSrv;

  const mockQuery = jest.fn();
  const mockMutate = jest.fn();
  const session = {
    user: {
      email: "emamil@email.com"
    }
  };
  const logger = () => ({
    info: () => {},
    error: () => {}
  });
  const apolloClient = {
    query: mockQuery,
    mutate: mockMutate
  };

  beforeEach(() => {
    merchandiseSrv = new Merchandise(logger, apolloClient, session);
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("should send the PerformMerchandiseSso mutation with the right values", async () => {
    mockMutate.mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          performMerchandiseSso: "url"
        }
      })
    );
    await merchandiseSrv.completeMerchandiseSso();
    expect(mockMutate).toHaveBeenCalledWith({
      mutation: mutationPerformMerchandiseSso,
      variables: {
        email: "emamil@email.com"
      }
    });
  });

  it("PerformMerchandiseSso exception", async () => {
    const error = { errorMessage: "error" };
    mockMutate.mockRejectedValueOnce(error);
    try {
      await merchandiseSrv.completeMerchandiseSso();
    } catch (error) {
      expect(error.errorMessage).toEqual("error");
    }
  });
});
