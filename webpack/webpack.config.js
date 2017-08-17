const webpack = require('webpack');
const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ROOT_DIR = path.resolve(__dirname, '..');
const BUILD_DIR = path.resolve(__dirname, '..', 'dist', 'client');
const APP_DIR = path.resolve(__dirname, ROOT_DIR, 'app');
const NODE_MODULES = path.resolve(__dirname, '..', 'node_modules');
const VIEWS_DIR = path.resolve(__dirname, '..', 'views');

const release = process.env.NODE_ENV === 'production';

const debug = !release;

const plugins = [
  new ExtractTextPlugin({
    filename: '[name].css'
  }),
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.DefinePlugin({
    // This is needed for React to properly do production builds
    'process.env.debug': debug,
    'process.env.NODE_ENV': JSON.stringify(release ? 'production' : 'development'),
    __PRODUCTION__: release,
    __REST_API_URL__: JSON.stringify(process.env.REST_API_URL || 'https://plugins.jenkins.io/api'),
    __HEADER_FILE__: JSON.stringify(process.env.HEADER_FILE || 'https://jenkins.io/plugins/index.html')
  }),
  new webpack.LoaderOptionsPlugin({
    debug,
    options: {
      context: __dirname
    }
  })
];

if (release) {
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    sourceMap: false,
    mangle: false,
    compress: {
      warnings: false
    }
  }));
} else {
  plugins.push(new HtmlWebpackPlugin({
    template: path.resolve(VIEWS_DIR, 'index.hbs'),
    filename: 'index.html',
    inject: false
  }));
}

const config = {
  context: ROOT_DIR,
  devtool: 'source-map',
  entry: [
    'babel-polyfill',
    path.join(APP_DIR, 'index')
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [
          'babel-loader'
        ],
        exclude: NODE_MODULES
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1
            }
          },
          'postcss-loader'
        ],
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
  plugins,
  resolve: {
    extensions: ['.js', '.jsx']
  }
};

module.exports = config;
