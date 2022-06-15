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
    node: {
        __dirname: false,
        __filename: false,
    },
    target: 'node',
    externals: [ 'selenium-webdriver', 'chromedriver', 'ws', 'redis', 'express' ],
};