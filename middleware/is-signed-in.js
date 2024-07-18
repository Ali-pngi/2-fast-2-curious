const isSignedIn = (req, res, next) => {
    if (req.session.user) {
        next(); 
    } else {
        
        req.session.error = "You must be signed in to view that page.";
        res.redirect('/auth/sign-in');
    }
};

module.exports = isSignedIn;