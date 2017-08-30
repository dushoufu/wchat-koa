const mongoose = require('mongoose')

const sessionSchema = new mongoose.Schema({
  name: { type: String, default: '无主题' },
  members: [String],
  create_time: { type: Date, default: Date.now }
})

// 创建会话
sessionSchema.statics.create = async session => {
  const doc = await this.create(session)
  return { code: 0, id: doc._id }
}

// 删除会话(删除会话中的成员)
sessionSchema.statics.delete = async (sessionID, username) => {
  const doc = await this.findOne({ _id: sessionID })
  if (doc) {
    if (doc.members.length < 2) {
      // 直接删除会话
      await this.deleteOne({ _id: sessionID })
    } else {
      const index = doc.members.findIndex(username)
      doc.members.splice(index, 1)
      // 更新
      await this.updateOne({ _id: sessionID }, { members: doc.members })
    }
  }
}

// 添加成员
sessionSchema.statics.add = async (sessionID, username) => {
  const doc = await this.findOne({ _id: sessionID })
  if (doc) {
    doc.members.push(username)
    // 更新
    await this.updateOne({ _id: sessionID }, { members: doc.members })
  }
}

module.exports = mongoose.model('Session', sessionSchema)
