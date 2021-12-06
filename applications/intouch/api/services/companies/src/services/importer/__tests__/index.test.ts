import * as importer from "..";

const companies = [
  {
    migration_id: "YQPQKK_NOCO_0003",
    name: "Company Name LTD - 1",
    tier: "T4",
    tax_number: "925637149",
    about_us: "",
    logo: "",
    phone: "",
    public_email: "",
    registered_address_migration_id: "YQPQKK_NOAD_0003",
    trading_address_migration_id: "",
    website: "",
    linked_in: ""
  },
  {
    migration_id: "YQPQKK_NOCO_0004",
    name: "Company Name LTD - D",
    tier: "T4",
    tax_number: "925637149",
    about_us: "",
    logo: "",
    phone: "",
    public_email: "",
    registered_address_migration_id: "Empty",
    trading_address_migration_id: "empty",
    website: "",
    linked_in: ""
  }
];
const accounts = [
  {
    migration_id: "YQPQKK_NO_0003",
    email: "companyAdmin@digitaldetox.co.uk",
    role: "COMPANY_ADMIN",
    first_name: "Name 1",
    last_name: "Surname 1",
    phone: "",
    docebo_id: "",
    docebo_username: "",
    password: "Passsword1@",
    status: "ACTIVE"
  },
  {
    migration_id: "YQPQKK_NO_0004",
    email: "installer@digitaldetox.co.uk",
    role: "INSTALLER",
    first_name: "Name 123",
    last_name: "Surname 123",
    phone: "",
    docebo_id: "",
    docebo_username: "",
    password: "Passsword1@",
    status: "ACTIVE"
  },
  {
    migration_id: "YQPQKK_NO_0005",
    email: "superadmin@digitaldetox.co.uk",
    role: "SUPER_ADMIN",
    first_name: "Name 123",
    last_name: "Surname 123",
    phone: "",
    docebo_id: "",
    docebo_username: "",
    password: "Passsword1@",
    status: "ACTIVE"
  },
  {
    migration_id: "YQPQKK_NO_0006",
    email: "marketadmin@digitaldetox.co.uk",
    role: "MARKET_ADMIN",
    first_name: "Name 123",
    last_name: "Surname 123",
    phone: "",
    docebo_id: "",
    docebo_username: "",
    password: "Passsword1@",
    status: "ACTIVE"
  },
  {
    migration_id: "YQPQKK_NO_0007",
    email: "installer-1@digitaldetox.co.uk",
    role: "INSTALLER",
    first_name: "Name 123",
    last_name: "Surname 123",
    phone: "",
    docebo_id: "",
    docebo_username: "",
    password: "Passsword1@",
    status: "ACTIVE"
  }
];
const addresses = [
  {
    migration_id: "YQPQKK_NOAD_0003",
    first_line: "First Line 1",
    second_line: "",
    town: "Town 1",
    region: "",
    country: "Norge",
    postcode: "",
    coordinates: "1,2"
  }
];
const owners = [
  {
    migration_id: "YQPQKK_NO_0003",
    fullname: "Dev 1",
    email: "francescov+1232134235@digitaldetox.co.uk",
    phone: "11111"
  }
];
const members = [
  {
    company_migration_id: "YQPQKK_NOCO_0003",
    account_migration_id: "YQPQKK_NO_0003"
  },
  {
    company_migration_id: "YQPQKK_NOCO_0003",
    account_migration_id: "YQPQKK_NO_0004"
  },
  {
    company_migration_id: "YQPQKK_NOCO_0004",
    account_migration_id: "YQPQKK_NO_0007"
  }
];

jest.mock("crypto", () => {
  const original = jest.requireActual("crypto");
  return {
    ...original,
    genSalt: () => "salt",
    hash: () => "password"
  };
});

const mockAuth0ImportUserFromJson = jest.fn();

describe("Account importer", () => {
  let context: any;

  const mockQuery = jest.fn();
  const auth0 = {
    importUserFromJson: mockAuth0ImportUserFromJson
  };

  beforeEach(() => {
    context = {
      pgRootPool: {
        connect: () => ({
          release: jest.fn(),
          query: mockQuery
        }),
        query: mockQuery
      },
      user: {
        can: () => true
      },
      logger: () => ({
        info: (message) => {},
        error: (message) => {}
      })
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it("should not import if dry-run", async () => {
    const args = {
      input: {
        dryRun: true,
        files: Promise.resolve([
          Promise.resolve({ filename: "no-companies.csv" }),
          Promise.resolve({ filename: "no-addresses.csv" }),
          Promise.resolve({ filename: "no-owners.csv" }),
          Promise.resolve({ filename: "no-members.csv" }),
          Promise.resolve({ filename: "no-accounts.csv" })
        ])
      }
    };

    jest
      .spyOn(importer, "singleImport")
      .mockReturnValueOnce(Promise.resolve(companies))
      .mockReturnValueOnce(Promise.resolve(addresses))
      .mockReturnValueOnce(Promise.resolve(owners))
      .mockReturnValueOnce(Promise.resolve(members))
      .mockReturnValueOnce(Promise.resolve(accounts));

    const result = await importer.importAccountsCompaniesFromCVS(
      {},
      args,
      context,
      { graphile: { build: { pgSql: jest.fn() } } },
      auth0
    );

    expect(result).toMatchSnapshot();
    expect(mockQuery.mock.calls.length).toEqual(0);
  });

  it("should import correctly with companies", async () => {
    const args = {
      input: {
        dryRun: false,
        files: Promise.resolve([
          Promise.resolve({ filename: "no-companies.csv" }),
          Promise.resolve({ filename: "no-addresses.csv" }),
          Promise.resolve({ filename: "no-owners.csv" }),
          Promise.resolve({ filename: "no-members.csv" }),
          Promise.resolve({ filename: "no-accounts.csv" })
        ])
      }
    };

    mockQuery.mockReturnValueOnce({ rows: [{ id: 1 }] });

    jest
      .spyOn(importer, "singleImport")
      .mockReturnValueOnce(Promise.resolve(companies))
      .mockReturnValueOnce(Promise.resolve(addresses))
      .mockReturnValueOnce(Promise.resolve(owners))
      .mockReturnValueOnce(Promise.resolve(members))
      .mockReturnValueOnce(Promise.resolve(accounts));

    await importer.importAccountsCompaniesFromCVS(
      {},
      args,
      context,
      { graphile: { build: { pgSql: jest.fn() } } },
      auth0
    );

    expect(mockQuery.mock.calls).toMatchSnapshot();
  });

  it("should import correctly only accounts", async () => {
    const args = {
      input: {
        dryRun: false,
        files: Promise.resolve([
          Promise.resolve({ filename: "no-accounts.csv" })
        ])
      }
    };

    mockQuery.mockReturnValueOnce({ rows: [{ id: 1 }] });

    jest
      .spyOn(importer, "singleImport")
      .mockReturnValueOnce(Promise.resolve(accounts));

    await importer.importAccountsCompaniesFromCVS(
      {},
      args,
      context,
      { graphile: { build: { pgSql: jest.fn() } } },
      auth0
    );

    expect(mockQuery.mock.calls).toMatchSnapshot();
  });
});
