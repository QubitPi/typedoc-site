---
layout: "guide"
tags: guide
eleventyNavigation:
    order: 1
    key: Installation
    parent: Overview
---

# Installation

## Requirements

TypeDoc requires [Node.js](http://nodejs.org/) to be installed on your system. If you haven't done that already, head
over to their site and follow their install instructions.

Installing TypeDoc is available as a node package. Using `npm` ensures that all relevant
dependencies are setup correctly. You can choose to either install locally to your project or
globally to the CLI.

TypeDoc aims to support the two latest TypeScript releases for the latest release. Depending on the scale of breaking
changes introduced in a new TypeScript version, a given version may support more versions of TypeScript.

| TypeDoc Version | TypeScript Version(s) |
| --------------- | --------------------- |
| 0.25            | 4.6 through 5.2       |
| 0.24            | 4.6 through 5.1       |
| 0.23            | 4.6 through 5.0       |
| 0.22            | 4.0 through 4.7       |
| 0.21            | 4.0 through 4.4       |
| 0.20            | 3.9 through 4.2       |
| 0.19            | 3.9 through 4.0       |

## Installation

If you want to use TypeDoc from your command line in a project, use the API in your project code, or TypeDoc in an npm script, a local installation is the recommended approach. First install TypeDoc in your project:

```bash
$ npm install typedoc --save-dev
```

or via yarn

```bash
$ yarn add -D typedoc
```

By saving TypeDoc to the project `package.json` file with the previous command, anyone who runs
`npm install` on the project will have typedoc installed at the specific version required for the project.

The name of TypeDoc's executable is `typedoc`. To verify that it works, you can now invoke the CLI in your project using `npx` (`npx` is a tool bundled with `npm`), passing TypeDoc the `--version` argument:

```bash
$ npx typedoc --version

TypeDoc 0.23.0
Using TypeScript 4.7.2 from /home/gerrit/typedoc/node_modules/typescript/lib
```

## Command line interface

The CLI can be used both from your terminal or from npm scripts. All arguments that are not passed
with flags are parsed as entry points. Use either the `--out` or `--json`
arguments to define the format and destination of your documentation.

```bash
typedoc --out docs src/index.ts
```

### JSON Configuration

Instead of passing all arguments via the command line, the CLI also supports reading TypeDoc configuration from json files.

### typedoc.json

When running typedoc from the CLI, you can define options in a json file named `typedoc.json`.

```json
{
    // Comments are supported, like tsconfig.json
    "entryPoints": ["src/index.ts"],
    "out": "docs"
}
```

### tsconfig.json

TypeDoc options can be defined within an existing `tsconfig.json` file. Use a `typedocOptions` section to define
options as a json model.

```json
{
    "compilerOptions": {
        "normalTypeScriptOptions": "here"
    },
    "typedocOptions": {
        "entryPoints": ["src/index.ts"],
        "out": "docs"
    }
}
```

## Node module

If you would like dynamic configuration or would like to run typedoc without using the CLI, import
the node module and build the documentation yourself.

```javascript
const TypeDoc = require("typedoc");

async function main() {
    // Application.bootstrap also exists, which will not load plugins
    // Also accepts an array of option readers if you want to disable
    // TypeDoc's tsconfig.json/package.json/typedoc.json option readers
    const app = await TypeDoc.Application.bootstrapWithPlugins({
        entryPoints: ["src/index.ts"],
    });

    const project = await app.convert();

    if (project) {
        // Project may not have converted correctly
        const outputDir = "docs";

        // Rendered docs
        await app.generateDocs(project, outputDir);
        // Alternatively generate JSON output
        await app.generateJson(project, outputDir + "/documentation.json");
    }
}

main().catch(console.error);
```

### Integrating with Docusaurus

Assuming we have a react project called **my-app** and inside `my-app` directory there is a Docusaurus-generated
project at `my-app/doc` directory, we will simply put up the script above with slight modifications:

- The file is **docs/scripts/typedoc.js**
- The **my-app**'s `tsconfig.json` is in the parent directory of docusaurus doc directory
- We will also be having image-enriched TypeDoc so we configure `media` options in `app.bootstrap`
- The generated TypeDoc HTML will be co-located with Docusaurus doc build; so it will be under **./build/api**. In the
  mean time, the Docusaurus `build` command will be `"build": "docusaurus build && node scripts/typedoc.js"`

```javascript
const TypeDoc = require("typedoc");

async function main() {
  const app = new TypeDoc.Application();

  // Ask TypeDoc to load tsconfig.json and typedoc.json files
  app.options.addReader(new TypeDoc.TSConfigReader());
  app.options.addReader(new TypeDoc.TypeDocReader());

  app.bootstrap({
    // typedoc options
    entryPoints: [
      "../src/components/SomeDeclaration.d.ts",
      "../src/components/SomeComponent.tsx"
    ],
    tsconfig: "../tsconfig.json",
    media: "static/img/typedoc"
  });

  const project = app.convert();

  // Project has converted correctly
  if (project) {
    const outputDir = "./build/api";

    // Rendered docs
    await app.generateDocs(project, outputDir);
    // Alternatively generate JSON output
    await app.generateJson(project, outputDir + "/documentation.json");
  }
}

main().catch(console.error);
```

Since TypeDoc depends on my-apps tsconfig.json(`../tsconfig.json`), we need to run `npm install` in `my-app` directory
and then `yarn` in `docs` directory to compile everything. For example, to

```yaml
---
name: Release

"on":
  push:
    branches:
      - master
        
env:
  USER: YOUR_GITHUB_USERNAME  # replace this with your username
  EMAIL: YOUR_GITHUB_EMAIL    # replace this with your email

jobs:
  test:
    uses: ./.github/workflows/test.yml
    secrets: inherit

  deploy-documentation:
    needs: test
    name: Deploy Documentation to GitHub Pages
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./docs/
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies of the documented project so that TypeDoc process source files properly
        run: |
          cd ../
          yarn install  # or 'npm install'
      - name: Install doc dependencies
        run: yarn install
      - name: Build documentation
        run: yarn build
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs/build
          user_name: ${{ env.USER }}
          user_email: ${{ env.EMAIL }}
```

At this point, we can run `yarn build` inside `my-app/doc`. When my-app is using TypeScript, however, the 
"Cannot find module error when importing an static file using typescript" error might occur. We deal with it by
[creating a `.d.ts` file `src/my-app-env.d.ts`](https://github.com/parcel-bundler/parcel/issues/1445#issuecomment-392339363)
and put :

```javascript
/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production" | "test";
    readonly PUBLIC_URL: string;
  }
}

declare module "*.avif" {
  const src: string;
  export default src;
}

declare module "*.bmp" {
  const src: string;
  export default src;
}

declare module "*.gif" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  import * as React from "react";

  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;

  const src: string;
  export default src;
}

declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.module.scss" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.module.sass" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
```
