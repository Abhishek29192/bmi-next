#!/bin/bash

# take env vars from this file
source .env.development

echo "Downloading content from Contentful..."
echo "Space id: $SPACE_ID"
echo "Environment: $CONTENTFUL_ENVIRONMENT"

EXPORT_DIR=libraries/migrate/$PROJECT_RELATIVE_PATH/mocks
FILE_NAME=content.json

contentful space export \
--space-id $SPACE_ID \
--environment-id $CONTENTFUL_ENVIRONMENT \
--management-token $MANAGEMENT_ACCESS_TOKEN \
--export-dir $EXPORT_DIR \
--download-assets \
--skip-content-model \
--skip-webhooks \
--content-file $FILE_NAME

echo "Downloaded assets to: $EXPORT_DIR"
echo "Downloaded content to: $EXPORT_DIR/$FILE_NAME"
