var webpack = require('webpack')
var path = require('path')

module.exports = {
   plugins: [],
   entry: './entry.js',
   output: {
       path: path.resolve(__dirname, './dist'),
       filename: 'index.js'
   },
   module: {
       rules: [
            { 
                test: /\.css$/, 
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader:'postcss-loader',
                        options: {
                            plugins: function() {
                                return [
                                    require('precss'),
                                    require('autoprefixer')
                                ]
                            }
                        }
                    }
                ]
            },
            { 
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader:'postcss-loader',
                        options: {
                            plugins: function() {
                                return [
                                    require('precss'),
                                    require('autoprefixer')
                                ]
                            }
                        }
                    },
                    'sass-loader'
                ]
            },
            { 
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=8192'
            },
            { 
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            { 
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
       ]   
   }
}