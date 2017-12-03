if (process.env.NODE_ENV === 'production')
  module.exports = {
    mongoURI: 'mongodb://<YOUR DATABASE>'
  }
else
  module.exports = {
    mongoURI: 'mongodb://localhost/idea-pop'
  }
