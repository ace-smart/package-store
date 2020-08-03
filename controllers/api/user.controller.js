const User = require('../../models/UserModel')

module.exports = {
  // Show users
  show: async (req, res) => {
    try {
      // const users = await User.find({}).lean()
      const users = {username: 'ah', password: '123'}
      return res.send(users)
    } catch (error) {
      return res.sendStatus(404).send(error)
    }
  },

  // Get user by Id
  get: async (req, res) => {
    console.log(req.params.id)
    return res.send('get user')
  },

  // Create new user
  create: async (req,res) => {

  },

  // Update user
  update: async (req,res) => {

  },

  // Delete user
  delete: async (req,res) => {

  }
  
}