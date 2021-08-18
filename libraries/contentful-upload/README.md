# Contentful upload

This is a script that can be used to upload TSVs to a contentful space. The script only adds new entries to contentful and doesn’t modify existing ones.

It also assumes that the TSV file are tab separated and named according to the template, and have valid values for the fields which should be listed in the following format:

```

Company Name 	Latitude	Longitude	Address	City	Postcode	PhoneNumber	Email 	Company Website	Summary of Company

Sample name	60.0000000	23.0000000	Sample address			075 0000 0000
```

Note the empty line at the beginning.

It’s important to double check the field ids, and the content-type ids (e.g. roofer.tsv and not Roofers.tsv or Service.tsv), and test migrating the fields to an empty space environment, because the process will stop on the first error (e.g. incorrect value for a record), and the uploaded records need to be deleted before the migration is re-run again after fixing the erroring record.

## Script files

### .env

Environment variables. Needs to be copied from `.env.example` and modified to have the correct value.

### merchants.tsv

File containing the data to be uploaded, should be in `libraries/contentful-upload` root.

## Running the script

In the repo root, run:

```
yarn workspace @bmi/contentful-upload upload-merchants merchants.tsv
```

Note that `merchants.tsv` is the path to the tsv file.
