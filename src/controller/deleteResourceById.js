const response = require('../utils/responseUtil');
const logger = require('../lib/log')('deleteResourceById');
const resourceService = require('../service/resourceService');
const constants = require('../utils/constantUtil');

module.exports = async (ctx) => {
    try {
        const {
            id,
        } = ctx.clientParam;
        const res = await resourceService.deleteResourceById(id);
        if (res.ret === constants.RET_FAIL) {
            ctx.body = response.operationFail('deleteResourceById failed.');
            return;
        }
        const resources = res.data;
        ctx.body = response.success('deleteResourceById success', resources);
    } catch (err) {
        logger.error('deleteResourceById failed: ', err);
        ctx.body = response.operationFail('deleteResourceById failed');
    }
};
