const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

// Include protect auth
const { ensureAuthenticated } = require('../services/auth')

// Include Idea model
require('../models/idea')
const Idea = mongoose.model('idea')

router.get('/', ensureAuthenticated, (req, res) => {
  Idea.find({ owner: req.user._id })
    .sort({ date: 'desc' })
    .then(ideas => {
      res.render('ideas/ideas', { ideas: ideas })
    })
})

router.get('/add', ensureAuthenticated, (req, res) => res.render('ideas/add'))

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id,
    owner: req.user._id
  })
    .then(idea => {
      if (idea) return res.render('ideas/edit', { idea: idea })
      res.redirect('/ideas')
    })
    .catch(err => console.log('err'))
})

router.post('/', ensureAuthenticated, (req, res) => {
  let errors = []
  if (!req.body.title) errors.push({ text: 'Please add a title' })
  if (!req.body.details) errors.push({ text: 'Please add some details' })
  if (errors.length > 0)
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      detials: req.body.detials
    })
  else
    new Idea({
      title: req.body.title,
      details: req.body.details,
      owner: req.user._id
    })
      .save()
      .then(() => {
        req.flash('success_msg', 'Idea saved !')
        res.redirect('/ideas')
      })
})

router.put('/:id', ensureAuthenticated, (req, res) =>
  Idea.findOne({ _id: req.params.id }).then(idea => {
    idea.title = req.body.title
    idea.details = req.body.details
    idea.save().then(() => {
      req.flash('success_msg', 'Idea updated !')
      res.redirect('/ideas')
    })
  })
)

router.delete('/:id', ensureAuthenticated, (req, res) =>
  Idea.remove({ _id: req.params.id }).then(() => {
    req.flash('success_msg', 'Idea removed !')
    res.redirect('/ideas')
  })
)

module.exports = router
