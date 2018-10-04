//----- Authentication Middleware -----
function isAdmin(req, res, next) {
    if(!req.user) {
        req.session.redirectTo = req.path;
        res.redirect('/auth/login');
    }
    else if(req.user.userLevel >= 1) {
        next();
    } else {
        res.status(403);
        res.send("Error: You are not an admin.");
    }
}

function isLoggedIn(req, res, next) {
    if(req.user) {
        next();
    } else {
        req.session.redirectTo = req.path;
        res.redirect('/auth/login');
    }
}

auth = {"isLoggedIn": isLoggedIn, "isAdmin": isAdmin};
//-------------------------------------

module.exports = auth;
