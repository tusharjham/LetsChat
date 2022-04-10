const mongoose = require("mongoose");
const colors = require("colors");
const mongo = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGO_URI}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected ${conn.connection.host}`.yellow.bold);
  } catch (err) {
    console.log(`error:, ${err.message}`.red.bold);
    process.exit();
  }
};
module.exports = mongo;
