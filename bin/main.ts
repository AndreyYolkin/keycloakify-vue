#!/usr/bin/env node
import { NOT_IMPLEMENTED_EXIT_CODE, readParams } from './core';

const { buildContext, commandName } = readParams({ apiVersion: 'v1' });

(async () => {
  switch (commandName) {
    case 'update-kc-gen': {
      const { command } = await import('./update-kc-gen');
      await command({ buildContext });
      return;
    }
    case 'eject-page': {
      const { command } = await import('./eject-page');
      await command({ buildContext });
      return;
    }
    case 'add-story': {
      const { command } = await import('./add-story');
      await command({ buildContext });
      return;
    }
    case 'initialize-account-theme': {
      const { command } = await import('./initialize-account-theme/index');
      await command({ buildContext });
      return;
    }
    default:
      process.exit(NOT_IMPLEMENTED_EXIT_CODE);
  }
})();
