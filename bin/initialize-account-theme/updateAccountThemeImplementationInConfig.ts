import chalk from 'chalk';
import * as fs from 'fs';
import { join as pathJoin } from 'path';
import { assert } from 'tsafe/assert';
import type { BuildContext } from '../core';

export type BuildContextLike = {
  bundler: BuildContext['bundler'];
  projectDirPath: string;
  packageJsonFilePath: string;
};

assert<BuildContext extends BuildContextLike ? true : false>();

export function updateAccountThemeImplementationInConfig(params: {
  buildContext: BuildContext;
  accountThemeType: 'Multi-Page';
}) {
  const { buildContext, accountThemeType } = params;

  switch (buildContext.bundler) {
    case 'vite':
      {
        const viteConfigPath = pathJoin(buildContext.projectDirPath, 'vite.config.ts');

        if (!fs.existsSync(viteConfigPath)) {
          console.log(
            chalk.bold(
              `You must manually set the accountThemeImplementation to "${accountThemeType}" in your vite config`,
            ),
          );
          break;
        }

        const viteConfigContent = fs.readFileSync(viteConfigPath).toString('utf8');

        const modifiedViteConfigContent = viteConfigContent.replace(
          /["']?accountThemeImplementation["']?\s*:\s*["']none["']/,
          `accountThemeImplementation: '${accountThemeType}'`,
        );

        if (modifiedViteConfigContent === viteConfigContent) {
          console.log(
            chalk.yellow(
              `You must manually set the accountThemeImplementation to "${accountThemeType}" in your vite.config.ts`,
            ),
          );
          break;
        }

        fs.writeFileSync(viteConfigPath, modifiedViteConfigContent);
      }
      break;
    case 'webpack':
      {
        const parsedPackageJson = JSON.parse(
          fs.readFileSync(buildContext.packageJsonFilePath).toString('utf8'),
        ) as Record<string, unknown>;

        if (
          typeof parsedPackageJson['keycloakify'] !== 'object' ||
          parsedPackageJson['keycloakify'] === null ||
          Array.isArray(parsedPackageJson['keycloakify'])
        ) {
          console.log(
            chalk.yellow(
              `You must manually set the accountThemeImplementation to "${accountThemeType}" in your package.json keycloakify config`,
            ),
          );
          break;
        }

        const keycloakifyConfig = parsedPackageJson['keycloakify'] as Record<string, unknown>;
        keycloakifyConfig.accountThemeImplementation = accountThemeType;

        fs.writeFileSync(
          buildContext.packageJsonFilePath,
          Buffer.from(JSON.stringify(parsedPackageJson, undefined, 4), 'utf8'),
        );
      }
      break;
  }
}
