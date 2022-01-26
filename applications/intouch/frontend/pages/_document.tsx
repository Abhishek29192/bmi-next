import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheets } from "@material-ui/core/styles";
import {
  AppPropsType,
  DocumentContext,
  DocumentInitialProps,
  RenderPage
} from "next/dist/next-server/lib/utils";
import { initializeApollo } from "../lib/apolloClient";
import { queryMarketsByDomain } from "../lib/market";
import { getMarketAndEnvFromReq } from "../lib/utils";
import { getAuth0Instance } from "../lib/auth0";

// see https://github.com/vercel/next.js/tree/canary/examples/with-google-tag-manager
// for example of google tag manager integration in Next.js

type Props = {
  googleTagManagerId: string;
};

class BMIDocument extends Document<Props> {
  render() {
    const { locale, googleTagManagerId } = this.props;
    const { GOOGLE_TAGMANAGER_ID, NODE_ENV } = process.env;
    const gtmID =
      (NODE_ENV === "development" && GOOGLE_TAGMANAGER_ID) ||
      googleTagManagerId;
    const lang =
      (locale.split("_").length && locale.split("_")[1].toLowerCase()) || "en";

    return (
      <Html lang={lang}>
        <Head>
          <script
            async
            src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"
            type="text/javascript"
            data-domain-script={process.env.ONE_TRUST_GUID}
          />
          <script type="text/javascript">{function OptanonWrapper() {}}</script>
          {!!gtmID && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmID}');
            `
              }}
            />
          )}
        </Head>
        <body>
          {!!gtmID && (
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${gtmID}`}
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              />
            </noscript>
          )}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

BMIDocument.getInitialProps = async (
  ctx: DocumentContext
): Promise<DocumentInitialProps & Props> => {
  const sheets = new ServerStyleSheets();
  const originalRenderPage: RenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props: AppPropsType) =>
        sheets.collect(<App {...props} />)
    });

  const initialProps: DocumentInitialProps = await Document.getInitialProps(
    ctx
  );
  const auth0 = await getAuth0Instance(ctx.req, ctx.res);
  const session = auth0.getSession(ctx.req, ctx.res);
  const apolloClient = await initializeApollo(null, {
    req: ctx.req,
    res: ctx.res,
    accessToken: session.accessToken
  });
  const { market: domain } = getMarketAndEnvFromReq(ctx.req);
  const {
    data: {
      markets: { nodes: markets }
    }
  } = await apolloClient.query({
    query: queryMarketsByDomain,
    variables: { domain }
  });
  const googleTagManagerId = markets.length && markets[0]!.gtag;
  return {
    ...initialProps,
    googleTagManagerId,
    styles: [
      ...React.Children.toArray(initialProps.styles),
      sheets.getStyleElement()
    ]
  };
};

export default BMIDocument;
