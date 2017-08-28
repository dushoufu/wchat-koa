const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,

  online: { type: Boolean, default: false },         // 在线状态

  name: { type: String, default: '默认昵称' },        // 用户昵称
  age: { type: Number, default: Math.round(Math.random() * 100) },
  sex: { type: String, default: '女' },
  address: { type: String, default: '湖南 长沙' },
  about_me: { type: String, default: '岁月静好，可你还不来' },
  registed_time: {type: Date, default: Date.now },    // 注册时间

  friends: [String],                                  // 用户好友列表
  pre_friends: [String],                              // 已添加但对方还未接受的好友列表
})

// register
userSchema.statics.register = async function (ctx, user) {
  let doc = await this.findOne({ username: user.username })
  if (doc) {
    return { code: 99999, message: '用户名已存在' }
  }

  user.online = true
  const result = await user.save()
  user.password = null
  ctx.session.user = user

  return { code: 0, message: '注册成功', user }
}

// login
userSchema.statics.login = async function (ctx, user) {
  const doc = await this.findOne(user)
  if (doc) {
    await this.updateOne(user, { online: true })
    user.password = null
    ctx.session.user = user
    return { code: 0, message: '登录成功' }
  }
  return { code: 99999, message: '登陆失败' }
}

// logout
userSchema.statics.logout = async function (ctx) {
  if (!ctx.session.isNew) {
    await this.updateOne({ username: ctx.session.user.username }, { online: false })
    ctx.session = null
  }
  return { code: 0, message: '已退出登录' }
}

// check
userSchema.statics.check = async function (ctx) {
  if (!ctx.session.isNew) {
    await this.updateOne({ username: ctx.session.user.username }, { online: true })
    return { code: 0, message: '已登录' }
  }
  await this.updateOne({ username: ctx.session.user.username }, { online: false })
  return { code: 10001, message: '未登陆' }
}

module.exports = mongoose.model('User', userSchema)
