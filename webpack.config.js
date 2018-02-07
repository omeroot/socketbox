const path          = require( 'path' );
const nodeExternals = require( 'webpack-node-externals' );
// const BundleAnalyzerPlugin = require( 'webpack-bundle-analyzer' ).BundleAnalyzerPlugin;

const OutputBaseDirectory = path.join( __dirname, './dist' );
const ResourcePath = path.resolve( __dirname, './src/' );

const WEBPACK_CONFIG = {
  entry  : './src/index.js',
  output : {
    filename                      : 'socketbox.js',
    path                          : OutputBaseDirectory,
    devtoolModuleFilenameTemplate : ResourcePath,
    libraryTarget                 : 'umd',
  },
  devtool   : 'source-map',
  externals : [nodeExternals()],
  module    : {
    rules : [
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
};

if ( process.env.NODE_ENV === 'dev' ) {
  WEBPACK_CONFIG.watch = true;
  WEBPACK_CONFIG.watchOptions = {
    aggregateTimeout : 300,
    ignored          : /node_modules/,
  };
}

module.exports = WEBPACK_CONFIG;
