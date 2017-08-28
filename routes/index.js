const router = require('koa-router')()
const api = require('../api')

module.exports = app => {
  // api
  api(router)
  // template
  router.get('/', async (ctx, next) => {
    await ctx.render('index', {
      title: 'Hello Koa 2!'
    })
  })

  app.use(router.routes(), router.allowedMethods())
}
