const _ = require('lodash');
const logger = require('../lib/log')('ValidateParamsMiddleware');
const { ErrCode, Exception } = require('../lib/exception');
// const Redis = require('../dao/storageRedis');

const response = require('../utils/responseUtil');

function validateParams(schema, allowUnknown = false) {
    return async (ctx, next) => {
        let data = {};
        const checkSchema = schema;

        if (ctx.request.method === 'GET') {
            data = ctx.request.query;
        } else {
            data = ctx.request.body;
        }

        try {
            if (!checkSchema) {
                await next();
                return;
            }

            const { error, value } = checkSchema.validate(data, { allowUnknown });
            if (error) {
                logger.error(`${ctx.url}, ${error.message},${JSON.stringify(data)}`);
                const exception = new Exception(ErrCode.ERRCODE_REQ_PARAM, error.message);
                ctx.body = exception;
                return;
            }
            ctx.clientParam = _.assign(ctx.clientParam, value);
            // logger.debug(`validateParams clientParam: ${JSON.stringify(ctx.clientParam)}`);
            await next();
        } catch (err) {
            logger.error('validate params fail: ', err);
            ctx.body = response.operationFail('validate params fail');
        }
    };
}

module.exports = {
    validateParams,

};
