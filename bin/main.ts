#!/usr/bin/env -S npx tsx
import { NOT_IMPLEMENTED_EXIT_CODE, readParams } from "./core";

const { buildContext, commandName } = readParams({ apiVersion: "v1" });

(async () => {
    switch (commandName) {
        case "update-kc-gen": {
            const { command } = await import("./update-kc-gen");
            await command({ buildContext });
            return;
        }
        default:
            process.exit(NOT_IMPLEMENTED_EXIT_CODE);
    }
})();
