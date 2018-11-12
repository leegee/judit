/* eslint-env node */

const path = require('path');

module.exports = {
    entry: './src/index.js',
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].bundle.js',
        publicPath: 'build',
    },
    devtool: 'cheap-source-map',
    devServer: {
        inline: true,
        port: 8080
    },
    module: {
        rules: [
            // { test: /masonry-layout/, loader: 'imports-loader?define=>false&this=>window' },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: [
                        "@babel/preset-env"
                    ]
                }
            }
        ],
    },
    // plugins: [
    //     new CopyWebpackPlugin(
    //         assets.map(asset => {
    //             return {
    //                 from: path.resolve(__dirname, 'node_modules/' + asset),
    //                 to: path.resolve(__dirname, 'build/lib')
    //             };
    //         })
    //     )
    // ],
};