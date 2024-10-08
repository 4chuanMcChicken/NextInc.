const Joi = require('joi');

const addResourceSchema = Joi.object({
    content: Joi.string().required(),
});

const getResourcesByIdSchema = Joi.object({
    id: Joi.string().required(),
});

const deleteResourceByIdSchema = Joi.object({
    id: Joi.string().required(),
});

module.exports = {
    addResourceSchema,
    getResourcesByIdSchema,
    deleteResourceByIdSchema,
};
