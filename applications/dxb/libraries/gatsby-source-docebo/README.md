# gatsby-source-docebo

Gatsby source plugin for pulling data from [Docebo.com](https://www.docebo.com/) into [Gatsby](https://www.gatsbyjs.com) websites.

## Install

In the `gatsby-config.mjs` file in the Gatsby project's root directory, add the plugin configuration inside of the `plugins` section:

```js
module.exports = {
  // ...
  plugins: [
    {
      resolve: "@bmi/gatsby-source-docebo",
      options: {
        apiUrl: process.env.DOCEBO_API_URL,
        clientId: process.env.DOCEBO_API_CLIENT_ID,
        catalogIds: process.env.DOCEBO_API_CATALOGUE_IDS,
        clientSecret: process.env.DOCEBO_API_CLIENT_SECRET,
        username: process.env.DOCEBO_API_USERNAME,
        password: process.env.DOCEBO_API_PASSWORD
      }
    }
    // ...
  ]
  // ...
};
```

Please note `catalogIds` is _optional_, if you don't include it (or leave it blank) ALL catalogue entries are returned.

## Basic usage

Explore `http://localhost:8000/___graphql` after running `yarn develop` to see the added nodes.

## Nodes

The following nodes are available for GraphQL queries:

| Node                                                                                                                             |
| -------------------------------------------------------------------------------------------------------------------------------- |
| [doceboCatalogues](https://doceboapi.docebosaas.com/api-browser/#!/learn/Catalogue/Catalogue_learn_v1_catalog)                   |
| [doceboCategories](https://doceboapi.docebosaas.com/api-browser/#!/learn/Categories/Categories_learn_v1_categories)              |
| [doceboCertifications](https://doceboapi.docebosaas.com/api-browser/#!/learn/Certification/Certification_learn_v1_certification) |
| [doceboCourses](https://doceboapi.docebosaas.com/api-browser/#!/learn/Course/Course_learn_v1_courses)                            |

An example query would look like this:

```graphql
{
  doceboCourses(slug_name: { eq: "danish-test-course" }) {
    name
  }
}
```

All entries for a node can be turned via an `allSomeNodeType` query:

```graphql
{
  allDoceboCatalogues {
    nodes {
      catalogue_code
      catalogue_description
      catalogue_id
    }
  }
}
```
