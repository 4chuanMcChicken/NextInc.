const Koa = require('koa');
const serve = require('koa-static');
const mount = require('koa-mount');

const app = new Koa();
// const Redis = require('ioredis');

const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('./lib/log')('app');
// const Redis = require('./dao/storageRedis');
// const common = require('./routes/v1/common');

const common = require('./routes/v1/common');
const cors = require('./middlewares/koaCors');
const responseMiddleware = require('./middlewares/response');

// error handler
onerror(app);
// require('./dao/mongodbInit')();

app.proxy = true;

// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text'],
}));
app.use(json());
app.use(cors());

app.use(responseMiddleware());

app.use(common.routes(), common.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
    logger.error('server error', err, ctx);
});

module.exports = app;
