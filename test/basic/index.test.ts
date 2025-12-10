import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';
import { createRsbuild } from '@rsbuild/core';
import { pluginStylelint } from '../../src';
import { proxyConsole } from '../helper';

const __dirname = dirname(fileURLToPath(import.meta.url));

const EXPECTED_ERROR_MESSAGE = 'build failed';
const STYLELINT_ERROR_NAMED_COLOR = 'Unexpected named color';

test.describe('Stylelint Plugin', () => {
  test('should throw error when Stylelint errors exist', async () => {
    const { logs, restore } = proxyConsole();

    const rsbuild = await createRsbuild({
      cwd: __dirname,
      rsbuildConfig: {
        plugins: [pluginStylelint()],
      },
    });

    await expect(rsbuild.build()).rejects.toThrowError(EXPECTED_ERROR_MESSAGE);

    const hasExpectedError = logs.some((log) =>
      log.includes(STYLELINT_ERROR_NAMED_COLOR),
    );
    expect(hasExpectedError).toBe(true);

    restore();
  });

  test('should not throw error when files are excluded', async () => {
    const rsbuild = await createRsbuild({
      cwd: __dirname,
      rsbuildConfig: {
        plugins: [
          pluginStylelint({
            stylelintPluginOptions: {
              exclude: ['node_modules', './src/**/*.css', './src/**/*.scss'],
            },
          }),
        ],
      },
    });

    const buildResult = await rsbuild.build();
    expect(buildResult).toBeDefined();
  });

  test('should not throw error when plugin is disabled', async () => {
    const rsbuild = await createRsbuild({
      cwd: __dirname,
      rsbuildConfig: {
        plugins: [pluginStylelint({ enable: false })],
      },
    });

    const buildResult = await rsbuild.build();
    expect(buildResult).toBeDefined();
  });

  test('should check CSS files even if not imported in compilation', async () => {
    const { logs, restore } = proxyConsole();

    const rsbuild = await createRsbuild({
      cwd: __dirname,
      rsbuildConfig: {
        plugins: [pluginStylelint()],
      },
    });

    await expect(rsbuild.build()).rejects.toThrowError(EXPECTED_ERROR_MESSAGE);

    const hasUnusedCssError = logs.some((log) => log.includes('unused.css'));
    expect(hasUnusedCssError).toBe(true);

    restore();
  });

  test('should only run once in multi-environment builds', async () => {
    const { logs, restore } = proxyConsole();

    const rsbuild = await createRsbuild({
      cwd: __dirname,
      rsbuildConfig: {
        plugins: [pluginStylelint()],
        environments: {
          web: {
            output: {
              target: 'web',
            },
          },
          node: {
            output: {
              target: 'node',
            },
          },
        },
      },
    });

    await expect(rsbuild.build()).rejects.toThrowError(EXPECTED_ERROR_MESSAGE);

    const stylelintLog = logs.find((log) => log.includes('[stylelint]'));
    expect(stylelintLog).toBeDefined();

    const stylelintOccurrences =
      stylelintLog?.match(/\[stylelint\]/g)?.length ?? 0;
    expect(stylelintOccurrences).toBe(1);

    restore();
  });

  test('should check SCSS files', async () => {
    const { logs, restore } = proxyConsole();

    const rsbuild = await createRsbuild({
      cwd: __dirname,
      rsbuildConfig: {
        plugins: [pluginStylelint()],
      },
    });

    await expect(rsbuild.build()).rejects.toThrowError(EXPECTED_ERROR_MESSAGE);

    const hasScssError = logs.some((log) => log.includes('styles.scss'));
    const hasNamedColorError = logs.some((log) =>
      log.includes(STYLELINT_ERROR_NAMED_COLOR),
    );

    expect(hasScssError).toBe(true);
    expect(hasNamedColorError).toBe(true);

    restore();
  });
});
