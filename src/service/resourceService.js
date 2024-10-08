const logger = require('../lib/log')('resourceService');
const constants = require('../utils/constantUtil');

let { resourceMap, currentId } = require('../model/Resource'); // Adjust the path as needed

class ResourceService {
    /**
     * Retrieve all resources
     * @returns {Object} An object containing the result status and a list of all resources.
     */
    static async getAllResources() {
        try {
            return {
                ret: constants.RET_SUCCESS, // Indicating success
                data: Array.from(resourceMap.values()),
            };
        } catch (error) {
            logger.error(`Failed to retrieve all resources: ${error}`);
            return {
                ret: constants.RET_FAIL, // Indicating failure
                message: 'Failed to retrieve resources',
            };
        }
    }

    /**
     * Get a specific resource by ID
     * @param {number} id - The ID of the resource to retrieve.
     * @returns {Object} An object containing the result status and the resource data if found.
     */
    static async getResourceById(id) {
        try {
            // Convert the id to an integer
            const intId = Number(id);

            const resource = resourceMap.get(intId);
            if (!resource) {
                logger.error(`Resource with ID ${intId} not found`);
                return {
                    ret: constants.RET_FAIL, // Indicating failure
                    message: `Resource with ID ${intId} not found`,
                };
            }

            return {
                ret: constants.RET_SUCCESS, // Indicating success
                data: resource,
            };
        } catch (error) {
            logger.error(`Failed to retrieve resource by ID ${id}: ${error}`);
            return {
                ret: constants.RET_FAIL, // Indicating failure
                message: `Failed to retrieve resource by ID ${id}`,
            };
        }
    }

    /**
     * Delete a resource by ID
     * @param {number} id - The ID of the resource to delete.
     * @returns {Object} An object containing the result status and the deleted resource.
     */
    static async deleteResourceById(id) {
        try {
            const intId = Number(id);
            // Check if the resource exists

            if (resourceMap.has(intId)) {
                const deletedResource = resourceMap.get(intId); // Get the resource to delete
                resourceMap.delete(intId); // Delete the resource from the map
                logger.info(`Resource with ID ${intId} deleted`);

                return {
                    ret: constants.RET_SUCCESS, // Indicating success
                    data: deletedResource,
                    message: `Resource with ID ${intId} deleted successfully`,
                };
            }

            logger.error(`Resource with ID ${intId} not found`);
            return {
                ret: constants.RET_FAIL, // Indicating failure
                message: `Resource with ID ${intId} not found`,
            };
        } catch (error) {
            logger.error('Failed to delete resource');
            return {
                ret: constants.RET_FAIL, // Indicating failure
                message: 'Failed to delete resource',
            };
        }
    }

    /**
     * Insert a new resource with auto-incremented ID
     * @param {string} content - The content of the new resource.
     * @returns {Object} An object containing the result status and the inserted resource.
     */
    static async insertResource(content) {
        try {
            const id = currentId++; // Auto-increment ID
            const newResource = { id, content };
            resourceMap.set(id, newResource);
            logger.info(`Resource inserted with ID ${id}`);
            return {
                ret: constants.RET_SUCCESS, // Indicating success
                data: newResource,
            };
        } catch (error) {
            logger.error(`Failed to insert resource: ${error}`);
            return {
                ret: constants.RET_FAIL, // Indicating failure
                message: 'Failed to insert resource',
            };
        }
    }

    /**
     * Update an existing resource by ID
     * @param {number} id - The ID of the resource to update.
     * @param {string} content - The new content for the resource.
     * @returns {Object} An object containing the result status and the updated resource.
     */
    static async updateResource(id, content) {
        try {
            if (!resourceMap.has(id)) {
                logger.error(`Resource with ID ${id} not found`);
                return {
                    ret: constants.RET_FAIL, // Indicating failure
                    message: `Resource with ID ${id} not found`,
                };
            }
            const updatedResource = { id, content };
            resourceMap.set(id, updatedResource);
            logger.info(`Resource with ID ${id} updated`);
            return {
                ret: constants.RET_SUCCESS, // Indicating success
                data: updatedResource,
            };
        } catch (error) {
            logger.error(`Failed to update resource with ID ${id}: ${error}`);
            return {
                ret: constants.RET_FAIL, // Indicating failure
                message: `Failed to update resource with ID ${id}`,
            };
        }
    }
}

ResourceService.insertResource('first item');
ResourceService.insertResource('second item');

module.exports = ResourceService;
