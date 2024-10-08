const response = require('../utils/responseUtil');
const logger = require('../lib/log')('addResources');
const resourceService = require('../service/resourceService');

module.exports = async (ctx) => {
    const {
        content,
    } = ctx.clientParam;
    try {
        const ret = await resourceService.insertResource(content);

        if (ret === false) {
            ctx.body = response.operationFail('addResource failed.');
            return;
        }
        ctx.body = response.success('addResource success');
    } catch (err) {
        logger.error('addResource failed: ', err);
        ctx.body = response.operationFail('addResource failed');
    }
};
