#!/bin/bash

if [ -z "$1" ] || [ -z "$2" ]; then
      echo "One or more arguments are missing"
      exit 1
fi

# Pushes the function source zip package into GCP storage for each GCP project. 
# i.e DXB production could have many GCP projects by region.
cat $1 | jq -c '.[]' | while read -r i; do
      PROJECT_ID=$(echo $i | jq -r '.PROJECT_ID')
      SERVICE_KEY=$(echo $i | jq -r '.SERVICE_KEY')
      BUILD_STORAGE=$(echo $i | jq -r '.BUILD_STORAGE')

      echo "$SERVICE_KEY" > "$(pwd)/$PROJECT_ID.json"
      gcloud auth activate-service-account --key-file="$(pwd)/$PROJECT_ID.json"
      gcloud config set project $PROJECT_ID
      gsutil cp $CI_PROJECT_DIR/dist/functions/$2.zip gs://$BUILD_STORAGE/sources/
done
