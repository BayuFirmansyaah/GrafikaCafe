const asyncQuery = require('./asyncQuery')

module.exports = (id_akun,log) => {
    const time = Date.now()

    const data = {
        id_akun,
        time,
        log
    }

    asyncQuery(`INSERT INTO log SET?`,data)

}