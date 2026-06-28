import chalk from "chalk";
import * as esbuild from "esbuild";
import * as fs from "fs";
import { join as pathJoin, relative as pathRelative, sep as pathSep } from "path";
import { run } from "./shared/run";
import { getThisCodebaseRootDirPath } from "./tools/getThisCodebaseRootDirPath";

const PACKAGE_DIRNAME = "keycloakify-vue"; // dist/<this>/...

const rootDirPath = getThisCodebaseRootDirPath();
const distDirPath = pathJoin(rootDirPath, "dist");
const outDirPath = pathJoin(distDirPath, PACKAGE_DIRNAME);
const srcDirPath = pathJoin(rootDirPath, "src");

console.log(chalk.cyan(`Building @keycloakify/vue...`));
const startTime = Date.now();

// 1. Clean
fs.rmSync(distDirPath, { recursive: true, force: true });
fs.mkdirSync(outDirPath, { recursive: true });

// Recursively collect files under `src` matching a predicate, returning paths relative to `src`.
function crawl(predicate: (relPath: string) => boolean): string[] {
    const out: string[] = [];
    const walk = (abs: string) => {
        for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
            const childAbs = pathJoin(abs, entry.name);
            if (entry.isDirectory()) {
                walk(childAbs);
            } else {
                const rel = pathRelative(srcDirPath, childAbs).split(pathSep).join("/");
                if (predicate(rel)) out.push(rel);
            }
        }
    };
    walk(srcDirPath);
    return out;
}

const isTestFile = (rel: string) => /\.(test|spec)\./.test(rel);

// 2. Emit declarations (.d.ts + .vue.d.ts) via vue-tsc into outDir, preserving structure.
run(`npx vue-tsc -p tsconfig.build.json`, { cwd: rootDirPath });

// 3. Transpile .ts -> .js (skip .d.ts and test files), preserving structure.
const tsRelPaths = crawl(rel => rel.endsWith(".ts") && !rel.endsWith(".d.ts") && !isTestFile(rel));
esbuild.buildSync({
    entryPoints: tsRelPaths.map(rel => pathJoin(srcDirPath, rel)),
    outdir: outDirPath,
    outbase: srcDirPath,
    format: "esm",
    platform: "neutral",
    target: "es2022",
    bundle: false,
    sourcemap: false,
    logLevel: "info"
});

// 4. Copy raw .vue files verbatim, preserving structure.
const vueRelPaths = crawl(rel => rel.endsWith(".vue") && !isTestFile(rel));
for (const rel of vueRelPaths) {
    const dest = pathJoin(outDirPath, rel);
    fs.mkdirSync(pathJoin(dest, ".."), { recursive: true });
    fs.copyFileSync(pathJoin(srcDirPath, rel), dest);
}

// 5. Bundle the custom-handler bin (esbuild), set executable bit.
const binOutFilePath = pathJoin(outDirPath, "bin", "index.js");
fs.mkdirSync(pathJoin(binOutFilePath, ".."), { recursive: true });
{
    // Restore `require` under pure ESM for transitive require() (e.g. cli-select's require("readline")).
    const banner = "import { createRequire } from 'module'; const require = createRequire(import.meta.url);";
    run(
        `npx esbuild "${pathJoin(rootDirPath, "bin", "main.ts")}" --bundle --minify ` +
            `--external:prettier --platform=node --format=esm ` +
            `--log-override:direct-eval=silent --banner:js="${banner}" --outfile="${binOutFilePath}"`,
        { cwd: rootDirPath }
    );
    fs.chmodSync(
        binOutFilePath,
        fs.statSync(binOutFilePath).mode | fs.constants.S_IXUSR | fs.constants.S_IXGRP | fs.constants.S_IXOTH
    );
}

// 6. Copy metadata + raw src + stories into dist (mirror svelte: ship raw src & stories so eject-page/add-story work).
fs.copyFileSync(pathJoin(rootDirPath, "package.json"), pathJoin(distDirPath, "package.json"));
fs.copyFileSync(pathJoin(rootDirPath, "LICENSE"), pathJoin(distDirPath, "LICENSE"));
fs.copyFileSync(pathJoin(rootDirPath, "README.md"), pathJoin(distDirPath, "README.md"));
fs.cpSync(srcDirPath, pathJoin(distDirPath, "src"), { recursive: true });
fs.cpSync(pathJoin(rootDirPath, "stories"), pathJoin(distDirPath, "stories"), { recursive: true });

// 7. Generate the exports map by crawling the emitted package subtree.
const exportsMap: Record<string, { types: string; import: string; default: string }> = {};
const addExport = (subpath: string, file: string, dts: string) => {
    exportsMap[subpath] = {
        types: `./${PACKAGE_DIRNAME}/${dts}`,
        import: `./${PACKAGE_DIRNAME}/${file}`,
        default: `./${PACKAGE_DIRNAME}/${file}`
    };
};

// .vue entries: key keeps the .vue extension, types -> sibling .vue.d.ts
for (const rel of vueRelPaths) {
    if (!fs.existsSync(pathJoin(outDirPath, `${rel}.d.ts`))) continue;
    addExport(`./${rel}`, rel, `${rel}.d.ts`);
}
// .js entries (from .ts): key drops extension; "<dir>/index" also maps to "<dir>".
for (const rel of tsRelPaths) {
    const js = rel.replace(/\.ts$/, ".js");
    const dts = rel.replace(/\.ts$/, ".d.ts");
    if (!fs.existsSync(pathJoin(outDirPath, dts))) continue;
    const noExt = rel.replace(/\.ts$/, "");
    if (noExt.endsWith("/index")) {
        addExport(`./${noExt.slice(0, -"/index".length)}`, js, dts);
    } else {
        addExport(`./${noExt}`, js, dts);
    }
}

// 8. Write generated exports + bin field into dist/package.json.
{
    const distPkgPath = pathJoin(distDirPath, "package.json");
    const pkg = JSON.parse(fs.readFileSync(distPkgPath).toString("utf8"));
    pkg.exports = Object.fromEntries(Object.entries(exportsMap).sort(([a], [b]) => a.localeCompare(b)));
    pkg.bin = {
        "_keycloakify-custom-handler": pathRelative(distDirPath, binOutFilePath).split(pathSep).join("/")
    };
    fs.writeFileSync(distPkgPath, JSON.stringify(pkg, null, 2));
}

// 9. Lint the package.
run(`npx publint --pack npm`, { cwd: distDirPath });

console.log(chalk.green(`✓ built in ${((Date.now() - startTime) / 1000).toFixed(2)}s`));
