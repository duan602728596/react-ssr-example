const path = require('path');
const glob = require('glob');
const _ = require('lodash');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * 获取webpack入口文件
 * @param { string } entryFileName: 入口文件名称
 */
exports.getEntry = function getEntry(entryFileName) {
  const files = glob.sync(`pages/**/${ entryFileName }.js`); // 获取入口文件的路径

  return _.transform(files, function(result, value, index) {
    const res = path.parse(value);
    const name = res
      .dir
      .replace(/^pages[\\/]/i, '')
      .replace(/[\\/]/g, '_')
      .toLocaleLowerCase();

    result[name] = [path.join(__dirname, '..', value)];
  }, {});
};

/**
 * html-webpack-plugin插件
 * @param { object } entry: 入口
 */
exports.htmlPlugins = function(entry) {
  const template = path.join(__dirname, '../pages/document.ejs');
  const keys = Object.keys(entry);

  return _.transform(entry, function(result, value, key) {
    result.push(new HtmlWebpackPlugin({
      inject: true,
      template,
      filename: `${ key }.html`,
      excludeChunks: _.without(keys, key)
    }));
  }, []);
};