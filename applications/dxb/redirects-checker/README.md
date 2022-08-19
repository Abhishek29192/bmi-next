# Redirects checker

Runs through all the redirects, checking to see if they are still working. 3 categories are printed out at the end;
redundant redirects, failed redirects and broken redirects.

## Categories

### Redundant redirects

These are redirects that are not created because the `from` URL is an actual page.

### Failed redirects

These are redirects that are created, but don't take the user to the configured `to` URL. This is most likely due to a
duplicate entry in the configuration.

### Broken redirects

These are redirects that are created, they try to send the user to the correct destination, but that destination does
not return a valid response.

## Run the script

### Build the script

First the script needs to be built.

```bash
yarn workspace @bmi/redirects-checker build
```

### Execute the script

Then the script needs to be executed, passing in the `host` (the source of the redirects) and the `redirects file` (the
full path of the redirects file to use).

```bash
yarn workspace @bmi/redirects-checker prod https://www.bmigroup.com /path/to/dxb/applications/dxb/head/redirects_en.toml
```
