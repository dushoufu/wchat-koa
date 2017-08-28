const { User } = require('../model')

module.exports = router => {
  router.post('/api/auth/register', async (ctx, next) => {
    // 1. 验证用户信息
    const { username, password } = ctx.request.body
    if (username && password &&
        /^[a-zA-Z]\w{5,15}$/.test(username) &&
        /\w{6,16}/.test(password)) {
          // 2. 注册
          ctx.body = await User.register(ctx, new User({
            username,
            password
          }))
        } else {
          ctx.body = {
            code: 99999,
            message: '注册失败'
          }
        }
  })

  router.post('/api/auth/login', async (ctx, next) => {
    // 1. 获取用户信息
    const { username, password } = ctx.request.body
    if (username && password) {
      // 2. 登录
      ctx.body = await User.login(ctx, { username, password })
    } else {
      ctx.body = { code: 99999, message: '登录失败' }
    }
  })

  router.get('/api/auth/logout', async (ctx, next) => {
    if (!ctx.session.isNew) {
      ctx.session = null
    }
    ctx.body = { code: 0, message: '已退出登录' }
  })

  router.get('/api/auth/check', async (ctx, next) => {
    ctx.body = ctx.session.isNew ? { code: 10001, message: '未登陆' } : { code: 0, message: '已登录' }
  })
}

// 检查登录态
exports.check = async (ctx, next) => {
  if (ctx.session.isNew) {
    ctx.body = { code: 10001, message: '未登陆' }
  } else {
    next()
  }
}
