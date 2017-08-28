const auth = require('./auth')
const user = require('./user')

module.exports = router => {
  auth(router)
  user(router)
}
