const asyncQuery = require('../../helper/asyncQuery')

module.exports = (table, field, value) => {
    // QUERY FIELD 
   const field_status = asyncQuery(`SELECT * FROM ${table} WHERE ${field}='${value}'`)

    // RESOLVE PROMISE    
   const status = field_status.then((field)=>{
        if(field.length > 0){
            return 1
        }else{
            return 0
        }
   })

   return status
}