const LocalStrategy = require('passport-local')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const User = mongoose.model('user')

module.exports = passport => {
  passport.use(
    new LocalStrategy({ usernameField: 'name' }, (username, password, done) => {
      // Match user
      User.findOne({ name: username })
        .then(user => {
          if (!user) return done(null, false, { message: 'User not found' })

          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (!isMatch)
              return done(null, false, { message: 'Password incorrect' })
            return done(null, user)
          })
        })
        .catch(err => console.log(err))
    })
  )

  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((userId, done) =>
    User.findById({ _id: userId }, (err, user) => done(err, user))
  )
}
