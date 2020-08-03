const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


module.exports = (env = {}) => {

  const { mode = "development"} = env;

  const isProd = mode === "production";
  const isDev = mode === "development";

  getStyleLoaders = () => {
    return [
      isProd ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader'
    ]
  }

  NothingPlugin = () => {
    this.apply = function(){}
  }

  getPlugins = () => {
    const plugins =  [
      new HtmlWebpackPlugin({
        template: "public/index.html"
      })
    ];
    if (isProd) {
      plugins.push(
        new MiniCssExtractPlugin({
          filename: 'main-[hash:8].css'
        })
      );

      if (isProd && env.analyze) {
        plugins.push(
          new BundleAnalyzerPlugin()
        );
      }
    }
    return plugins;
  }

  return {
    mode: isProd ? 'production': isDev &&  'development',

    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js'
    },

    module: {
      rules: [{
          test: /\.(js|jsx)$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader'
        },
        {
          enforce: 'pre',
          test: /\.(js|jsx)$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'eslint-loader'
        },
        {
          test: /\.(png|jpg|svg|gif|ico|jpeg)$/,
          use: [{
            loader: 'url-loader',
            options: {
              limit: 8192,
              outputPath: 'images'
            }
          }]
        },
        {
          test: /\.(ttf|otf|eot|woff|woff2)$/,
          use: [{
            loader: 'file-loader',
            options: {
              outputPath: 'fonts',
              name: '[name].[ext]'
            }
          }]
        },
        {
          test: /\.css$/,
          use: getStyleLoaders()
        },
        {
          test: /\.(s[ca]ss)$/,
          use: [...getStyleLoaders(), 'sass-loader']
        }
      ]
    },

    resolve: {
      extensions: ['.js', 'jsx']
    },

    plugins: getPlugins(),

    devServer: {
      contentBase: './dist'
    }
  }
};