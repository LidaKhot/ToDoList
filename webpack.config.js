// Imports: Dependencies
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


// Webpack Configuration
const config = {

    // Entry
    entry: './src/index.js',
    // Output
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'main.js',
        // publicPath: 'dist/'
    },
    devServer: {
        overlay: true
    },
        // Loaders
    module: {
        rules: [
            // JavaScript/JSX Files
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-env"]
                },
            },
            // CSS Files
            {
                test: /\.s[ac]ss$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: { sourceMap: true }
                    }, {
                        loader: 'sass-loader',
                        options: { sourceMap: true }
                    }

                ]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            }
        ]
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: "main.css",
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ]  


};
// Exports
module.exports = config;