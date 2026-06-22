import { chmodSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const binDir = join(repoDir, "node_modules", ".bin");
const tsxBin = join(binDir, "tsx");
const handlerEntry = join(repoDir, "bin", "main.ts");
const shimPath = join(binDir, "_keycloakify-custom-handler");

if (!existsSync(binDir)) {
    mkdirSync(binDir, { recursive: true });
}

const shim = `#!/bin/sh\nexec "${tsxBin}" "${handlerEntry}" "$@"\n`;
writeFileSync(shimPath, shim);
chmodSync(shimPath, 0o755);

console.log(`Linked _keycloakify-custom-handler -> ${handlerEntry}`);
