const logger = require('../lib/log')('koa-cors');

const allowDomains = {
    '': true,
};

const CORS_PATH = {
    '/account/login': true,
};

module.exports = () => async (ctx, next) => {
    const { path } = ctx;
    logger.debug(`TTTT==== the path is ${path}`);
    if (CORS_PATH[path]) {
        // const origin = URL.parse(ctx.get('origin') || ctx.get('referer') || '');
        const host = ctx.get('origin');
        // logger.debug(`TTTT==== the host is ${host}`);
        if (allowDomains[host]) {
            logger.info('TTTT==== the domain is allowd');
            // ctx.set('Cross-Origin-Embedder-Policy', 'require-corp');
            // ctx.set('Cross-Origin-Opener-Policy', 'same-origin');
            ctx.set('Access-Control-Allow-Origin', host);
            ctx.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
            ctx.set(
                'Access-Control-Allow-Headers',
                'X-Requested-With, User-Agent, Referer, Content-Type, Cache-Control,accesstoken,x-auth-token,accept,Authorization',
            );
            ctx.set('Access-Control-Max-Age', '5400');
            ctx.set('Access-Control-Allow-Credentials', 'true');
            if (ctx.method !== 'OPTIONS') {
                await next();
            } else {
                ctx.body = '';
                ctx.status = 204;
            }
        } else {
            logger.error(`path=${path} ip=${ctx.ip} host=${host} not allow`);
            ctx.body = '';
            ctx.status = 403;
        }
    } else {
        await next();
    }
};
