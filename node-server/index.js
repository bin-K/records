const Koa = require('koa');
const cors = require('koa2-cors');
const router = require('./router');
const { koaBody } = require('koa-body');
const WebSocket = require('ws');
const http = require('http');

const app = new Koa();

// 处理请求体
app.use(koaBody({
  multipart: true,
  formidable: {
    maxFieldsSize: 10 * 1024 * 1024, // 最大文件大小为 10MB
    multipart: true,
    keepExtensions: true // 保持原始文件的扩展名
  }
}))

// 处理跨域问题
app.use(cors({
  origin: '*'
}))

// 使用koa-router中间件（推荐）
app.use(router.routes())
app.use(router.allowedMethods())

// 创建 HTTP 服务器
const server = http.createServer(app.callback());

// 创建 WebSocket 服务器
const wss = new WebSocket.Server({ server });

// WebSocket 连接处理
wss.on('connection', (ws, req) => {
  console.log('WebSocket 客户端已连接:', req.socket.remoteAddress);

  // 接收消息
  ws.on('message', (msg, isBinary) => {
    if (isBinary || Buffer.isBuffer(msg)) {
      try {
        // 广播给所有客户端
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'binary',
              size: msg.length,
              timestamp: new Date().toISOString()
            }));
          }
        });
        // 对发送方回复确认
        ws.send(JSON.stringify({ type: 'ack', message: 'binary_received' }));
      } catch (error) {
        console.error('处理二进制数据出错:', error);
        ws.send(JSON.stringify({ type: 'error', message: '处理二进制数据失败' }));
      }
      return;
    }
    try {
      const message = JSON.parse(msg);
      console.log('收到消息:', message);

      // 广播给所有客户端
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'message',
            data: message,
            timestamp: new Date().toISOString()
          }));
        }
      });

      // 发送确认
      ws.send(JSON.stringify({
        type: 'ack',
        message: '消息已接收'
      }));
    } catch (error) {
      console.error('消息解析错误:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: '消息格式错误'
      }));
    }
  });

  // 连接关闭
  ws.on('close', () => {
    console.log('WebSocket 客户端已断开连接');
  });

  // 错误处理
  ws.on('error', (error) => {
    console.error('WebSocket 错误:', error);
  });

  // 发送欢迎消息
  ws.send(JSON.stringify({
    type: 'connected',
    message: 'WebSocket 连接成功'
  }));
});

server.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
  console.log('WebSocket server is running at ws://localhost:3000')
})