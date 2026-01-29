function ensureAuthenticated(req, res, next) {
    if(process.env.IS_PRODUCTION !== 'true'){
        return next();
    }
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/google');
}

module.exports = {
  ensureAuthenticated,
};
