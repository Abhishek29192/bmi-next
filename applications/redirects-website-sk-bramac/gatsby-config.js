"use strict";

module.exports = {
  siteMetadata: {
    title: `BMI dxb SK redirects - Slovakia Bramac`,
    description: `Website for SK redirects - Slovakia Bramac`,
    author: `bmi`,
    siteUrl: `https://bmidxbredirectsslovakiabramac.gatsbyjs.io`
  },
  plugins: [
    {
      resolve: `gatsby-plugin-gatsby-cloud`,
      options: {
        headers: {}, // option to add more headers. `Link` headers are transformed by the below criteria
        allPageHeaders: [], // option to add headers for all pages. `Link` headers are transformed by the below criteria
        mergeSecurityHeaders: false, // boolean to turn off the default security headers
        mergeLinkHeaders: false, // boolean to turn off the default gatsby js headers
        mergeCachingHeaders: false, // boolean to turn off the default caching headers
        // eslint-disable-next-line no-unused-vars
        transformHeaders: (headers) => headers, // optional transform for manipulating headers under each path (e.g.sorting), etc.
        generateMatchPathRewrites: false // boolean to turn off automatic creation of redirect rules for client only paths
      }
    }
  ]
};
