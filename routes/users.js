const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

// User login
router.get('/login', (req, res) => res.render('users/login'))

// User Register
router.get('/register', (req, res) => res.render('users/register'))

router.post('/register', (req, res) => {
  let errors = []

  if (req.body.password != req.body.confirmPassword)
    errors.push({ text: "Passwords don't match" })
  if (req.body.password.length < 4)
    errors.push({ text: 'Password must be at least 4 characters' })
  if (errors.length > 0)
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword
    })
  else res.redirect('/users/login')
})

module.exports = router
