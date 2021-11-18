const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const resolve = require('path').resolve;

const config = {
  mode: 'development',  
  devtool: 'eval-source-map',
  entry: __dirname + '/src/index.jsx',
  output:{
    path: resolve('./public/'),
    filename: 'bundle.js',
    publicPath: resolve('./public/')
  },
  devServer: {
    static: './public'
  },
  plugins: [new HtmlWebpackPlugin({
    template: path.resolve (__dirname,'views/index.html'),
    filename: 'index.html'      
  })],
  resolve: {
    extensions: ['.js','.jsx','.css','.scss','.png','.jpg']
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env','@babel/preset-react']
        }
      }
    },{
      test: /\.(sa|sc|c)ss$/,
      use: [
        // Creates `style` nodes from JS strings
        "style-loader",
        // Translates CSS into CommonJS
        "css-loader",
        // Compiles Sass to CSS
        "sass-loader",
      ],
    },
    {
      test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              esModule: false,
            },
          },
        ],

     type: 'javascript/auto'
    }]
  }
};

module.exports = config;
