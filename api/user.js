const { check } = require('./auth')
const { User } = require('../model')

module.exports = router => {

  router.get('/api/user', function (ctx, next) {
    ctx.body = 'this is a users response!'
  })

  router.get('/api/user/bar', function (ctx, next) {
    ctx.body = 'this is a users/bar response'
  })
}
