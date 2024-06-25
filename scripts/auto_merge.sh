#!/bin/bash

merge_preprod () {
  git checkout master && \
  git merge pre-production && \
  git push origin master
  if [ $? -ne 0 ];
    then
    echo "Will open merge request for pre-production in the next job..."
    echo "PREPROD_MR=true" >> $CI_PROJECT_DIR/post_deploy.env
    exit 0
  else
    echo "Auto-merge of pre-production was successful"
  fi
}

merge_prod () {
  git checkout pre-production && \
  git merge production && \
  git push origin pre-production
  if [ $? -ne 0 ];
    then
    echo "Will open two merge requests for production & pre-production in the next job..."
    echo "PROD_MR=true" >> $CI_PROJECT_DIR/post_deploy.env
    exit 0
  else
    echo "Auto-merge of production was successful"
  fi
  merge_preprod
}

git clone https://auto-merge:$TOKEN_AUTO_MERGE@gitlab.com/bmi-digital/dxb.git && cd dxb
git fetch
git config user.email "gitlab-runner@not-existing.com"
git config user.name "Gitlab Runner"
git checkout pre-production
git checkout production

if [[ "$CI_COMMIT_TAG" =~ $DXB_RELEASE_TAG_FORMAT_PREPROD ]];
then
  merge_preprod
elif [[ "$CI_COMMIT_TAG" =~ $DXB_RELEASE_TAG_FORMAT_PROD ]];
then
  merge_prod
else
  echo "Something went wrong: the release type is unknown"
  exit 1
fi
