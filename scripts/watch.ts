import chalk from 'chalk';
import * as fs from 'fs';
import { join as pathJoin } from 'path';
import { run } from './shared/run';
import { getThisCodebaseRootDirPath } from './tools/getThisCodebaseRootDirPath';

const rootDirPath = getThisCodebaseRootDirPath();
const WATCH_SENTINEL = 'Watching for file changes';

function build() {
  try {
    run('tsx scripts/build.ts', { cwd: rootDirPath });
  } catch (e) {
    console.error(e);
  }
}

build();
console.log(chalk.cyan(WATCH_SENTINEL));

let timeout: NodeJS.Timeout | undefined;
for (const dir of ['src', 'bin']) {
  fs.watch(pathJoin(rootDirPath, dir), { recursive: true }, () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      build();
      console.log(chalk.cyan(WATCH_SENTINEL));
    }, 300);
  });
}
