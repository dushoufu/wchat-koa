const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const session = require('koa-session')
const logger = require('koa-logger')

const routes = require('./routes')
const config = require('./config')

app.keys = ['some secret hurr'];

// cors
app.use(async (ctx, next) => {
  ctx.set({
    // 跨域cookie 不能为通配符 *
    'Access-Control-Allow-Origin': config.allow_origin,
    'Access-Control-Allow-Methods': 'GET,POST',
    // 跨域cookie必须为true
    'Access-Control-Allow-Credentials': true
  })
  await next()
})

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// session
app.use(session(app))

// routes
routes(app)

module.exports = app
