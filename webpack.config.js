//import { path } from 'path';
const path = require('path')
    //import { CleanWebpackPlugin } from 'clean-webpack-plugin';
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

//import { MiniCssExtractPlugin } from 'mini-css-extract-plugin';
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

//import { HtmlWebpackPlugin } from 'html-webpack-plugin';
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (env, options) => {
    const isProduction = options.mode === 'production';

    const config = {
        mode: isProduction ? 'production' : 'development',
        devtool: isProduction ? false : 'source-map',
        watch: !isProduction,
        entry: ['./src/index.js'],
        output: {
            filename: 'bundle.js',
            path: path.join(__dirname, '/build'),
        },
        module: {
            rules: [{
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            }, {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader',
                ],
            }, {
                test: /\.(png|svg|jpe?g|gif|ttf)$/,
                use: {
                    loader: 'file-loader',
                },
            }, {
                test: /\.html$/,
                use: {
                    loader: 'html-loader',
                },
            }, ],
        },

        plugins: [
            isProduction ? new CleanWebpackPlugin() : () => {},
            new HtmlWebpackPlugin({
                // favicon: './src/img/favicon.ico',
                template: './src/index.html',
            }),
            new MiniCssExtractPlugin({
                filename: 'style.css',
            }),
        ],
    };

    return config;
};