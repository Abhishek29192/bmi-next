"use strict";

const React = require("react");

const gatsby = jest.requireActual("gatsby");

// https://www.gatsbyjs.com/docs/how-to/testing/unit-testing/
module.exports = {
  ...gatsby,
  graphql: jest.fn(),
  Link: jest.fn().mockImplementation(
    // these props are invalid for an `a` tag
    ({
      /* eslint-disable no-unused-vars */
      activeClassName,
      activeStyle,
      getProps,
      innerRef,
      partiallyActive,
      ref,
      replace,
      /* eslint-enable no-unused-vars */
      to,
      ...rest
    }) =>
      React.createElement("a", {
        ...rest,
        href: to
      })
  ),
  StaticQuery: jest.fn(),
  useStaticQuery: jest.fn(),
  navigate: jest.fn()
};
