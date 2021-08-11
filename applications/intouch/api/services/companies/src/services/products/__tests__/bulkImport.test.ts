import * as importer from "../bulkImport";

describe("Bulk importer", () => {
  let context: any = {
    pgClient: {
      query: jest.fn()
    },
    logger: () => ({
      info: (message) => {},
      error: (message) => {}
    })
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("shouldn't import the products if no env or market", async () => {
    const args = {
      input: {
        files: Promise.resolve([
          Promise.resolve({
            filename: "dev-products"
          }),
          Promise.resolve({
            filename: "dev"
          })
        ])
      }
    };

    try {
      await importer.bulkImport(args, context);
    } catch (error) {
      expect(error.message).toEqual("the filename has a wrong format");
    }
  });

  it("shouldn't import the products if wrong market", async () => {
    const args = {
      input: {
        files: Promise.resolve([
          Promise.resolve({
            filename: "dev-es-products"
          }),
          Promise.resolve({
            filename: "dev-en-systems"
          })
        ])
      }
    };

    context.pgClient.query.mockReturnValueOnce({
      rows: []
    });

    try {
      await importer.bulkImport(args, context);
    } catch (error) {
      expect(error.message).toEqual("the market doesn't exists");
    }
  });

  it("shouldn't import if dry run", async () => {
    const args = {
      input: {
        dryRun: true,
        files: Promise.resolve([
          Promise.resolve({ filename: "dev-en-systems.csv" }),
          Promise.resolve({ filename: "dev-en-products.csv" })
        ])
      }
    };

    context.pgClient.query
      .mockReturnValueOnce({ rows: [{ id: 1 }] }) // market
      .mockReturnValueOnce({ rows: [{ bmi_ref: "12" }] }) // system
      .mockReturnValueOnce({ rows: [{ id: 1 }] }) // market
      .mockReturnValueOnce({ rows: [{ bmi_ref: "21" }] }); // product

    jest
      .spyOn(importer, "singleImport")
      .mockReturnValueOnce(
        Promise.resolve([{ bmi_ref: "12" }, { bmi_ref: "123" }]) // system
      )
      .mockReturnValueOnce(
        Promise.resolve([{ bmi_ref: "21" }, { bmi_ref: "321" }]) // products
      );

    const result = await importer.bulkImport(args, context);

    expect(context.pgClient.query.mock.calls.length).toEqual(4);

    expect(result).toEqual({
      systemsToUpdate: [{ bmiRef: "12" }],
      systemsToInsert: [{ bmiRef: "123" }],
      productsToUpdate: [{ bmiRef: "21" }],
      productsToInsert: [{ bmiRef: "321" }]
    });
  });

  it("should import if not dry run", async () => {
    const args = {
      input: {
        dryRun: false,
        files: Promise.resolve([
          Promise.resolve({ filename: "dev-en-systems.csv" }),
          Promise.resolve({ filename: "dev-en-products.csv" }),
          Promise.resolve({ filename: "dev-en-system_member.csv" })
        ])
      }
    };

    context.pgClient.query
      .mockReturnValueOnce({ rows: [{ id: 1 }] }) // market
      .mockReturnValueOnce({ rows: [{ bmi_ref: "12" }] }) // system
      .mockReturnValueOnce({ rows: [{ id: 1 }] }) // market
      .mockReturnValueOnce({ rows: [{ bmi_ref: "21" }] })
      .mockReturnValueOnce({ rows: [{ id: 1 }] }) // market
      .mockReturnValueOnce({ rows: [] })
      .mockReturnValueOnce({ rows: [] })
      .mockReturnValueOnce({ rows: [] })
      .mockReturnValueOnce({ rows: [] })
      .mockReturnValueOnce({ rows: [] }); // product

    jest
      .spyOn(importer, "singleImport")
      .mockReturnValueOnce(
        Promise.resolve([{ bmi_ref: "12" }, { bmi_ref: "123" }]) // system
      )
      .mockReturnValueOnce(
        Promise.resolve([{ bmi_ref: "12" }, { bmi_ref: "123" }]) // system
      )
      .mockReturnValueOnce(
        Promise.resolve([{ bmi_ref: "21" }, { bmi_ref: "321" }]) // products
      );

    await importer.bulkImport(args, context);

    expect(context.pgClient.query.mock.calls.length).toEqual(10);
  });

  it("should rollback if a query fail", async () => {
    const args = {
      input: {
        dryRun: false,
        files: Promise.resolve([
          Promise.resolve({ filename: "dev-en-systems.csv" }),
          Promise.resolve({ filename: "dev-en-products.csv" }),
          Promise.resolve({ filename: "dev-en-system_member.csv" })
        ])
      }
    };

    context.pgClient.query
      .mockReturnValueOnce({ rows: [{ id: 1 }] }) // market
      .mockReturnValueOnce({ rows: [{ bmi_ref: "12" }] }) // system
      .mockReturnValueOnce({ rows: [{ id: 1 }] }) // market
      .mockReturnValueOnce({ rows: [{ bmi_ref: "21" }] })
      .mockReturnValueOnce({ rows: [{ id: 1 }] }) // market
      .mockReturnValueOnce({ rows: [] })
      .mockRejectedValueOnce({ message: "Error message" })
      .mockReturnValueOnce({ rows: [] }); // product

    jest
      .spyOn(importer, "singleImport")
      .mockReturnValueOnce(
        Promise.resolve([{ bmi_ref: "12" }, { bmi_ref: "123" }]) // system
      )
      .mockReturnValueOnce(
        Promise.resolve([{ bmi_ref: "12" }, { bmi_ref: "123" }]) // system
      )
      .mockReturnValueOnce(
        Promise.resolve([{ bmi_ref: "21" }, { bmi_ref: "321" }]) // products
      );

    try {
      await importer.bulkImport(args, context);
    } catch (error) {
      expect(context.pgClient.query.mock.calls[5]).toEqual([
        "SAVEPOINT graphql_mutation"
      ]);
      expect(context.pgClient.query.mock.calls[7]).toEqual([
        "ROLLBACK TO SAVEPOINT graphql_mutation"
      ]);
    }
  });
});
