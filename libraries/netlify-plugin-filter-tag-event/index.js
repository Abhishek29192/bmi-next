"use strict";

const PRODUCTION_BRANCH = "production";
const PRE_PRODUCTION_BRANCH = "pre-production";

const recognisedHooks = ["Contentful integration", "Firestore hook"];

// NOTE: https://github.com/semver/semver/issues/232#issuecomment-405596809
const semVerRegex = /^(?<prefix>v?)(?<major>0|[1-9]\d*)\.(?<minor>0|[1-9]\d*)\.(?<patch>0|[1-9]\d*)(?:-(?<prerelease>(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+(?<buildmetadata>[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

module.exports = {
  onPreBuild: ({ utils }) => {
    const { BRANCH, INCOMING_HOOK_BODY, INCOMING_HOOK_TITLE } = process.env;

    if (recognisedHooks.includes(INCOMING_HOOK_TITLE)) {
      return;
    }

    if (![PRODUCTION_BRANCH, PRE_PRODUCTION_BRANCH].includes(BRANCH)) {
      return;
    }

    let tag = "";

    if (INCOMING_HOOK_BODY) {
      const { event_name, ref } = JSON.parse(INCOMING_HOOK_BODY);

      if (event_name === "tag_push") {
        tag = ref.replace("refs/tags/", "");
      }
    }

    if (!tag && [PRODUCTION_BRANCH, PRE_PRODUCTION_BRANCH].includes(BRANCH)) {
      return utils.build.cancelBuild(
        `Skip build for merge event into ${BRANCH} without tag`
      );
    }

    if (!tag.match(semVerRegex)) {
      return utils.build.failBuild(`Tag ${tag} is not a valid semver.`);
    }

    const semver = tag.match(semVerRegex).groups;

    if (BRANCH === PRODUCTION_BRANCH && semver.prerelease) {
      return utils.build.cancelBuild(
        `Skip build for tag event (tag: ${tag}) on ${BRANCH} as it is intended for ${PRE_PRODUCTION_BRANCH} only.`
      );
    }

    if (BRANCH === PRE_PRODUCTION_BRANCH && !semver.prerelease) {
      return utils.build.cancelBuild(
        `Skip build for tag event (tag: ${tag}) on ${BRANCH} as it is intended for ${PRODUCTION_BRANCH} only.`
      );
    }
  }
};
