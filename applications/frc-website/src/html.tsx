import React from "react";
import PropTypes from "prop-types";

const FRC_GA_COOKIE_PREFIX = process.env.FRC_GA_COOKIE_PREFIX || "FRC";
const FRC_GA_CODE = process.env.FRC_GA_CODE;
const FRC_CIVIC_KEY = process.env.FRC_CIVIC_KEY;

export default function HTML(props) {
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
        
          gtag('config', '${FRC_GA_CODE}', {
            cookie_prefix: '${FRC_GA_COOKIE_PREFIX}'
          });
        `
          }}
        ></script>
        <script
          src="https://cc.cdn.civiccomputing.com/9/cookieControl-9.x.min.js"
          type="text/javascript"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
          var config = {
              apiKey: '${FRC_CIVIC_KEY}',
              product: 'COMMUNITY',
              necessaryCookies: ['e4efdb19-c9e8-40f9-8c3d-906acaf799db' /* hosting password cookie temporary fix as CookieControl deletes all other cookies on load */],
              optionalCookies: [
                  {
                          name: 'analytics',
                          label: 'Analytical Cookies',
                          description: 'Analytical Cookies helps us improve our products and services by collecting and reporting information on its usage',
                          cookies: ['_ga', '${FRC_GA_COOKIE_PREFIX}_ga', '_gid', '${FRC_GA_COOKIE_PREFIX}_gid', '${FRC_GA_COOKIE_PREFIX}_gat', 'AMP_TOKEN', '_gat_gtag_${FRC_GA_CODE}'],
                          vendors: [
                            {
                              name: "Google",
                              url: "https://policies.google.com/technologies/types?hl=en-US",
                              description: "Google Analytics"
                            }
                          ],
                          onAccept : function(){
                            if(!window.hasAppendedGtagElement) {
                              var gtagElement = document.createElement("script");
                              gtagElement.async = true;
                              gtagElement.src = "https://www.googletagmanager.com/gtag/js?id=${FRC_GA_CODE}";
                              document.head.appendChild(gtagElement);
      
                              window.hasAppendedGtagElement = true;
                            }
      
                            window['ga-disable-${FRC_GA_CODE}'] = false;
                          },
                          onRevoke: function(){
                            window['ga-disable-${FRC_GA_CODE}'] = true;
                          }
                      }
              ],
      
              position: 'RIGHT',
              theme: 'LIGHT'
          };
          
          CookieControl.load( config );`
          }}
        />
        {props.headComponents}
      </head>
      <body {...props.bodyAttributes}>
        {props.preBodyComponents}
        <div
          key={`body`}
          id="___gatsby"
          dangerouslySetInnerHTML={{ __html: props.body }}
        />
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
