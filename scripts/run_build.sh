#!/bin/bash

# Returns "true" if there are any changes in the list of directories provided
# and "false" if there aren't any.
#
# Example: scripts/run_build.sh components/accordion components/alert-banner

base_directories=${*}

if [ ${#base_directories[@]} -eq 0 ] || [ -z "$CI_COMMIT_SHA" ]; then
  echo "One or more of parameters are empty."  >&2
  echo "false"
  exit
fi

if [[ "$CI_COMMIT_BRANCH" == "master" ]] || [[ "$CI_COMMIT_BRANCH" == "pre-production" ]] ||
  [[ "$CI_COMMIT_BRANCH" == "production" ]] || [[ -n "$CI_COMMIT_TAG" ]]; then
  commit_to_compare=$CI_COMMIT_BEFORE_SHA
elif [ "$CI_PIPELINE_SOURCE" == "merge_request_event" ]; then
  commit_to_compare=$CI_MERGE_REQUEST_SOURCE_BRANCH_SHA
else
  echo "Unsupported CI_PIPELINE_SOURCE: [$CI_PIPELINE_SOURCE]"  >&2
  echo "false"
  exit
fi

echo "Base directory: $base_directories" >&2
echo "Commit to compare: $commit_to_compare"  >&2
echo "Current commit: $CI_COMMIT_SHA" >&2

if git diff --quiet $CI_COMMIT_SHA $commit_to_compare $base_directories; then
  echo "No changes are found in the base directory. Cancel the build"  >&2
  echo "false"
else
  echo "Changes are found in the base directory. Continue the build."  >&2
  echo "true"
fi
