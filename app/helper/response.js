module.exports = function(res, code, data){
    res.status(code).json(data)
    res.end();
}