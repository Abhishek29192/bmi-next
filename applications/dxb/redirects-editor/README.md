# Redirects editor

A CLI tool to update a redirects file with either the passed in redirect _or_ redirects from a CSV file.

## Usage

### Build

To be able to use the CLI tool, it first needs to be built.

```bash
yaml workspace @bmi/readirects-editor build
```

### Add single redirect via arguments

To add a single redirect, it can be passed in using the arguments `from` (`f`), `to` (`t`) and `status` (`s`). By
default, the status is set to `301`, so is not required.

```bash
yarn workspace @bmi/redirects-editor start -r /path/to/existing/redirects/file.toml -f /no/old-page/ -t /no/new-page/ -s 301
```

### Bulk update with a CSV file

To be able to bulk add redirects, the `csvFile` (`c`) argument can be used to provide a CSV file, which must contain
a `from` and `to` values as well as an optional `status` value.

```csv
from,to,status
/no/old-page,/no/new-page,301
/no/another-old-page,/no-another-new-page,
```

```bash
yarn workspace @bmi/redirects-editor start -r /path/to/existing/redirects/file.toml -c /path/to/csv/redirects/file.csv
```

## Caveats

There are a couple of caveats to be aware of when running this script. To be able to de-duplicate entries and remove any multiple hop redirects, there has to be some understanding of what value to use. This script assumes that the lower down the entry, the more relevant it is. The reasoning for this is because either the redirects file being updated has never gone through this script before and so most people updating the file would add new redirects to the bottom of the file _or_ the new redirect(s) being added is causing the duplication or multiple hop, in which case, it is added to the bottom of the list of redirects whereby the ordering is done _last_ in the script.
