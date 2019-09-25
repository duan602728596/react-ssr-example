/* 清除模块缓存（只用于开发环境） */
exports.cleanRequireCache = function cleanRequireCache(id) {
  const modulePath = require.resolve(id);

  if (module.parent) {
    module.parent.children.splice(module.parent.children.indexOf(id), 1);
  }

  delete require.cache[modulePath];
};

/* 模块导入 */
exports.requireModule = function requireModule(id) {
  const module = require(id);

  return 'default' in module ? module.default : module;
};