import { Entry, Space } from "contentful-management";
import SampleMemberships from "./resources/sample_memberships.json";
import SampleRole1 from "./resources/sample_role_1.json";
import SampleRole2 from "./resources/sample_role_2.json";

const findOwner = async (entry: Partial<Entry>) =>
  (await import("../membership")).findOwner(entry as Entry);

const findMembership = async (userId: string, space: Partial<Space>) =>
  (await import("../membership")).findMembership(space as Space, userId);

const findMarketRole = async (roleIds: string[], space: Partial<Space>) =>
  (await import("../membership")).findMarketRole(roleIds, space as Space);

const getMarketName = async (roleName: string) =>
  (await import("../membership")).getMarketName(roleName);

const mockEntry = (): Partial<Entry> => {
  const entry: Partial<Entry> = {};
  entry.sys = {
    space: {
      sys: {
        type: "Link",
        linkType: "Space",
        id: "zxcv123"
      }
    },
    id: "12345qwerty",
    type: "Entry",
    createdAt: "2022-05-05T13:57:20.748Z",
    updatedAt: "2022-05-05T13:57:20.748Z",
    environment: {
      sys: {
        id: "master",
        type: "Link",
        linkType: "Environment"
      }
    },
    createdBy: {
      sys: {
        type: "Link",
        linkType: "User",
        id: "9876asdfg"
      }
    },
    updatedBy: {
      sys: {
        type: "Link",
        linkType: "User",
        id: "9876asdfg"
      }
    },
    publishedCounter: 0,
    version: 1,
    contentType: {
      sys: {
        type: "Link",
        linkType: "ContentType",
        id: "titleWithContent"
      }
    }
  };
  return entry;
};

const mockEntryWithoutOwner = (): Partial<Entry> => {
  const entry: Partial<Entry> = {};
  entry.sys = {
    space: {
      sys: {
        type: "Link",
        linkType: "Space",
        id: "zxcv123"
      }
    },
    id: "12345qwerty",
    type: "Entry",
    createdAt: "2022-05-05T13:57:20.748Z",
    updatedAt: "2022-05-05T13:57:20.748Z",
    environment: {
      sys: {
        id: "master",
        type: "Link",
        linkType: "Environment"
      }
    },
    updatedBy: {
      sys: {
        type: "Link",
        linkType: "User",
        id: "9876asdfg"
      }
    },
    publishedCounter: 0,
    version: 1,
    contentType: {
      sys: {
        type: "Link",
        linkType: "ContentType",
        id: "titleWithContent"
      }
    }
  };
  return entry;
};

const mockSpace = (): Partial<Space> => {
  const space: Partial<Space> = {};
  space.getSpaceMemberships = jest.fn().mockReturnValue(SampleMemberships);
  space.getRole = jest
    .fn()
    .mockResolvedValueOnce(SampleRole1)
    .mockResolvedValueOnce(SampleRole2);
  return space;
};

describe("Find Owner", () => {
  it("Returns the owner if found", async () => {
    const owenr = "9876asdfg";
    const entry = mockEntry();
    const result = await findOwner(entry);

    expect(result).toEqual(owenr);
  });

  it("Returns undefined if owner is not found", async () => {
    const entry = mockEntryWithoutOwner();
    const result = await findOwner(entry);

    expect(result).toEqual(undefined);
  });
});

describe("Find Membership", () => {
  it("Returns userId if found", async () => {
    const userId = "80ksve68gyd04zcaekmb0p";
    const space = mockSpace();
    const membership = {
      admin: false,
      sys: {
        type: "SpaceMembership",
        id: "ebkqzk2aof8ig15b4o83la",
        version: 0,
        space: {
          sys: {
            type: "Link",
            linkType: "Space",
            id: "qwer123"
          }
        },
        user: {
          sys: {
            type: "Link",
            linkType: "User",
            id: "80ksve68gyd04zcaekmb0p"
          }
        },
        createdBy: {
          sys: {
            type: "Link",
            linkType: "User",
            id: "5wi3ino83n10ep83onmoor"
          }
        },
        createdAt: "2021-07-01T13:08:11Z",
        updatedBy: {
          sys: {
            type: "Link",
            linkType: "User",
            id: "5wi3ino83n10ep83onmoor"
          }
        },
        updatedAt: "2021-07-01T13:08:11Z",
        organization: {
          sys: {
            type: "Link",
            linkType: "Organization",
            id: "jhofoqkp5nq180qahtyvaz"
          }
        }
      },
      user: {
        sys: {
          type: "Link",
          linkType: "User",
          id: "80ksve68gyd04zcaekmb0p"
        }
      },
      roles: [
        {
          sys: {
            type: "Link",
            linkType: "Role",
            id: "v2rk4n18zk1r3kuasni89z"
          }
        },
        {
          sys: {
            type: "Link",
            linkType: "Role",
            id: "itnhmecacrm4ihfh4axrqw"
          }
        }
      ]
    };

    const result = await findMembership(userId, space);

    expect(result).toStrictEqual(membership);
  });

  it("returns undefined if membership not found", async () => {
    const userId = "non-existent-user";
    const space = mockSpace();

    const result = await findMembership(userId, space);

    expect(result).toEqual(undefined);
  });
});

describe("Find Market Role", () => {
  it("Returns the DXB market role", async () => {
    const roleIds = ["h81mua6xtni601ippd030l", "x6ua7serqh5foeepraczbu"];
    const space = mockSpace();

    const result = await findMarketRole(roleIds, space);

    expect(result).toStrictEqual(SampleRole2);
  });

  it("Returns undefined if DXB market role is not found", async () => {
    const roleIds = ["h81mua6xtni601ippd030l"];
    const space = mockSpace();

    const result = await findMarketRole(roleIds, space);

    expect(result).toStrictEqual(undefined);
  });
});

describe("Get Market Name", () => {
  it("Extracts the market name from the role name", async () => {
    const roleName = "DXB - Norway";
    const marketName = "Norway";

    const result = await getMarketName(roleName);

    expect(result).toEqual(marketName);
  });

  it("Extracts the market name from role name when there multiple words", async () => {
    const roleName = "DXB - South Africa";
    const marketName = "South Africa";

    const result = await getMarketName(roleName);

    expect(result).toEqual(marketName);
  });

  it("Returns undefined when market name could not be extraced", async () => {
    const roleName = "Author";

    const result = await getMarketName(roleName);

    expect(result).toEqual(undefined);
  });
});
