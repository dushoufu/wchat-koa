const { check } = require('./auth')
const { User } = require('../model')

module.exports = router => {

  // online
  router.get('/api/user/online', async (ctx, next) => {
    ctx.body = await User.online(ctx)
  })

  router.get('/api/user/bar', function (ctx, next) {
    ctx.body = 'this is a users/bar response'
  })
}
