const webpack       = require( 'webpack' );
const path          = require( 'path' );
const nodeExternals = require( 'webpack-node-externals' );
// const BundleAnalyzerPlugin = require( 'webpack-bundle-analyzer' ).BundleAnalyzerPlugin;

const OutputBaseDirectory = path.join( __dirname, './dist' );
const ResourcePath = path.resolve( __dirname, './src/' );

const WEBPACK_CONFIG = {
  entry  : './src/index.js',
  output : {
    filename                      : 'app.js',
    path                          : OutputBaseDirectory,
    devtoolModuleFilenameTemplate : ResourcePath,
  },
  devtool      : 'source-map',
  watch        : true,
  watchOptions : {
    aggregateTimeout : 300,
    ignored          : /node_modules/,
  },
  externals : [nodeExternals()],
  module    : {
    rules : [
      {
        test    : /\.js$/,
        exclude : /(node_modules|bower_components)/,
        enforce : 'pre',
        use     : {
          loader  : 'eslint-loader',
          options : {
            failOnWarning : false,
            failOnError   : false,
          },
        },
      },
      {
        test    : /\.js$/,
        exclude : /(node_modules|bower_components)/,
        use     : {
          loader : 'babel-loader',
        },
      },
    ],
  },
  target : 'node',
  node   : {
    __dirname  : true,
    global     : true,
    process    : true,
    __filename : true,
  },
  plugins : [
    new webpack.LoaderOptionsPlugin( {
      debug : true,
    } ),
    new webpack.DefinePlugin( {
      'process.env' : {
        NODE_ENV : JSON.stringify( 'local' ),
      },
    } ),
  ],
};

module.exports = WEBPACK_CONFIG;
