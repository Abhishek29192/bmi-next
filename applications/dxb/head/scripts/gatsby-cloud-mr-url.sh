#!/usr/bin/env bash

apt-get update
apt-get install -y curl jq

commit_time=$(date -u +%s --date="$(git show -s --format=%cd --date=iso-strict "${CI_COMMIT_SHA}")")

function get_note {
  notes=$(curl --header "PRIVATE-TOKEN: ${NETLIFY_GITLAB_TOKEN}" -H "Content-Type: application/json" \
    "$CI_API_V4_URL/projects/19163612/merge_requests/${CI_MERGE_REQUEST_IID}/notes?sort=desc&order_by=updated_at&page=$1")
  if [ "${notes}" = "[]" ]; then
    echo ""
    return 0
  fi
  note=$(echo "${notes}" | jq 'map(select(.body | contains("95883ff6-e265-4416-917c-77929cc9970b/sites/595af1d3-4329-45c2-b3e8-0cdea3e3a1af"))) | first')
  if [ -z "${note}" ] || [ "${note}" = "null" ]; then
    get_note $(($1 + 1))
    return 0
  fi
  echo "${note}"
}

while true; do
  note=$(get_note 1)
  updated_at=$(date -u +%s --date="$(echo "${note}" | jq -r '.updated_at')")
  body=$(echo "${note}" | jq '.body')
  if [[ $((updated_at - commit_time)) -gt 0 ]]; then
    if [[ $body == *"## :white_check_mark: DXB-CI deploy preview ready"* ]]; then
      sed -n 's/.*\[Deploy preview\](\(.*\))\\n\*.*/\1/p' <<<"${body}" >deploy_head
      exit 0
    fi
    echo "Latest Gatsby build failed to build."
    exit 1
  fi
  echo "Latest Gatsby build has not been completed yet."
  sleep 30
done
