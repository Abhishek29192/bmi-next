import PropTypes from "prop-types";
import React from "react";

const GATSBY_FRC_GA_COOKIE_PREFIX =
  process.env.GATSBY_FRC_GA_COOKIE_PREFIX || "FRC";
const GATSBY_FRC_GA_CODE = process.env.GATSBY_FRC_GA_CODE;

export default function HTML(props: {
  htmlAttributes: Record<string, unknown>;
  headComponents: [];
  bodyAttributes: Record<string, unknown>;
  preBodyComponents: [];
  body: string;
  postBodyComponents: [];
}) {
  return (
    <html {...props.htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="robots" content="noindex" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
          // Global site tag (gtag.js) - Google Analytics
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
        
          gtag('config', '${GATSBY_FRC_GA_CODE}', {
            cookie_prefix: '${GATSBY_FRC_GA_COOKIE_PREFIX}'
          });
        `
          }}
        ></script>
        {props.headComponents}
      </head>
      <body {...props.bodyAttributes}>
        {props.preBodyComponents}
        <div
          key={`body`}
          id="___gatsby"
          dangerouslySetInnerHTML={{ __html: props.body }}
        />
        <div id="cookie-banner" />
        {props.postBodyComponents}
      </body>
    </html>
  );
}

HTML.propTypes = {
  htmlAttributes: PropTypes.object,
  headComponents: PropTypes.array,
  bodyAttributes: PropTypes.object,
  preBodyComponents: PropTypes.array,
  body: PropTypes.string,
  postBodyComponents: PropTypes.array
};
