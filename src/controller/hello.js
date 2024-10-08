const response = require('../utils/responseUtil');
const logger = require('../lib/log')('getPallets');

module.exports = async (ctx) => {
    // const {

    // } = ctx.clientParam;
    try {
        ctx.body = response.success(' success!!');
    } catch (err) {
        ctx.body = response.operationFail(' failed');
    }
};
