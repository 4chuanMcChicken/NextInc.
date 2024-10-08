const router = require('koa-router')();

const addResource = require('../../controller/addResource');
const getAllResources = require('../../controller/getAllResources');
const getResourceById = require('../../controller/getResourceById');
const deleteResourceById = require('../../controller/deleteResourceById');
const boardcastWS = require('../../controller/boardcastWS');

const {
    validateParams,
} = require('../../middlewares/validateParams');

const {
    addResourceSchema,
    getResourceByIdSchema,
    deleteResourceByIdSchema,
} = require('../../validator/common');

router.get('/resource', async (ctx, next) => {
    const { id } = ctx.query;

    if (id) {
        const validationError = validateParams(getResourceByIdSchema)(ctx, next);
        if (validationError) {
            return validationError;
        }

        await getResourceById(ctx);
    } else {
        // No ID, fetch all resources
        await getAllResources(ctx);
    }
});

router.post(
    '/resource',
    validateParams(addResourceSchema),
    addResource,
);

router.delete(
    '/resource',
    validateParams(deleteResourceByIdSchema),
    deleteResourceById,
);

router.post(
    '/boardcastWS',
    boardcastWS,
);

module.exports = router;
