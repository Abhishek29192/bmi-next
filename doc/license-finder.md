# License Finder

We use [License Finder](https://github.com/pivotal/LicenseFinder) to check our dependencies. This allows us to bring in any dependencies that we want, ensuring that we don't put ourselves into any legal troubles by using licenses that are not allowable for what we do.

There is a common set of approvals in our [Licene Finder](https://gitlab.com/bmi-digital/license-finder) repo. If license finder fails due to an external dependency, then please configure it properly in that repo, so it is applicaple for all of our projects. If it is for a sub project of this repo, please add it to [workspace_dependencies.yml](workspace_dependencies.yml).

## Install License Finder locally

1. Install [Ruby](https://www.ruby-lang.org/en/) if it's not already installed
2. Install the License Finder gem
   ```bash
   gem install license_finder
   ```

## Run License Finder check

To run the report, simply run `license_finder action_items`. Unfortunately, this is output straight to the console and isn't always the most readable. Instead, use the `--format html` option to produce something that can be more readable.

```bash
license_finder action_items --format html > output.html
```

## Allow dependency

License Finder uses the package manager present in the repo for finding out what license is applicable to the dependency (e.g. using the license property in a `package.json` file). Unfortunately, some libraries aren't very clear in their usage (e.g. have a combination of licenses and use a custom format to denote that), don't bundle the license in with the dependency or simply don't use common conventions to signify what the license is.

Sometimes, we have dependencies that are necessary for what we do and simply aren't licensed (e.g. the Netlify CLI library brings in other Netlify libraries which are unlicensed, but needed to use the CLI).

### Add dependency without a license

Assuming that the dependency is required for us to use, the dependency can be explicitly approved.

_N.B. Make sure to specify who added it, the reason for adding it and the version, in case it changes in the future_

```bash
license_finder dependencies add traffic-mesh-agent-linux-x64 0.1.2 --who "Benjamin Sproule" --why "License isn't specifiec but required by Netlify CLI"
```

### Unapprove dependency with incompatible license

Assuming that a dependency was once required and didn't have a license and now has an incompatible license, it is important that it is removed from the approved depdencies list. The cleanest way to deal with this is to simply delete the relevant entry from the `approved_dependencies.yml`. Using the `license_finder` CLI just adds another entry into the file.
