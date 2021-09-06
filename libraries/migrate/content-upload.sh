#!/bin/bash

# take env vars from this file
source .env.development

echo "Uploading content to Contentful..."
echo "from Project directory: $PROJECT_RELATIVE_PATH"
echo "Space id: $SPACE_ID"
echo "Environment: $CONTENTFUL_ENVIRONMENT"


if [[ "$CONTENTFUL_ENVIRONMENT" == "master" ]]; then
  echo "cannot upload data to master environment!"
  exit 1
fi

contentful space import \
--space-id $SPACE_ID \
--environment-id $CONTENTFUL_ENVIRONMENT \
--management-token $MANAGEMENT_ACCESS_TOKEN \
--export-dir $PROJECT_RELATIVE_PATH/mocks \
--skip-content-model \
--content-file $PROJECT_RELATIVE_PATH/mocks/content.json
