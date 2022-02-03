import firebase from "firebase-admin";
import report from "gatsby-cli/lib/reporter";
import { sourceNodes } from "../gatsby-node";

describe("getsby plugin firestore", () => {
  jest.spyOn(firebase, "initializeApp").mockImplementation();
  const settingsFn = jest.fn();
  const collectionFn = jest.fn();
  const collectionGetFn = jest.fn();
  const collectionGetDataFn = jest.fn();
  jest.spyOn(firebase, "firestore").mockReturnValue({
    settings: settingsFn,
    collection: collectionFn.mockReturnValue({
      get: collectionGetFn.mockReturnValue({
        docs: [{ data: collectionGetDataFn }]
      })
    }),
    doc: jest.fn(),
    collectionGroup: jest.fn(),
    getAll: jest.fn(),
    recursiveDelete: jest.fn(),
    terminate: jest.fn(),
    listCollections: jest.fn(),
    runTransaction: jest.fn(),
    batch: jest.fn(),
    bulkWriter: jest.fn(),
    bundle: jest.fn()
  } as FirebaseFirestore.Firestore);
  jest.spyOn(report, "warn").mockImplementation();
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should initialize firestore app and call all functions without errors", async () => {
    const createContentDigestFn = jest.fn();
    const createNodeFn = jest.fn();
    await sourceNodes(
      {
        createContentDigest: createContentDigestFn,
        actions: {
          createNode: createNodeFn
        }
      },
      {
        types: [
          {
            type: "Products",
            collection: `${process.env.FIRESTORE_ROOT_COLLECTION}/root/products`,
            map: (doc) => ({
              ...doc
            })
          },
          {}
        ],
        appConfig: {}
      }
    );

    expect(firebase.initializeApp).toHaveBeenCalled();
    expect(settingsFn).toHaveBeenCalledWith({
      timestampsInSnapshots: true
    });
    expect(createContentDigestFn).toHaveBeenCalled();
    expect(createNodeFn).toHaveBeenCalled();
    expect(collectionFn).toHaveBeenCalled();
    expect(collectionGetFn).toHaveBeenCalled();
    expect(collectionGetDataFn).toHaveBeenCalled();
  });
  it("should catch an error if no appConfig provided", async () => {
    await sourceNodes(
      {
        createContentDigest: jest.fn(),
        actions: {
          createNode: jest.fn()
        }
      },
      {
        types: [
          {
            type: "Products",
            collection: `${process.env.FIRESTORE_ROOT_COLLECTION}/root/products`,
            map: (doc) => ({
              ...doc
            })
          }
        ]
      }
    );

    expect(report.warn).toHaveBeenCalledWith(
      "Could not initialize Firebase. Please check `credential` property in gatsby-config.js"
    );
  });
  it("should not call initializeApp if the apps array not empty", async () => {
    jest.spyOn(firebase, "apps", "get").mockReturnValue([null]);
    await sourceNodes(
      {
        createContentDigest: jest.fn(),
        actions: {
          createNode: jest.fn()
        }
      },
      {
        types: [],
        appConfig: {}
      }
    );

    expect(firebase.initializeApp).not.toHaveBeenCalled();
  });
});
