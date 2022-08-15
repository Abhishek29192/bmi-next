import { getServerSideProps } from "../../pages/[contentArticleRelativePath]";

import { withPage } from "../../lib/middleware/withPage";
import { withPublicPage } from "../../lib/middleware/withPublicPage";

// TODO: dedupe all these mocks
jest.mock("../../lib/middleware/withPage", () => ({
  withPage: jest.fn()
}));

jest.mock("../../lib/middleware/withPublicPage", () => ({
  withPublicPage: jest.fn()
}));

const mockGetServerPageGetContentArticleContent = jest.fn();

jest.mock("../../graphql/generated/page", () => ({
  getServerPageGetContentArticleContent: () =>
    mockGetServerPageGetContentArticleContent()
}));

jest.mock("next-i18next/serverSideTranslations", () => ({
  serverSideTranslations: () => Promise.resolve({})
}));

const mockGetSession = jest.fn();
jest.mock("../../lib/auth0", () => ({
  getAuth0Instance: () => ({
    getSession: mockGetSession
  })
}));

describe("Content Article Page", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();

    mockGetServerPageGetContentArticleContent.mockImplementation(() => ({
      props: {
        data: {
          contentArticleCollection: {
            items: [
              {
                title: "test page",
                // NOTE: Not representative of Contentful RichText document
                body: { json: { type: "document" } }
              }
            ]
          }
        }
      }
    }));

    const serverSidePropsWrapperMock = (getServerSideProps: any) => {
      return (context: any) => {
        return getServerSideProps(context);
      };
    };

    // NOTE: typecasting as TS doesn't follow the fact that these are mocked
    (withPublicPage as jest.Mock).mockImplementationOnce(
      serverSidePropsWrapperMock
    );
    (withPage as jest.Mock).mockImplementationOnce(serverSidePropsWrapperMock);
  });

  const defaultContext = {
    apolloClient: {
      query: jest.fn()
    },
    res: {},
    req: {
      headers: {
        host: "en.local.intouch:3000"
      }
    }
  };

  it("should not require auth for whitelisted public pages", async () => {
    const context = {
      ...defaultContext,
      params: {
        contentArticleRelativePath: "privacy"
      }
    };

    // No session = not authenticated
    mockGetSession.mockImplementationOnce(() => null);

    const result = await getServerSideProps(context);

    expect(result).toMatchSnapshot();
    expect(withPublicPage).toBeCalled();
    expect(withPage).not.toBeCalled();
  });

  it("should show non-public pages if authenticated", async () => {
    const context = {
      ...defaultContext,
      params: {
        contentArticleRelativePath: "non-public-page"
      }
    };

    // TODO: copied from graphql.test.ts
    const createAccessToken = (claims = {}) => {
      const user = {
        "user/email": "user.email",
        iss: "user.iss",
        iat: "user.iat",
        exp: "user.exp",
        scope: "user.exp",
        sub: "user.sub",
        aud: "user.aud",
        user: {
          "https://intouch/intouch_market_code": "en"
        },
        ...claims
      };
      return `xx.${Buffer.from(JSON.stringify(user)).toString("base64")}.xx`;
    };

    mockGetSession.mockImplementationOnce(() => ({
      accessToken: createAccessToken(),
      user: {
        "https://intouch/intouch_market_code": "en"
      }
    }));

    const result = await getServerSideProps(context);

    expect(result).toMatchSnapshot();
    expect(withPage).toBeCalled();
    expect(withPublicPage).not.toBeCalled();
  });
});
