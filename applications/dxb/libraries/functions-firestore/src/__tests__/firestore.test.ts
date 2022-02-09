const mockInitializeApp = jest.fn();
jest.mock("firebase-admin/app", () => {
  return {
    initializeApp: (...args: any[]) => {
      return mockInitializeApp(...args);
    }
  };
});

const mockGetFirestore = jest.fn();
jest.mock("firebase-admin/firestore", () => {
  return {
    getFirestore: (...args: any[]) => {
      return mockGetFirestore(...args);
    }
  };
});

beforeEach(() => {
  delete process.env.GCP_PROJECT_ID;
  process.env.GCP_PROJECT_ID = "gcp-project-id";

  jest.clearAllMocks();
  jest.resetModules();
});

const getFirestore = async () => (await import("..")).getFirestore();

describe("getFirestore", () => {
  it("should error if GCP_PROJECT_ID is not set", async () => {
    delete process.env.GCP_PROJECT_ID;

    try {
      await getFirestore();
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual(
        "GCP_PROJECT_ID was not provided"
      );
    }

    expect(mockInitializeApp).toBeCalledTimes(0);
    expect(mockGetFirestore).toBeCalledTimes(0);
  });

  it("should return the Firestore instance", async () => {
    const app = {};
    mockInitializeApp.mockReturnValue(app);
    const firestore = {};
    mockGetFirestore.mockReturnValue(firestore);

    await getFirestore();

    expect(mockInitializeApp).toBeCalledWith({
      databaseURL: `https://${process.env.GCP_PROJECT_ID}.firebaseio.com`
    });
    expect(mockGetFirestore).toBeCalledWith(app);
  });

  it("should only create a new client once if called multiple times", async () => {
    const app = {};
    mockInitializeApp.mockReturnValue(app);
    const firestore = {};
    mockGetFirestore.mockReturnValue(firestore);

    await getFirestore();
    await getFirestore();

    expect(mockInitializeApp).toBeCalledTimes(1);
    expect(mockInitializeApp).toBeCalledWith({
      databaseURL: `https://${process.env.GCP_PROJECT_ID}.firebaseio.com`
    });
    expect(mockGetFirestore).toBeCalledTimes(1);
    expect(mockGetFirestore).toBeCalledWith(app);
  });
});
