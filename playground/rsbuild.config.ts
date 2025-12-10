import { defineConfig } from '@rsbuild/core';
import { pluginStylelint } from '../src';

export default defineConfig({
  plugins: [pluginStylelint()],
});
