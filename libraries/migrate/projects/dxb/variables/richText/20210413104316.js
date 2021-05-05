"use strict";

module.exports = {
  enabledNodeTypes: [
    "heading-3",
    "heading-4",
    "heading-5",
    "heading-6",
    "ordered-list",
    "unordered-list",
    "hr",
    "blockquote",
    "embedded-entry-block",
    "embedded-asset-block",
    "hyperlink",
    "entry-hyperlink",
    "asset-hyperlink",
    "embedded-entry-inline"
  ],
  nodes: {
    "embedded-entry-block": [{ linkContentType: ["link", "table"] }],
    "embedded-entry-inline": [{ linkContentType: ["link"] }]
  }
};
