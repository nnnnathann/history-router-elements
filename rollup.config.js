/* eslint-env node */
import babel from "@rollup/plugin-babel"
import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import html from "@rollup/plugin-html"
import serve from "rollup-plugin-serve"
import replace from "@rollup/plugin-replace"
import { terser } from "rollup-plugin-terser"
import { readFileSync } from "fs"
import pkg from "./package.json"

export default {
    input: "src/history-router-elements.ts",
    output: [
        { file: pkg.main, format: "cjs" },
        { name: "history-router", file: pkg.browser, format: "umd" },
        { file: pkg.module, format: "es" }
    ],
    plugins: [
        resolve({
            extensions: [".ts", ".js", ".mjs"]
        }),
        replace({
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
            "preventAssignment": true
        }),
        commonjs(),
        babel({
            babelHelpers: "bundled",
            exclude: "node_modules/**",
            extensions: [".ts", ".js"]
        }),
        html({
            template() {
                // const mjs = "<script defer type=\"module\" src=\"/history-router.mjs\"></script>"
                const umd = "<script defer src=\"/history-router.umd.js\"></script>"
                const format = umd
                return readFileSync("index.html", { encoding: "utf-8" })
                    .replace("<!-- {{scripts}} -->", format)
            }
        }),
        ...(process.env.NODE_ENV === "production" ? [terser()] : [serve({ contentBase: "dist", historyApiFallback: true })])
    ]
}