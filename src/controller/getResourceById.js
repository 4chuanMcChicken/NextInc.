const response = require('../utils/responseUtil');
const logger = require('../lib/log')('getResourceById');
const resourceService = require('../service/resourceService');
const constants = require('../utils/constantUtil');

module.exports = async (ctx) => {
    try {
        const {
            id,
        } = ctx.query;

        const res = await resourceService.getResourceById(id);

        if (res.ret === constants.RET_FAIL) {
            ctx.body = response.operationFail('getResourceById failed.');
            return;
        }
        const resources = res.data;
        ctx.body = response.success('getResourceById success', resources);
    } catch (err) {
        logger.error('getResourceById failed: ', err);
        ctx.body = response.operationFail('getResourceById failed');
    }
};
