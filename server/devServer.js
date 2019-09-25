const path = require('path');
const fs = require('fs');
const http = require('http');
const Koa = require('koa');
const Router = require('@koa/router');
const koaWebpack = require('koa-webpack');
const webpack = require('webpack');
const mime = require('mime-types');
const nunjucks = require('nunjucks');
const _ = require('lodash');
const webpackDevConfig = require('../config/webpack.development');
const webpackSSRDevConfig = require('../config/webpack.ssr.config');
const { cleanRequireCache, requireModule } = require('./utils');

const app = new Koa();
const router = new Router();
const distSSR = path.join(__dirname, '../dist-server');

nunjucks.configure({
  autoescape: false
});

async function main() {
  /* webpack ssr */
  const compiler = webpack(webpackSSRDevConfig);

  compiler.watch({
    aggregateTimeout: 500
  }, function callback(err, stats) {
    if (err) {
      console.error(err);
    } else {
      console.log(stats.toString({
        colors: true
      }));
    }
  });

  /* router */
  app.use(router.routes())
    .use(router.allowedMethods());

  /* webpack */
  const koaWebpackMiddleware = await koaWebpack({
    compiler: webpack(webpackDevConfig),
    hotClient: {
      host: {
        client: '*',
        server: '0.0.0.0'
      },
      allEntries: true // // 这个配置保证所有入口都能够热更新
    },
    devMiddleware: {
      serverSideRender: true
    }
  });

  app.use(koaWebpackMiddleware);

  /* index路由 */
  router.get('/*', async (ctx, next) => {
    try {
      // 因为koa中间件只能获取到静态文件，所以需要处理
      // 获取path
      const ctxPath = ctx.path;
      const formatPath = ctx.path === '/' ? '/Index' : ctx.path; // 默认路由
      const mimeType = mime.lookup(ctxPath);

      ctx.routePath = ctxPath; // 保存旧的path

      // 根据path解析name
      const name = formatPath
        .replace(/^\//, '')
        .replace(/[\\/]/g, '_')
        .toLocaleLowerCase();

      //  根据path，将path修改成html文件的地址，获取html
      if (mimeType === false) {
        ctx.path = `/${ name }.html`;
      }

      await next();

      if (ctx.type === 'text/html') {
        // ssr
        const modulePath = path.join(distSSR, `${ name }.js`); // 加载ssr模块

        // 判断模块是否存在
        if (fs.existsSync(modulePath)) {
          cleanRequireCache(modulePath); // 清除模块缓存

          const module = requireModule(modulePath); // 运行模块
          const body = await module();

          // 模板渲染
          ctx.body = nunjucks.renderString(ctx.body.toString(), {
            render: body.toString()
          });
        }
      }
    } catch (err) {
      ctx.status = 500;
      ctx.body = err.toString();
    }
  });

  http.createServer(app.callback())
    .listen(5050);
}

main();