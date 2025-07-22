const Koa = require('koa');
const cors = require('koa2-cors');
const router = require('./router');
const { koaBody } = require('koa-body');

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


app.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
})