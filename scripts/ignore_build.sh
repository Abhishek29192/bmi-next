#!/bin/bash

# Required until https://gitlab.com/gitlab-org/gitlab/-/issues/322206 is dealt with

base_directories=${*}

if [ ${#base_directories[@]} -eq 0 ] || [ -z "$CI_COMMIT_SHA" ]; then
  echo "One or more of parameters are empty."  >&2
  echo "true"
  exit
fi

if [[ "$CI_COMMIT_BRANCH" == "master" ]] || [[ "$CI_COMMIT_BRANCH" == "pre-production" ]] ||
  [[ "$CI_COMMIT_BRANCH" == "production" ]] || [[ -n "$CI_COMMIT_TAG" ]]; then
  commit_to_compare=$CI_COMMIT_BEFORE_SHA
elif [ "$CI_PIPELINE_SOURCE" == "merge_request_event" ]; then
  commit_to_compare=$CI_MERGE_REQUEST_SOURCE_BRANCH_SHA
else
  echo "Unsupported CI_PIPELINE_SOURCE: [$CI_PIPELINE_SOURCE]"  >&2
  echo "true"
  exit
fi

echo "Base directory: $base_directories"
echo "Commit to compare: $commit_to_compare"
echo "Current commit: $CI_COMMIT_SHA"

if git diff --quiet $CI_COMMIT_SHA $commit_to_compare $base_directories; then
  echo "No changes are found in the base directory. Cancel the build"  >&2
  echo "true"
else
  echo "Changes are found in the base directory. Continue the build."  >&2
  echo "false"
fi
