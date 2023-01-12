const { default: mongoose } = require('mongoose');
const moongoose = require('mongoose');

const userSchema = new moongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: [
    {
      type: String,
      default: 'Employee',
    },
  ],
  active: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model('User', userSchema);
