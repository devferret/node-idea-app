const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

// User login
router.get('/login', (req, res) => res.send('login'))

// User Register
router.get('/register', (req, res) => res.send('register'))

module.exports = router
