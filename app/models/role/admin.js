module.exports = (req, res, next) => {
    if(req.session.user_role == 2){
        return next()
    }

    const backURL=req.header('Referer') || '/';
    
    res.redirect(backURL);
}