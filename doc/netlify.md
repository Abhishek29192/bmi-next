# Netlify

This project gets built using Netlify and it uses different configurations depending on the workspace.

Builds happen on:

- `git` pushes (including tags)
- Contentful manual triggers
- Firestore pushes

When `head` gets build, extra checks (i.e. what hook is triggering the build, what tag is used, etc) are run using the `@bmi/build-contentful` package.

## Run Netlify locally

You can run [Netlify locally](https://www.netlify.com/products/dev/) using the configuration of any site associated to your account.

Install Netlify CLI locally

```shell
$ npm install netlify-cli -g
```

Then login to your account and then initialise the site.

```shell
# This will prompt the Netlify webiste, and then ask for linking a specific site.
$ netlify link
```

**Select an existing netlify site using the current git remote origin (https://gitlab.com/bmi-digital/dxb).**

Netlify will keep site information in the `.netlify` folder (git ignored).

### Build and deploy locally

If you need to, you can build using the `netlify build` command and then deploy it.
This will use local env file and the environment variables and settings from the netlify site (including `base directory`!).

```shell
$ netlify build
```

After that's completed, you can access it locally or remotely using the `netlify dev` command.

```shell
# Local
$ netlify dev

# Remote
$ netlify dev --live
```

Once you're happy with the changes, you can

```shell
$ netlify deploy
```

Which will generate a preview link. To then promote it to production, run:

```shell
$ netlify deploy --prod
```

## Netlify Functions

### Create function

To create a new function, run the below command. To be triggered by [specific events](https://docs.netlify.com/functions/trigger-on-events), the function needs to be named after the event.

```bash
cd path/to/functions
netlify functions:create --name [function name]
```

### Run locally

```bash
netlify dev # to start the dev server to host the function
netlify functions:invoke --functions [path/to/functions] [function name] --payload '{}'
```
