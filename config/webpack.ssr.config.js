const path = require('path');
const process = require('process');
const { getEntry } = require('./utils');

function config() {
  const entry = getEntry('server');

  return {
    mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
    target: 'async-node', // 配置为async-node或node以保证代码可以在node的环境中运行
    node: {
      __filename: true,
      __dirname: true
    },
    entry,
    output: {
      path: path.join(__dirname, '../dist-server'),
      globalObject: 'this',
      filename: '[name].js',
      chunkFilename: '[name].js',
      libraryTarget: 'umd' // 文件输出为umd模块，保证node环境内能通过require函数加载模块
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
                      modules: 'commonjs', // 配置为commonjs，保证依赖是通过node的require函数来加载
                      useBuiltIns: false
                    }
                  ],
                  '@babel/preset-react'
                ]
              }
            }
          ]
        },
        {
          test: /^.*\.css?$/,
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: '[path][name]__[local]___[hash:base64:6]'
                },
                onlyLocals: true // 配置为true，只改变className，不生成css文件
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
                emitFile: false // 配置为false，只生成文件路径，不生成代码
              }
            }
          ]
        }
      ]
    }
  };
}

module.exports = config();