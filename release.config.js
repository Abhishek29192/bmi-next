"use strict";

module.exports = {
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/gitlab"
  ],
  branches: ["production", { name: "pre-production", prerelease: "alpha" }]
};
