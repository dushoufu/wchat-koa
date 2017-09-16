const WebSocket = require('ws')
const { Session } = require('../model')
const util = require('koa-session/lib/util')
const cookie = require('cookie')

module.exports = (server, app) => {
  const wss = new WebSocket.Server({
    server,
    clientTracking: true,
    verifyClient(info) {
      const session = cookie.parse(info.req.headers.cookie || '', {
        decode: value => util.decode(value)
      })['koa:sess']
      return session && session.user
    }
  })

  app.mapWs = new Map()

  // 连接请求
  wss.on('connection', (ws, req) => {

    const session = cookie.parse(req.headers.cookie || '', {
      decode: value => util.decode(value)
    })['koa:sess']
    const username = session.user.username
    app.mapWs.set(username, ws)

    console.log('1个用户已连接', app.mapWs.get(username))

    // 收到消息
    ws.on('message', data => {
      console.log('收到消息：', data)

      // 消息处理
      handleMessage(JSON.parse(data), ws, app.mapWs)
    })

    // 断开连接
    ws.on('close', (code, reason) => {
      console.log('1个用户已断开：', code, reason)
      app.mapWs.forEach((value, key, own) => {
        if (value === ws) {
          own.delete(key)
        }
      });
    })
  })

  // error
  wss.on('error', err => {
    console.log('wss error')
  })
}

/**
 * 消息处理函数
 * @param {*} data
 * @param {*} ws
 * @param {*} mapWs
 */
async function handleMessage(data, ws, mapWs) {
  // 1. 创建或查找会话
  let sessionID = data.session.id
  let doc = sessionID && await Session.findById(sessionID)
  if (!sessionID || !doc) {             // id 不存在则创建新的会话
    const members = data.session.members
    members.push(data.message.from.username)
    members = [...new Set(members)]
    const result = await Session.create({ name: data.session.name, members })
    sessionID = result.id
  }
  // 获取成员
  doc = await Session.findById(sessionID)
  const members = doc.members
  // 1. 转发消息
  data.session.id = sessionID
  members.forEach(value => {
    const target = mapWs.get(value)
    console.log('==========', target)
    if (target !== ws && target.readyState === WebSocket.OPEN) {
      target.send(JSON.stringify(data))
    }
  })
  // 3. 存储消息
  Session.addMessage(sessionID, data.message)
}

/**
 * 一条完整的消息示例
 */
const data = {
  session: {
    name: '会话名称',
    id: '会话唯一标识',           // id 和 members 必选其一
    members: ['moohng', 'qqqqqq']   // 新建会话时必选
  },
  message: {
    from: {
      username: 'moohng'
    },
    content: {
      text: '这是文本消息'
    },
    date: 789789796
  }
}

/** 一个会话示例 */
const session = {
  name: '会话名称',
  id: '会话唯一标识',
  head_icon: '',
  members: ['moohng', 'qqqqqq'],
  messages: [
    {
      from: {
        username: 'moohng'
      },
      content: {
        text: '这是文本消息'
      },
      date: 789789796
    },
    {
      from: {
        username: 'moohng'
      },
      content: {
        text: '这是文本消息'
      },
      date: 789789796
    }
  ]
}
