#!/bin/bash

set -e

script=$0

usage() {
  cat << EOF >&2
Usage: $script [-h] [-f <file>] [-c <country-code>]

               -h: Print this help message.
        -f <file>: Pass the space backup file in .json format.
		   Mandatory.
-c <country-code>: Pass the market/country code of 2 letters.
		   For example, <UK> for the United Kingdom.
		   Mandatory.
EOF
  exit 1
}

while getopts f:c:h o; do
  case $o in
    (f) backup_file="$OPTARG";;
    (c) country_code="$OPTARG";;
    (h) usage;;
    (*) usage
  esac
done
shift "$((OPTIND - 1))"

if [ -z "$backup_file" ] && [ -z "$country_code" ]
then
    printf "Please, pass a space backup file and a market/country code with relative parameters [-f <file>] & [-c <country-code>].\nFor more info check the help command with:\n$script -h\n"
    exit
elif [ -z "$backup_file" ]
then
    printf "Please, pass a space backup file with relative parameter [-f <file>].\nFor more info check the help command with:\n$script -h\n"
    exit
elif [ -z "$country_code" ]
then
    printf "Please, pass a market/country code with relative parameter [-c <country-code>].\nFor more info check the help command with \n$script -h\n"
    exit
fi

jq -r '.entries[] | {sys} | .[] | select(.type=="Entry") | .id' $backup_file > all_ids.txt && \
jq -r '.assets[] | {sys} | .[] | select(.type=="Asset") | .id' $backup_file >> all_ids.txt

jq -r '.contentTypes[] | {sys} | .[] | select(.type=="ContentType") | .id' $backup_file > ids_to_exclude.txt
jq -r '.contentTypes[] | {fields} | .[][] | select(.id=="linkedPage") | .validations | .[] | .linkContentType | .[]' $backup_file >> ids_to_exclude.txt

exclude_array=`cat ids_to_exclude.txt`

for id in $exclude_array
do
    sed -i'.bak' "/"$id"/d" all_ids.txt
done

cp $backup_file sededSpace.json

id_array=`cat all_ids.txt`

for id in $id_array
do
    sed "/url/! s/$id/"$country_code"_"$id"/g" sededSpace.json > tmp.json
    mv tmp.json sededSpace.json
done

rm all_ids.txt* ids_to_exclude.txt 
mv sededSpace.json "$country_code"_Space.json
