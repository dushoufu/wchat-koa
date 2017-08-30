/**
 * 一条消息示例
 */
const data = {
  session: {                        // id 和 members 必填其一
    name: '会话名称',
    id: '会话唯一标识',
    members: ['moohng', 'qqqqqq']   // 会话成员
  },
  message: {
    content: {
      text: '这里是文本信息',
    },
    date: '1231564564'
  }
}

module.exports = {
  single(data, ws, mapWs) {

  },
  multiple(data, ws, mapWs) {

  }
}
