var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var config = {
    context: __dirname + '/src',
    entry: {
        app: './js/main.js'
    },
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js'
    },
    devServer: {
        open: false,
        contentBase: __dirname + '/src',
        hot: false,
        inline: false
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015'],
                    plugins: ["transform-async-to-generator"]
                }
            }
        ],
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: 'css-loader'
                })
            }
        ]
    },

    stats: {
        colors: true
    },

    devtool: "source-map",

    plugins: [
        new ExtractTextPlugin('styles.css'),
    ]
};

module.exports = config;