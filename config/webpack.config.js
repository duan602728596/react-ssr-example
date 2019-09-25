const path = require('path');
const { getEntry, htmlPlugins } = require('./utils');

function config() {
  const entry = getEntry('Entry'); // 获取入口文件

  return {
    entry,
    output: {
      publicPath: '/',
      path: path.join(__dirname, '../dist'),
      globalObject: 'this',
      filename: '[name].js',
      chunkFilename: '[name].js'
    },
    module: {
      rules: [
        {
          test: /^.*\.jsx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  [
                    '@babel/preset-env',
                    {
                      targets: {
                        chrome: 70
                      },
                      debug: true,
                      modules: false,
                      useBuiltIns: false
                    }
                  ],
                  '@babel/preset-react'
                ],
                plugins: ['react-hot-loader/babel']
              }
            }
          ]
        },
        {
          test: /^.*\.(jpe?g|png|gif|webp)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                name: '[name]_[hash:5].[ext]',
                limit: 0,
                emitFile: true
              }
            }
          ]
        }
      ]
    },
    plugins: htmlPlugins(entry)
  };
}

module.exports = config;