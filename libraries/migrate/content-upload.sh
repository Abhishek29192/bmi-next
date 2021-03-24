#!/bin/bash

# take env vars from this file
source .env.development

if [[ "$CONTENTFUL_ENVIRONMENT" == "master" ]]; then
  echo "cannot upload data to master environment!"
  exit 1
fi

contentful space import \
--space-id $SPACE_ID \
--environment-id $CONTENTFUL_ENVIRONMENT \
--management-token $MANAGEMENT_ACCESS_TOKEN \
--export-dir libraries/migrate/$PROJECT_RELATIVE_PATH/mocks \
--skip-content-model \
--content-file libraries/migrate/$PROJECT_RELATIVE_PATH/mocks/content.json
