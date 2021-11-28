module.exports = class Controller {
    model

    /**
     *
     * @param {String} model
     */
    constructor(model) {
        this.model = require(`./models/${model}`);
    };

    /**
     *
     * @param {Object} data
     * @param  {Object} options
     * @returns {Promise<Array<Object>>}
     */
    
    get(data, options = {limit: undefined, data: {}}) {
        return new Promise((resolve, reject) => {
            this.model.find(data, (error, result) => {
                if (error) return reject(error);
                return resolve(result);
            }).sort(options.data).limit(options.limit);
        });
    };

    /**
     *
     * @param {Object} data
     * @returns {Promise<Array<Object>>}
     */
    delete(data) {
        return new Promise((resolve, reject) => {
            this.model.deleteMany({data}, (error, result) => {
                if (error) return reject(error);
                return resolve(result);
            });
        });
    };

    /**
     *
     * @param {ObjectId} _id
     * @param {Object} data
     * @returns {Promise<unknown>}
     */

    update(_id, data) {
        return new Promise((resolve, reject) => {
            this.model.updateMany({_id}, data, (error, result) => {
                if (error) return reject(error);
                return resolve(result);
            });
        });
    };

    /**
     *
     * @param {Object} data
     * @returns {Promise<unknown>}
     */
    create(data) {
        return new Promise((resolve, reject) => {
            this.model.create(data, (error, result) => {
                if (error) return reject(error);
                return resolve(result);
            });
        });
    };
}