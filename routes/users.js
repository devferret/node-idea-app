const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const passport = require('passport')

const router = express.Router()

require('../models/user')
const User = mongoose.model('user')

// User login
router.get('/login', (req, res) => res.render('users/login'))

// User Register
router.get('/register', (req, res) => res.render('users/register'))

router.post('/register', (req, res) => {
  let errors = []

  if (req.body.password != req.body.confirmPassword)
    errors.push({ text: "Sorry, Passwords don't match" })
  if (req.body.password.length < 4)
    errors.push({ text: 'Sorry, Password must be at least 4 characters' })
  if (errors.length > 0)
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword
    })
  else {
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        req.flash('error_msg', 'Sorry, This email has been used')
        res.redirect('/users/register')
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) throw err
            new User({
              name: req.body.name,
              email: req.body.email,
              password: hash
            })
              .save()
              .then(user => {
                req.flash('success_msg', 'Great!, Sign up successful')
                res.redirect('/users/login')
              })
              .catch(err => {
                console.log(err)
                return
              })
          })
        })
      }
    })
  }
})

module.exports = router
