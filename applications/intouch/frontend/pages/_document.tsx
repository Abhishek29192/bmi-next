import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheets } from "@material-ui/core/styles";
import {
  AppPropsType,
  DocumentContext,
  DocumentInitialProps,
  RenderPage
} from "next/dist/next-server/lib/utils";

class BMIDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head></Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

BMIDocument.getInitialProps = async (
  ctx: DocumentContext
): Promise<DocumentInitialProps> => {
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

  return {
    ...initialProps,
    styles: [
      ...React.Children.toArray(initialProps.styles),
      sheets.getStyleElement()
    ]
  };
};

export default BMIDocument;
