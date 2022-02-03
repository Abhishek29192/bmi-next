import mockConsole from "jest-mock-console";
import { FirestoreCollections } from "../firestoreCollections";

const initializeApp = jest.fn();
const collection = jest.fn();
const batch = jest.fn();
const collectionRefLimit = jest.fn();
const collectionRefOrderBy = jest.fn();
const queryGet = jest.fn();
const batchDelete = jest.fn();
const commit = jest.fn();
jest.mock("firebase-admin", () => ({
  initializeApp: (...args: any) => initializeApp(...args),
  firestore: () => ({
    collection: (...args: any) => collection(...args),
    batch: () => batch()
  })
}));

const deleteFirestoreCollection = async (
  firestoreCollection: FirestoreCollections
) =>
  (await import("../firestore")).deleteFirestoreCollection(firestoreCollection);

beforeAll(() => {
  mockConsole();
});

beforeEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
  commit.mockResolvedValue({});
  batch.mockReturnValue({
    commit: () => commit(),
    delete: (...args: any) => batchDelete(...args)
  });
  queryGet
    .mockResolvedValueOnce({
      size: 20,
      docs: [...Array(20)].map(() => ({
        ref: "a"
      }))
    })
    .mockResolvedValueOnce({
      size: 0
    });
  collectionRefLimit.mockReturnValue({
    get: () => queryGet()
  });
  collectionRefOrderBy.mockReturnValue({
    limit: (...args: any) => collectionRefLimit(...args)
  });
  collection.mockReturnValue({
    orderBy: (...args: any) => collectionRefOrderBy(...args)
  });
});

describe("deleteFirestoreCollection", () => {
  it("should error if getting collection throws error", async () => {
    collection.mockReset();
    collection.mockImplementation(() => {
      throw Error("Expected error");
    });

    try {
      await deleteFirestoreCollection(FirestoreCollections.Products);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(collection).toHaveBeenCalledWith(
      `${process.env.FIRESTORE_ROOT_COLLECTION}/${FirestoreCollections.Products}`
    );
    expect(collectionRefOrderBy).not.toHaveBeenCalled();
    expect(collectionRefLimit).not.toHaveBeenCalled();
    expect(queryGet).not.toHaveBeenCalled();
    expect(batchDelete).not.toHaveBeenCalled();
    expect(commit).not.toHaveBeenCalled();
  });

  it("should error if getting collection snapshot throws error", async () => {
    queryGet.mockReset();
    queryGet.mockRejectedValue(Error("Expected error"));

    try {
      await deleteFirestoreCollection(FirestoreCollections.Products);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(collection).toHaveBeenCalledWith(
      `${process.env.FIRESTORE_ROOT_COLLECTION}/${FirestoreCollections.Products}`
    );
    expect(collectionRefOrderBy).toHaveBeenCalledWith("__name__");
    expect(collectionRefLimit).toHaveBeenCalledWith(20);
    expect(queryGet).toHaveBeenCalledTimes(1);
    expect(batchDelete).not.toHaveBeenCalled();
    expect(commit).not.toHaveBeenCalled();
  });

  it("should do nothing with collection if size is 0", async () => {
    queryGet.mockReset();
    queryGet.mockResolvedValue({ size: 0 });

    await deleteFirestoreCollection(FirestoreCollections.Products);

    expect(collection).toHaveBeenCalledWith(
      `${process.env.FIRESTORE_ROOT_COLLECTION}/${FirestoreCollections.Products}`
    );
    expect(collectionRefOrderBy).toHaveBeenCalledWith("__name__");
    expect(collectionRefLimit).toHaveBeenCalledWith(20);
    expect(queryGet).toHaveBeenCalledTimes(1);
    expect(batchDelete).not.toHaveBeenCalled();
    expect(commit).not.toHaveBeenCalled();
  });

  it("should error if commiting deletes throws error", async () => {
    commit.mockReset();
    commit.mockRejectedValue(Error("Expected error"));

    try {
      await deleteFirestoreCollection(FirestoreCollections.Products);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toEqual("Expected error");
    }

    expect(collection).toHaveBeenCalledWith(
      `${process.env.FIRESTORE_ROOT_COLLECTION}/${FirestoreCollections.Products}`
    );
    expect(collectionRefOrderBy).toHaveBeenCalledWith("__name__");
    expect(collectionRefLimit).toHaveBeenCalledWith(20);
    expect(queryGet).toHaveBeenCalledTimes(1);
    expect(batchDelete).toHaveBeenCalledTimes(20);
    expect(commit).toHaveBeenCalled();
  });

  it("should return if deleting categories are successful", async () => {
    await deleteFirestoreCollection(FirestoreCollections.Categories);

    expect(collection).toHaveBeenCalledWith(
      `${process.env.FIRESTORE_ROOT_COLLECTION}/${FirestoreCollections.Categories}`
    );
    expect(collectionRefOrderBy).toHaveBeenCalledWith("__name__");
    expect(collectionRefLimit).toHaveBeenCalledWith(20);
    expect(queryGet).toHaveBeenCalledTimes(2);
    expect(batchDelete).toHaveBeenCalledTimes(20);
    expect(commit).toHaveBeenCalled();
  });

  it("should return if deleting products are successful", async () => {
    await deleteFirestoreCollection(FirestoreCollections.Products);

    expect(collection).toHaveBeenCalledWith(
      `${process.env.FIRESTORE_ROOT_COLLECTION}/${FirestoreCollections.Products}`
    );
    expect(collectionRefOrderBy).toHaveBeenCalledWith("__name__");
    expect(collectionRefLimit).toHaveBeenCalledWith(20);
    expect(queryGet).toHaveBeenCalledTimes(2);
    expect(batchDelete).toHaveBeenCalledTimes(20);
    expect(commit).toHaveBeenCalled();
  });

  it("should return if deleting systems are successful", async () => {
    await deleteFirestoreCollection(FirestoreCollections.Systems);

    expect(collection).toHaveBeenCalledWith(
      `${process.env.FIRESTORE_ROOT_COLLECTION}/${FirestoreCollections.Systems}`
    );
    expect(collectionRefOrderBy).toHaveBeenCalledWith("__name__");
    expect(collectionRefLimit).toHaveBeenCalledWith(20);
    expect(queryGet).toHaveBeenCalledTimes(2);
    expect(batchDelete).toHaveBeenCalledTimes(20);
    expect(commit).toHaveBeenCalled();
  });

  it("should iterate over multiple batches", async () => {
    queryGet.mockReset();
    queryGet
      .mockResolvedValueOnce({
        size: 20,
        docs: [...Array(20)].map(() => ({
          ref: "a"
        }))
      })
      .mockResolvedValueOnce({
        size: 20,
        docs: [...Array(20)].map(() => ({
          ref: "a"
        }))
      })
      .mockResolvedValueOnce({
        size: 0
      });

    await deleteFirestoreCollection(FirestoreCollections.Products);

    expect(collection).toHaveBeenCalledWith(
      `${process.env.FIRESTORE_ROOT_COLLECTION}/${FirestoreCollections.Products}`
    );
    expect(collectionRefOrderBy).toHaveBeenCalledWith("__name__");
    expect(collectionRefLimit).toHaveBeenCalledWith(20);
    expect(queryGet).toHaveBeenCalledTimes(3);
    expect(batchDelete).toHaveBeenCalledTimes(40);
    expect(batchDelete).toHaveBeenCalledWith("a");
    expect(commit).toHaveBeenCalled();
  });
});
