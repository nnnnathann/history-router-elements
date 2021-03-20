/* eslint-env node */
import { mkdirSync, writeFileSync, copyFileSync, rmdirSync } from "fs"
import { resolve, basename } from "path"
import pkg from "../package.json"

const outdir = "packages/history-router-elements"

rmdirSync(outdir, { recursive: true })
mkdirSync(outdir, { recursive: true })

copyFileSync("README.md", resolve(outdir, "README.md"))

const { devDependencies, scripts, main, module, browser, ...publicFields } = pkg
const buildData = [["main", main], ["module", module], ["browser", browser]].reduce((bd, [key, file]) => {
    const base = basename(file)
    const infile = resolve(file)
    const outfile = resolve(outdir, base)
    copyFileSync(infile, outfile)
    return { ...bd, [key]: base, files: [...bd.files, base] }
}, { files: [] } as any)

writeFileSync(resolve(outdir, "package.json"), JSON.stringify({
    ...publicFields,
    ...buildData,
}, null, 2))

export { }