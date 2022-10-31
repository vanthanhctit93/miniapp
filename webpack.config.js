'use strict';

const path                 	   = require('path');
const webpack              	   = require('webpack');
const { CleanWebpackPlugin }   = require('clean-webpack-plugin');
const HtmlWebpackPlugin    	   = require('html-webpack-plugin');
const UglifyJsPlugin           = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: [
        'babel-polyfill',
        './src/sandbox.js'
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: process.env.NODE_ENV === 'development' ? 'bundle.js' : 'js/main.bundle.js',
        publicPath: process.env.NODE_ENV === 'development' ? '/' : '',
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                loader: 'html-loader',
            },
            {
                test: /\.js$/,
                exclude: '/node_modules/',
                use: {
                    loader: 'babel-loader',
                    options: {
                        babelrc: false,
                        compact: true,
                        presets: ['@babel/preset-env']
                    }
                }
            },
        ]
    },
    resolve: { 
        extensions: [ '*', '.js', '.json' ],
        alias: { 
            '@': path.join(__dirname, 'src')
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
            process: 'process/browser'
        }),
    ],
    performance: {
        hints: false
    },
    // devtool: 'eval-source-map',
}
if (process.env.NODE_ENV === 'development'){
    module.exports.mode = 'development'
    module.exports.plugins = (module.exports.plugins || []).concat([
        new HtmlWebpackPlugin({ 
            template: './index.html', 
        }),
    ])
    module.exports.devServer = {
        compress: true,
        historyApiFallback: true,
        inline: true, // Live Reloading, set in Boolean style.
        hot: true, //Hot Module Replacement, set in Boolean style.
        open: 'chrome', //Windows OS is 'chrome' || Linux OS is 'google-chrome'
        overlay: true,
        port: 8282, // Port default is 8080.
    }
} else {
    module.exports.mode = 'production'
  	// module.exports.devtool = 'source-map'
    module.exports.optimization = {
        minimizer: [
            new HtmlWebpackPlugin({
                template: './index.html',
                minify: {
                    removeAttributeQuotes: true,
                    collapseWhitespace: true,
                    removeComments: true
                }
            }),
        ]
    }
  	module.exports.plugins = (module.exports.plugins || []).concat([
	    new webpack.DefinePlugin({
	      	'process.env.NODE_ENV': JSON.stringify('production')
	    }),
        new CleanWebpackPlugin(),
        new UglifyJsPlugin(),
  	])
}
