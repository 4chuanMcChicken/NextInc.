const response = require('../utils/responseUtil');
const logger = require('../lib/log')('getAllResources');
const resourceService = require('../service/resourceService');
const constants = require('../utils/constantUtil');

module.exports = async (ctx) => {
    try {
        const res = await resourceService.getAllResources();
        if (res.ret === constants.RET_FAIL) {
            ctx.body = response.operationFail('getAllResources failed.');
            return;
        }
        const resources = res.data;
        ctx.body = response.success('getAllResources success', resources);
    } catch (err) {
        logger.error('getAllResources failed: ', err);
        ctx.body = response.operationFail('getAllResources failed');
    }
};
