const moongoose = require('mongoose');

const connectDB = async () => {
  try {
    moongoose.connect(process.env.DB_URI);
  } catch (e) {
    console.log(e);
  }
};

module.exports = connectDB;
