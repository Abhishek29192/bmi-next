import { RouterContext } from "next/dist/next-server/lib/router-context";
import React from "react";
import Toolkit, {
  getServerSideProps
} from "../../pages/toolkit/[[...mediaParams]]";
import {
  getServerPageGetMediaFolders,
  getServerPageGetMediaFolderContents
} from "../../graphql/generated/page";
import {
  createMockRouter,
  renderWithAllProviders
} from "../../lib/tests/utils";
import { GetGlobalDataQuery } from "../../graphql/generated/operations";
import { generateGlobalPageData } from "../../lib/tests/factories/globalPageData";

jest.mock("../../lib/middleware/withPage", () => ({
  withPage: (fn) => {
    return (ctx) => {
      return fn(ctx);
    };
  }
}));
jest.mock("../../graphql/generated/page", () => ({
  getServerPageGetMediaFolders: jest.fn(),
  getServerPageGetMediaFolderContents: jest.fn()
}));
jest.mock("next-i18next/serverSideTranslations", () => ({
  serverSideTranslations: () => Promise.resolve({})
}));

describe("Team page server side props", () => {
  const globalPageData: GetGlobalDataQuery = generateGlobalPageData();
  let context;
  const mockApolloQuery = jest.fn();

  const account = {
    id: 1,
    market: {
      domain: "en"
    }
  };

  const childrenCollection = {
    items: [
      {
        sys: {
          id: 2
        }
      }
    ]
  };

  const mediaFolderCollection = {
    items: [
      {
        sys: {
          id: 1
        },
        childrenCollection: childrenCollection
      }
    ]
  };

  const marketContentCollection = {
    items: [
      {
        mediaLibraryRootCollection: {
          items: [
            {
              sys: "",
              id: 1
            }
          ]
        }
      }
    ]
  };

  beforeEach(() => {
    context = {
      apolloClient: {
        query: mockApolloQuery
      },
      account: {
        role: "SUPER_ADMIN",
        companyMembers: {
          nodes: [
            {
              id: 1
            }
          ]
        }
      },
      res: {},
      market: {
        id: 1
      },
      locale: {},
      params: {
        mediaParams: ["mediaParam"]
      },
      req: {
        headers: {
          host: "en.local.intouch:3000"
        }
      }
    };
  });

  it("should send list of folders", async () => {
    (getServerPageGetMediaFolders as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        props: {
          account: account,
          data: {
            mediaFolderCollection: mediaFolderCollection,
            marketContentCollection: marketContentCollection
          }
        }
      })
    );

    (getServerPageGetMediaFolderContents as jest.Mock).mockImplementationOnce(
      () =>
        Promise.resolve({
          props: {
            account: account,
            data: {
              mediaFolderCollection: mediaFolderCollection
            }
          }
        })
    );

    const result = await getServerSideProps(context);

    expect(result).toEqual({
      props: {
        mediaFolder: {
          childrenCollection: childrenCollection,
          sys: {
            id: 1
          }
        },
        mediaPath: [],
        mediaTool: null,
        rootFolders: [
          {
            id: 1,
            sys: ""
          }
        ]
      }
    });
  });

  it("folder not found", async () => {
    (getServerPageGetMediaFolders as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        props: {
          account: account,
          data: {
            mediaFolderCollection: mediaFolderCollection,
            marketContentCollection: marketContentCollection
          }
        }
      })
    );

    (getServerPageGetMediaFolderContents as jest.Mock).mockImplementationOnce(
      () =>
        Promise.resolve({
          props: {
            account: account,
            data: {
              mediaFolderCollection: {
                items: []
              }
            }
          }
        })
    );

    const result = await getServerSideProps(context);

    expect(result).toEqual({
      props: {
        _pageError: {
          statusCode: 404,
          title: "Not found"
        }
      }
    });
  });

  it("access denied", async () => {
    context.account.role = "INSTALLER";

    const result = await getServerSideProps(context);

    expect(result).toEqual({
      props: {
        _pageError: {
          statusCode: 401,
          title: "Unauthorised"
        }
      }
    });
  });

  it("show the first root folder by default", async () => {
    context.params.mediaParams = null;

    (getServerPageGetMediaFolders as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        props: {
          account: account,
          data: {
            mediaFolderCollection: mediaFolderCollection,
            marketContentCollection: marketContentCollection
          }
        }
      })
    );

    const result = await getServerSideProps(context);

    expect(result).toEqual({
      redirect: {
        destination: "/toolkit/undefined",
        permanent: false
      }
    });
  });

  it("no rootFolders available", async () => {
    context.params.mediaParams = null;

    (getServerPageGetMediaFolders as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        props: {
          account: account,
          data: {
            mediaFolderCollection: mediaFolderCollection,
            marketContentCollection: {
              items: [
                {
                  mediaLibraryRootCollection: {
                    items: []
                  }
                }
              ]
            }
          }
        }
      })
    );

    const result = await getServerSideProps(context);

    expect(result).toEqual({
      props: {
        mediaFolder: null,
        mediaPath: [],
        rootFolders: []
      }
    });
  });

  it("render correctly", async () => {
    const mediaFolder = {
      childrenCollection: childrenCollection,
      sys: {
        id: 1
      }
    };
    const rootFolders = [
      {
        id: 1,
        sys: ""
      }
    ];
    const mediaPath = [
      {
        sys: {
          id: 1
        }
      }
    ];
    const { container } = renderWithAllProviders(
      <RouterContext.Provider value={createMockRouter({})}>
        <Toolkit
          _pageError={null}
          rootFolders={rootFolders}
          mediaPath={mediaPath}
          activeMediaId={null}
          mediaFolder={mediaFolder}
          globalPageData={globalPageData}
        />
      </RouterContext.Provider>
    );
    expect(container).toMatchSnapshot();
  });
});
