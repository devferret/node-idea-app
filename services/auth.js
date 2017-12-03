module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) next()
    if (!req.query.ref) req.flash('error_msg', 'Not authorized')
    res.redirect('/users/login')
  }
}
