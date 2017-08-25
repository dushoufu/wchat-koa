const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const session = require('koa-session')
const logger = require('koa-logger')

const index = require('./routes/index')
const users = require('./routes/users')
const auth = require('./routes/auth')

const config = require('./config')

app.keys = ['some secret hurr'];

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

// template
app.use(index.routes(), index.allowedMethods())
// api
app.use(auth.routes(), auth.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// mongo
const MongoClient = require('mongodb').MongoClient
MongoClient.connect(config.mongo_host, (err, db) => {

})

module.exports = app
