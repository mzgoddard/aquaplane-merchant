var ChildCompilerLoaderListPlugin =
  require('child-compiler-loader-list-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var UglifyJsPlugin = require('webpack').optimize.UglifyJsPlugin;

var loaders = [
  {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
  },
  {
    test: /\.jsx?$/,
    loader: 'baggage-loader?[file].styl',
  },
  {
    test: /\.styl$/,
    loader: ExtractTextPlugin.extract(
      'style-loader', 'css-loader!stylus-loader'
    ),
  },
  {
    test: /\.svg$/,
    loader: 'file-loader',
  },
];

module.exports = {
  context: __dirname,
  entry: './src/index.js',
  output: {
    path: 'dist',
    filename: '[hash].js',
  },
  module: {
    loaders: loaders,
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],  
  },
  plugins: [
    new ChildCompilerLoaderListPlugin({
      test: /html-webpack-plugin/,
      loaders: loaders.reduce((carry, loader) => {
        if (loader.test.source === '\\.styl$') {
          carry.push({
            test: /\.styl$/,
            loader: 'raw-loader',
          });
        }
        else {
          carry.push(loader);
        }
        return carry;
      }, []),
    }),
    new ExtractTextPlugin('[contenthash].css'),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
    }),
    new UglifyJsPlugin(),
  ],
};
