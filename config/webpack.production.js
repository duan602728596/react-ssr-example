const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const config = require('./webpack.config');

function devConfig() {
  return {
    mode: 'production',
    module: {
      rules: [
        {
          test: /^.*\.css?$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: '[path][name]__[local]___[hash:base64:6]'
                },
                onlyLocals: false
              }
            }
          ]
        }
      ]
    },
    plugins: [new MiniCssExtractPlugin()]
  };
}

module.exports = merge(config(), devConfig());