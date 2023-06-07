import firebase from "firebase-admin";
import { sourceNodes } from "../gatsby-node";
import type { Actions, SourceNodesArgs } from "gatsby";

const warn = jest.fn();
jest.mock("gatsby-cli/lib/reporter", () => ({
  warn: (text?: string) => warn(text)
}));

describe("gatsby source firestore", () => {
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
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should initialize firestore app and call all functions without errors", async () => {
    const createContentDigestFn = jest.fn();
    const createNodeFn = jest.fn();
    await sourceNodes!(
      {
        createContentDigest: createContentDigestFn,
        actions: {
          createNode: createNodeFn
        } as unknown as Actions
      } as unknown as SourceNodesArgs,
      {
        plugins: [],
        types: [
          {
            type: "Products",
            collection: `${process.env.FIRESTORE_ROOT_COLLECTION}/root/products`,
            map: (doc: object) => ({
              ...doc
            })
          },
          {}
        ],
        appConfig: {}
      },
      () => {
        // no-op
      }
    );

    expect(firebase.initializeApp).toHaveBeenCalled();
    expect(createContentDigestFn).toHaveBeenCalled();
    expect(createNodeFn).toHaveBeenCalled();
    expect(collectionFn).toHaveBeenCalled();
    expect(collectionGetFn).toHaveBeenCalled();
    expect(collectionGetDataFn).toHaveBeenCalled();
  });
  it("should catch an error if no appConfig provided", async () => {
    await sourceNodes!(
      {
        createContentDigest: jest.fn(),
        actions: {
          createNode: jest.fn()
        } as unknown as Actions
      } as unknown as SourceNodesArgs,
      {
        plugins: [],
        types: [
          {
            type: "Products",
            collection: `${process.env.FIRESTORE_ROOT_COLLECTION}/root/products`,
            map: (doc: object) => ({
              ...doc
            })
          }
        ]
      },
      () => {
        // no-op
      }
    );

    expect(warn).toHaveBeenCalledWith(
      "Could not initialize Firebase. Please check `credential` property in gatsby-config.js"
    );
  });
  it("should not call initializeApp if the apps array not empty", async () => {
    jest.spyOn(firebase, "apps", "get").mockReturnValue([null]);
    await sourceNodes!(
      {
        createContentDigest: jest.fn(),
        actions: {
          createNode: jest.fn()
        } as unknown as Actions
      } as unknown as SourceNodesArgs,
      {
        plugins: [],
        types: [],
        appConfig: {}
      },
      () => {
        // no-op
      }
    );

    expect(firebase.initializeApp).not.toHaveBeenCalled();
  });
});
