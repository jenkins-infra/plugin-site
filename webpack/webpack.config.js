const webpack = require('webpack');
const path = require('path');
const cssnext = require('postcss-cssnext');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ROOT_DIR = path.resolve(__dirname, '..');
const BUILD_DIR = path.resolve(__dirname, '..', 'dist', 'client');
const APP_DIR = path.resolve(__dirname, ROOT_DIR, 'app');
const NODE_MODULES = path.resolve(__dirname, '..', 'node_modules');
const VIEWS_DIR = path.resolve(__dirname, '..', 'views');

const plugins = [
  new ExtractTextPlugin('[name].css'),
  new webpack.NoErrorsPlugin()
];

const release = process.env.NODE_ENV === 'production';

if (release) {
  plugins.push(new webpack.DefinePlugin({
    'process.env': JSON.stringify({
      debug: false,
      NODE_ENV: 'production',
      REST_API_URL: process.env.REST_API_URL,
    })
  }));
  plugins.push(new webpack.optimize.DedupePlugin());
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    sourceMap: false,
    mangle: false,
    compress: {
      warnings: false
    }
  }));
  plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
} else {
  plugins.push(new HtmlWebpackPlugin({
    template: path.resolve(VIEWS_DIR, 'index.hbs'),
    filename: 'index.html',
    inject: false
  }));
  plugins.push(new webpack.DefinePlugin({
    'process.env': JSON.stringify({
      debug: true,
      NODE_ENV: 'development',
      REST_API_URL: process.env.REST_API_URL
    })
  }));
}

const config = {
  context: ROOT_DIR,
  debug: !release,
  devtool: 'source-map',
  entry: [
    'babel-polyfill',
    path.join(APP_DIR, 'index')
  ],
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loaders: ['babel'],
        exclude: NODE_MODULES
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader?modules&importLoaders=1!postcss-loader',
        exclude: NODE_MODULES
      },
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader',
        include: VIEWS_DIR,
        query: {
          partialDirs: [
            path.join(VIEWS_DIR, 'partials')
          ]
        }
      }
    ]
  },
  output: {
    path: BUILD_DIR,
    filename: '[name].js',
    publicPath: '/'
  },
  plugins: plugins,
  postcss: function () {
    return [cssnext];
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
};

module.exports = config;
