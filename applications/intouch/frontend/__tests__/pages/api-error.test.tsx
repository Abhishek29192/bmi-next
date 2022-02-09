const mockWithPage = jest.fn();
const mockWithPublicPage = jest.fn();

import { getServerSideProps } from "../../pages/api-error";

import { withPage } from "../../lib/middleware/withPage";
import { withPublicPage } from "../../lib/middleware/withPublicPage";

jest.mock("../../lib/middleware/withPage", () => ({
  withPage: mockWithPage
}));

jest.mock("../../lib/middleware/withPublicPage", () => ({
  withPublicPage: mockWithPublicPage
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

const serverSidePropsWrapperMock = (getServerSideProps: any) => {
  return (context: any) => {
    return getServerSideProps(context);
  };
};

describe("Api error page", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();

    // NOTE: typecasting as TS doesn't follow the fact that these are mocked
    mockWithPublicPage.mockImplementationOnce(serverSidePropsWrapperMock);
    mockWithPage.mockImplementationOnce(serverSidePropsWrapperMock);
  });

  const defaultContext = {
    apolloClient: {
      query: jest.fn()
    },
    res: {},
    query: {
      message: "errorInvitationNotFound"
    }
  };

  it("should use withPublicPage middleware if not authenticated", async () => {
    // No session = not authenticated
    mockGetSession.mockImplementationOnce(() => null);

    const result = await getServerSideProps(defaultContext);

    expect(result).toMatchSnapshot();
    expect(withPublicPage).toBeCalled();
    expect(withPage).not.toBeCalled();
  });

  it("should use withPage middleware if authenticated", async () => {
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

    const result = await getServerSideProps(defaultContext);

    expect(result).toMatchSnapshot();
    expect(withPage).toBeCalled();
    expect(withPublicPage).not.toBeCalled();
  });
});
