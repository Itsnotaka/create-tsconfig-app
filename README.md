# Create Tsconfig App

The usual way of creating a fully working Typescript project is annoying, that's why `create-tsconfig-app` is the easiest way to create a complete Typescript project without any effort. To get started, use the following command:

```bash
npx create-tsconfig-app@latest
# or
yarn create tsconfig-app
# or
pnpm create tsconfig-app
```

Or, for a [SWC project](https://github.com/swc-project/swc):

```bash
npx create-tsconfig-app@latest --swc
# or
yarn create tsconfig-app --swc
# or
pnpm create tsconfig-app --swc
```

To create a new app in a specific folder, you can send a name as an argument. For example, the following command will create a new Next.js app called `blog-app` in a folder with the same name:

```bash
npx create-tsconfig-app@latest blog-app
# or
yarn create-tsconfig-app@latest blog-app
# or
pnpm create-tsconfig-app@latest blog-app
```

## Options

`create-next-app` comes with the following options:

- **--swc** - Initialize as a SWC project.
- **--ncc** - Initialize as a @vercel/ncc project.
- **-e, --example [name]|[github-url]** - An example to bootstrap the app with. You can use an example name from the [Next.js repo](https://github.com/vercel/next.js/tree/canary/examples) or a GitHub URL. The URL can use any branch and/or subdirectory.
- **--example-path &lt;path-to-example&gt;** - In a rare case, your GitHub URL might contain a branch name with a slash (e.g. bug/fix-1) and the path to the example (e.g. foo/bar). In this case, you must specify the path to the example separately: `--example-path foo/bar`
- **--use-npm** - Explicitly tell the CLI to bootstrap the app using npm. To bootstrap using yarn we recommend to run `yarn create tsconfig-app`
- **--use-pnpm** - Explicitly tell the CLI to bootstrap the app using pnpm. To bootstrap using pnpm we recommend running `pnpm create tsconfig-app`

## Why use Create Tsconfig App?

- **Standardizing Typescript project creation is hard**
- **Interactive Experience**: Running `npx create-tsconfig-app` (with no arguments) launches an interactive experience that guides you through setting up a project.
- **Zero Dependencies**: Initializing a project is as quick as one second. Create Tsconfig App has zero dependencies.
- **Offline Support**: Create Tsconfig App will automatically detect if you're offline and bootstrap your project using your local package cache.

Special Thanks to:
[Vercel - Create Next App](https://github.com/vercel/next.js/tree/canary/packages/create-next-app)
