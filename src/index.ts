import path from 'node:path';
import type { RsbuildPlugin } from '@rsbuild/core';
import type { Options } from 'stylelint-webpack-plugin';

export type PluginStylelintOptions = {
  /**
   * Whether to enable Stylelint checking.
   * @default true
   */
  enable?: boolean;
  /**
   * To modify the options of `stylelint-webpack-plugin`.
   * @see https://github.com/webpack/stylelint-webpack-plugin
   */
  stylelintPluginOptions?: Options;
};

export const PLUGIN_STYLELINT_NAME = 'rsbuild:stylelint';

export const pluginStylelint = (
  options: PluginStylelintOptions = {},
): RsbuildPlugin => ({
  name: PLUGIN_STYLELINT_NAME,

  setup(api) {
    const { enable = true, stylelintPluginOptions } = options;

    if (!enable) {
      return;
    }

    api.modifyBundlerChain(async (chain, { environment }) => {
      const { distPath } = environment;

      // Only apply stylelint plugin to the first environment
      // to avoid multiple stylelint running at the same time
      if (environment.index !== 0) {
        return;
      }

      const StylelintPluginModule = await import('stylelint-webpack-plugin');
      // Fix ESM-CJS interop issue
      const StylelintPlugin =
        StylelintPluginModule.default || StylelintPluginModule;

      const defaultOptions: Options = {
        extensions: ['css', 'scss', 'sass'],
        exclude: [
          'node_modules',
          path.relative(api.context.rootPath, distPath),
        ],
      };

      chain.plugin('stylelint').use(StylelintPlugin, [
        {
          ...defaultOptions,
          ...stylelintPluginOptions,
        },
      ]);
    });
  },
});
