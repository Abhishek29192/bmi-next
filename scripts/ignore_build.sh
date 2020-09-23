#!/bin/bash

BaseDirectory=$1

if [ -z "$BaseDirectory" ] || [ -z "$CACHED_COMMIT_REF" ] ||
 [ -z "$COMMIT_REF"  ] 
  then
    echo "One or more of parameters are empty. Continue the build."
    exit 1
fi

echo "Base Directory: $BaseDirectory"
echo "CACHED_COMMIT_REF: $CACHED_COMMIT_REF"
echo "COMMIT_REF: $COMMIT_REF"

# Check for changes in the $BaseDirectory between $CACHED_COMMIT_REF and 
# $COMMIT_REF commits.
if git diff --quiet $CACHED_COMMIT_REF $COMMIT_REF $BaseDirectory; then
  echo "No changes are found in the base directory. Cancel the build"
  exit 0
else
  echo "Changes are found in the base directory. Continue the build."
  exit 1
fi
