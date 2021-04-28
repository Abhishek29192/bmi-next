#!/bin/bash

secret_prefix="secret:"

for i in $(printenv | grep ${secret_prefix})
do
  key=$(echo ${i} | cut -d'=' -f 1)
  val=$(echo ${i} | cut -d'=' -f 2-)
  if [[ ${val} == ${secret_prefix}* ]]
  then
    val=$(echo ${val} | sed -e "s/${secret_prefix}//g")
    projectId=$(echo ${val} | cut -d'/' -f 1)
    secret=$(echo ${val} | cut -d'/' -f 2)

    if [[ -n ${projectId} ]]
    then
      project="--project=${projectId}"
    fi

    secretName=$(echo ${secret} | cut -d'#' -f 1)
    version="latest"
    if [[ ${val} == *#* ]]
    then
      version=$(echo ${val} | cut -d'#' -f 2)
    fi
    plain="$(gcloud secrets versions access --secret=${secretName} ${version} ${project})"

    export $key="$(echo $plain | sed -e 's/\n//g')"
  fi
done

npm run start
