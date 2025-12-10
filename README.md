# rsbuild-plugin-stylelint

An Rsbuild plugin to run Stylelint checks during the compilation.

The plugin has integrated [stylelint-webpack-plugin](https://www.npmjs.com/package/stylelint-webpack-plugin) internally.

> We do not recommend using the `rsbuild-plugin-stylelint` plugin, as running Stylelint during the build process will significantly increase the build time. Instead, we recommend using a separate `lint` command to run Stylelint checks.

<p>
  <a href="https://npmjs.com/package/rsbuild-plugin-stylelint">
   <img src="https://img.shields.io/npm/v/rsbuild-plugin-stylelint?style=flat-square&colorA=564341&colorB=EDED91" alt="npm version" />
  </a>
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square&colorA=564341&colorB=EDED91" alt="license" />
  <a href="https://npmcharts.com/compare/rsbuild-plugin-stylelint?minimal=true"><img src="https://img.shields.io/npm/dm/rsbuild-plugin-stylelint.svg?style=flat-square&colorA=564341&colorB=EDED91" alt="downloads" /></a>
</p>

## Usage

Install:

```bash
npm add rsbuild-plugin-stylelint -D
```

Add plugin to your `rsbuild.config.ts`:

```ts
// rsbuild.config.ts
import { pluginStylelint } from "rsbuild-plugin-stylelint";

export default {
  plugins: [pluginStylelint()],
};
```

## Options

### enable

Whether to enable Stylelint checking.

- **Type:** `boolean`
- **Default:** `true`
- **Example:**

Disable Stylelint checking:

```js
pluginStylelint({
  enable: false,
});
```

Enable Stylelint checking only during production builds:

```js
pluginStylelint({
  enable: process.env.NODE_ENV === "production",
});
```

Enable Stylelint checking only during development builds:

```js
pluginStylelint({
  enable: process.env.NODE_ENV === "development",
});
```

### stylelintPluginOptions

To modify the options of `stylelint-webpack-plugin`, please refer to [stylelint-webpack-plugin - README](https://github.com/webpack/stylelint-webpack-plugin#readme) to learn about available options.

- **Type:** [Options](https://github.com/webpack/stylelint-webpack-plugin/blob/main/types.d.ts)
- **Default:**

```ts
const defaultOptions = {
  extensions: ["css", "scss", "sass"],
  exclude: [
    "node_modules",
    "dist", // -> rsbuildConfig.output.distPath.root
  ],
};
```

The `stylelintPluginOptions` object will be shallowly merged with the default configuration object.

- For example, enable auto-fix:

```ts
pluginStylelint({
  stylelintPluginOptions: {
    fix: true,
  },
});
```

- For example, exclude some files using `exclude`:

```ts
pluginStylelint({
  stylelintPluginOptions: {
    exclude: ["node_modules", "dist", "./src/legacy.css"],
  },
});
```

- Configure custom formatter:

```ts
pluginStylelint({
  stylelintPluginOptions: {
    formatter: "string",
  },
});
```

## License

[MIT](./LICENSE).
