const Router = require('koa-router')
const router = new Router()
const miniProgram = require('./miniProgram')
const upload = require('./upload')
const sse = require('./sse')
// 根目录请求
router.get('/', (ctx) => {
  const query = ctx.query
  console.log('query', query)
  ctx.body = {
    message: 'hello world'
  }
})

router.get('/testData', (ctx) => {
  const query = ctx.query
  console.log('query', query)
  ctx.body = {
    code: 200,
    data: {
      message: 'test data'
    },
    message: ''
  }
})

router.use(miniProgram.routes())
router.use(upload.routes())
router.use(sse.routes())


module.exports = router