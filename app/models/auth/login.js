const bcrypt = require('bcrypt')
const asyncQuery = require('../../helper/asyncQuery')
const returnMessage = require('../../helper/returnMessage')

module.exports = async (table, field,{ username, password }) => {
    try {
        // QUERY TO KNOW DATA USER EXIST OR NAH 
        const users = await asyncQuery(`SELECT * FROM ${table} WHERE ${field} = ?`, [username])

        // IF DATA USER NOT FOUND
        if (users.length === 0) {
            return returnMessage(404, 'Tidak dapat menemukan akun dengan username tersebut')
        }

        // COMPARE PASSWORD
        const user = users[0]
        const match = await bcrypt.compare(password, user.password)

        // CHECK PASSWORD IS SAME OR NAH
        if (match) {
            return { status: 200, message: 'Login sukses', data: { user_id: user.id, user_role: user.role } }
        } else {
            return {status: 403, message: 'Password yang anda masukan salah'}        }

    } catch (error) {
        // ERRORR
        console.error(error)
        return returnMessage(500, 'Terjadi Kesalahan saat proses login')
    }
}