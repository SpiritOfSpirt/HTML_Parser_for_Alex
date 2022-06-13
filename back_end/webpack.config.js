const webpack = require("webpack");

module.exports = {
    entry: `./src/index.ts`,
    output: {
        path: __dirname,
        filename: 'index.js',
        libraryTarget: 'commonjs'
    },
    module: {
        rules: [{
            test: /\.ts$/,
            loader: "ts-loader",
            exclude: /node_modules/
        }]
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    plugins: [
        new webpack.HashedModuleIdsPlugin({
            context: __dirname,
            hashFunction: "sha256",
            hashDigest: "hex",
            hashDigestLength: 20,
        }),    
    ],
    node: {
        __dirname: false,
        __filename: false,
    },
    target: 'node',
};