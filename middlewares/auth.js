const config = require('../config');

function ensureAuthenticated(req, res, next) {
    if(!config.IS_PRODUCTION){
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
