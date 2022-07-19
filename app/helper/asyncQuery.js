const connection = require('../config/mysql-connect');

module.exports = (query, params = null) => {
    return new Promise((resolve, reject) => {
        connection.query(query, params, (error, result) => {
            if (error) {
                console.error(error);
                reject({ status: 'error', code: error.code, messages: 'An error occurred while processing data' })
            }
            resolve(result);
        })
    })
}