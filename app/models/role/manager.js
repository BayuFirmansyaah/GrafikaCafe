module.exports = (req, res, next) => {
    if(req.session.user_role == 1){
        return next()
    }

    const backURL=req.header('Referer') || '/';
    
    res.redirect(backURL);
}