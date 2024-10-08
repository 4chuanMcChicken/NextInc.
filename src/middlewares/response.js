const _ = require('lodash');
const response = require('../utils/responseUtil');
const {
    Exception,
    ErrMsgAdapter,
    ErrCode,
    ErrMsg,
} = require('../lib/exception');
const logger = require('../lib/log')('ResponseMiddleware');

function loggerReqDetail(ctx, delta) {
    try {
        const userAgent = ctx.headers['user-agent'];
        const countryCode = ctx.headers['cf-ipcountry'];
        logger.debug(`url: '${ctx.path}',ipcountry: ${countryCode},host: '${ctx.origin}',method: '${ctx.method.toUpperCase()}',ip:${ctx.ip},user_agent:'${userAgent}',param: ${JSON.stringify(_.omit(_.assign(ctx.request.query, ctx.request.body, ctx.params), [
            'records',
        ]))},costTimes: ${delta}ms code=${_.get(ctx, 'body.code')} message=${_.get(ctx, 'body.message')}`);
    } catch (error) {
        logger.error(error);
    }
}
const formatBody = (ctx) => {
    let ret = {};

    if (ctx.body instanceof Exception) {
        ret = response.operationFail(_.get(ctx, 'body.retmsg'));
    } else if (!_.get(ctx, 'body.code') && _.get(ctx, 'body.code') !== 0) {
        ctx.status = 404;
        ret = {
            message: 'API endpoint not found',
            code: 404,
            details: ctx.body,
        };
    } else {
        ret = ctx.body;
    }

    ctx.body = ret;
};

const errorFormat = (ctx) => {
    const ret = {};
    const responseType = ctx.response.type;
    const { path } = ctx;
    const languageCode = _.get(ctx, 'clientParam.languageCode', 'en');
    if (responseType && responseType !== 'application/json') {
        return;
    }
    if (path.startsWith('/app')) {
        ret.retcode = ErrCode.ERRCODE_INTERNAL_ERROR;
        ret.retmsg = _.get(ErrMsgAdapter, `${ErrMsg.ERRMSG_INTERNAL_ERROR}_${languageCode}`, ErrMsg.ERRMSG_INTERNAL_ERROR);
        ret.result = {};
    } else if (!path.startsWith('/app')) {
        ctx.body = response.operationFail('network error.', {});
    }
    ctx.body = ret;
};

module.exports = () => async (ctx, next) => {
    const start = Date.now();
    let delta = 0;
    try {
        await next();
        delta = Math.ceil(Date.now() - start);
        formatBody(ctx);
    } catch (e) {
        logger.error(e);
        errorFormat(ctx);
    }

    loggerReqDetail(ctx, delta);
};
