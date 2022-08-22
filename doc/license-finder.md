# License Finder

We use [License Finder](https://github.com/pivotal/LicenseFinder) to check our dependencies. This allows us to bring in
any dependencies that we want, ensuring that we don't put ourselves into any legal troubles by using licenses that are
not allowable for what we do.

## Install License Finder locally

1. Install [Ruby](https://www.ruby-lang.org/en/) if it's not already installed
2. Install the License Finder gem
   ```bash
   gem install license_finder
   ```

## Run License Finder check

To run the report, simply run `license_finder action_items`. Unfortunately, this is output straight to the console and
isn’t always the most readable. Instead, use the `--format html` option to produce something that can be more readable.

```bash
license_finder action_items --format html > output.html
```

## Allow dependency/license

License Finder tries to use common conventions for finding out what license is applicable to the dependency (e.g. using
the license property in a `package.json` file or the `LICENSE.md` file). Unfortunately, some libraries aren’t very clear
in their usage (e.g. have a combination of licenses and use a custom format to denote that), don’t bundle the license in
with the dependency or simply don’t use common conventions to signify what the license is.

Sometimes, we have dependencies that are necessary for what we do and simply aren’t licensed (e.g. the Netlify CLI
library brings in other Netlify libraries which are unlicensed, but needed to use the CLI).

### Add dependency with a license that can’t be found

Assuming the license that is attributed to the dependency is compatible for us to use, the dependency can be assigned a
license for license_finder to use.

```bash
license_finder licenses add fsevents "MIT" --who "Benjamin Sproule" --why "LicenseFinder can't find the license, even though it's defined in the package.json"
```

### Add dependency without a license

Assuming that the dependency is required for us to use, the `license_finder` tool can be used to add an approval for a
dependency. Remember to provide who added the approval and the reasoning for adding it in.

```bash
license_finder approvals add @bmi/redirects-checker --who "Benjamin Sproule" --why "Our own project"
```

It is also possible to be specific with the dependency version, so we are only approving a specific version, if they
change their license after a specific version that no longer becomes compatible for us. Please note that this does not
work if it goes from `UNLICENSED` to non-compatible license.

```bash
license_finder dependencies add traffic-mesh-agent-linux-x64 0.1.2 --who "Benjamin Sproule" --why "license_finder can't access the repo (required by Netlify CLI)"
```

### Add license

Assuming that the license that is missing is one that should be compatible for all dependencies that are attributed that
license, we can add said license.

```bash
license_finder permitted_licenses add MIT --who "Benjamin Sproule" --why "Compatible license"
```
