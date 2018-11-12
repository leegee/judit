const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const assets = [];

module.exports = {
    entry: './src/index.js',
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].bundle.js'
    },
    // resolve: {
    //     modules: ['lib', 'node_modules'],
    // },
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