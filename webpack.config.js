const HtmlWebpackPlugin = require("html-webpack-plugin")
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const isProduction = process.env.NODE_ENV === "production"
module.exports = {
    entry: "./src/history-router.ts",
    devServer: {
        historyApiFallback: true
    },
    mode: isProduction ? "production" : "development",
    resolve: {
        extensions: [".ts", ".js", ".json"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ["babel-loader"]
            }
        ]
    },
    devtool: "eval-source-map",
    plugins: [
        new HtmlWebpackPlugin({ template: "./index.html" }),
        ...(isProduction
            ? [new BundleAnalyzerPlugin({ analyzerMode: "static", openAnalyzer: false })]
            : []),
    ]
}