const Router = require('koa-router')
const router = new Router()

router.get('/sse', async (ctx) => {
  ctx.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  ctx.status = 200;
  ctx.respond = false; // Prevent Koa from handling the response

  const send = (event = 'message', data, isDone = false) => {
    ctx.res.write(`event:${event}\n`);
    ctx.res.write(`data:${isDone ? '[DONE]' : JSON.stringify(data)}\n\n`);
    ctx.res.flush?.();
  };

  send('connect', { answer: '连接已建立' });
  ctx.query['method'] && send('message', { answer: ctx.query['method'] });

  let count = 0;
  const interval = setInterval(() => {
    count += 1;
    send('message', { answer: `第${count}条消息` });
    if (count >= 10) {
      send('message', { answer: '连接已关闭' }, true);
      clearInterval(interval);
      ctx.res.end();
    }
  }, 300);

  ctx.req.on('close', () => {
    clearInterval(interval);
  });
});

router.post('/sse', async (ctx) => {
  const body = ctx.request.body;
  ctx.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  ctx.status = 200;
  ctx.respond = false;

  const send = (event = 'message', data, isDone = false) => {
    ctx.res.write(`event:${event}\n`);
    ctx.res.write(`data:${isDone ? '[DONE]' : JSON.stringify(data)}\n\n`);
    ctx.res.flush?.();
  };

  send('connect', { answer: '连接已建立' });
  body.method && send('message', { answer: body.method });

  let count = 0;
  const interval = setInterval(() => {
    count += 1;
    send('message', { answer: `第${count}条消息` });
    if (count >= 10) {
      send('message', { answer: '连接已关闭' }, true);
      clearInterval(interval);
      ctx.res.end();
    }
  }, 300);

  ctx.req.on('close', () => {
    clearInterval(interval);
  });
});

module.exports = router;