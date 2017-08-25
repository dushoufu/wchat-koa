const user = require('../model/user')
const router = require('koa-router')()

router.prefix('/api')

router.post('/register', async (ctx, next) => {
  // 1. 验证用户信息
  const body = ctx.request.body
  if (body && body.username && body.password &&
      /^[a-zA-Z]\w{5,15}$/.test(body.username) &&
      /\w{6,16}/.test(body.password)) {
        // 2. 存入数据库
        await user.save(body)

        // 3. 设置session
        ctx.session = ctx.request.body

          ctx.body = {
            code: 0,
            message: '注册成功'
          }
      } else {
        ctx.body = {
          code: 100001,
          message: '注册失败'
        }
      }

})

router.post('/login', async (ctx, next) => {
  // 1. 验证用户信息

  // 2. 设置session
  ctx.session = ctx.request.body

  ctx.body = {
    code: 0,
    message: '登陆成功'
  }
})

router.get('/logout', async (ctx, next) => {
  if (!ctx.session.isNew) {
    console.log('---------------')
    ctx.session = null
  }
  ctx.body = {
    code: 0,
    message: '已退出登陆'
  }
})

module.exports = router
