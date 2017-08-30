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
      handleMessage(data, ws, app.mapWs)
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
  // 获取成员
  let members = data.session.members
  mapWs.forEach((value, key) => {
    if (value === ws) {
      members.push(key)
    }
  })
  members = [...new Set(members)]

  // 1. 转发消息
  members.forEach(value => {
    if (mapWs[value] !== ws && mapWs[value].readyState === WebSocket.OPEN) {
      mapWs[value].send(data.message)
    }
  })

  // 2. 创建会话
  const sessionID = data.session.id
  const doc = sessionID && await Session.findById(sessionID)
  if (!sessionID || !doc) {             // id 不存在则创建新的会话
    const result = await Session.create({ name: data.session.name, members })
    ws.send(result)
  }

  // 3. 存储消息
  Session.addMessage(sessionID, data.message)
}

/**
 * 一条完整的消息示例
 */
const data = {
  session: {
    name: '回话名称',
    id: '回合唯一标识',           // id 和 members 必选其一
    members: ['moohng', 'qqqqqq']
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
