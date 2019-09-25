const merge = require('webpack-merge');
const config = require('./webpack.config');

function devConfig() {
  return {
    mode: 'development',
    module: {
      rules: [
        {
          test: /^.*\.css?$/,
          use: [
            {
              loader: 'style-loader'
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
    }
  };
}

module.exports = merge(config(), devConfig());