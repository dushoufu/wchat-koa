const WebSocket = require('ws')

module.exports = server => {
  const wss = new WebSocket.Server({
    server
  })

  // 连接请求
  wss.on('connection', (ws, req) => {

    console.log('cookie', req.headers.cookie)

    ws.on('message', message => {
      console.log('收到消息：', message)
    })
  })
}
