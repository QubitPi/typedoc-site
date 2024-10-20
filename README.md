# TypeDoc homepage

Holds the contents of https://typedoc.org.
GitHub pages renders the website from the `gh-pages` branch, using the `_site/` folder.

## Reporting Issues

Please report issues to the [TypeStrong/typedoc](https://github.com/TypeStrong/typedoc) repo for better visibility.

## Writing guides

Guides are stored in the `guides/` directory and written in Markdown. Each file should contain the following header section with an appropriate title and menu order.

```
---
layout: 'guide'
title: 'Installation'
menuOrder: 1
---
```

## Building the site locally

```bash
npm i
npm run serve
```

To regenerate the `_site/api/` folder, go to the root directory of
typedoc-site and clone the typedoc repo (the `typedoc` folder is in
`.gitignore`). Then run:

```bash
cd typedoc
npm i
npm run build
node bin/typedoc --options ../typedoc.json
```

To regenerate the `_site/example/` folder:

```bash
cd typedoc/example
npm i
node ../bin/typedoc --options ../../example.typedoc.json
```

If new options have been added since the last update, run the following to
update the typedoc.json schema:

```bash
node typedoc/scripts/generate_options_schema.js _site/schema.json
```

## License

The use and distribution terms for [typedoc-site](https://qubitpi.github.io/typedoc-site/) are covered by the
[Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0.html).

<div align="center">
    <a href="https://opensource.org/licenses">
        <img align="center" width="50%" alt="License Illustration" src="https://github.com/QubitPi/QubitPi/blob/master/img/apache-2.png?raw=true">
    </a>
</div>
