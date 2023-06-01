#!/usr/bin/env bash
echo "version: 2" >.gitlab/dependabot.yml
{
  echo "registries:"
  echo "  npm-npmjs:"
  echo "    type: npm-registry"
  echo "    url: https://registry.npmjs.org"
  echo "    token: \${{NPM_AUTH_READ_TOKEN}}"
  echo "updates:"
} >>.gitlab/dependabot.yml

package_json=$(find . -type d -name 'node_modules' -prune -false -o -type d -name 'dist' -prune -false -o -type f -name 'package.json')
for file in $package_json; do
  directory=$(echo ${file} | sed '/\.\//s/\.//' | sed 's/\/package\.json//')
  [ -z $directory ] && directory="/"
  {
    echo "  ###################################"
    echo "  # $(basename ${directory})"
    echo "  ###################################"
    echo "  - package-ecosystem: \"npm\""
    echo "    registries:"
    echo "      - npm-npmjs"
    echo "    directory: \"${directory}\""
    echo "    schedule:"
    echo "      interval: \"weekly\""
  } >>.gitlab/dependabot.yml
done
