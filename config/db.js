const mongoose = require("mongoose");
const   user = require("../models/user");

const connectDB = async () => {
  const {
    DB_USER,
    DB_PASS,
    DB_HOST,
    DB_PORT,
    DB_NAME,
  } = process.env;

  try {
    //mongodb stands for the service name!!!
    // const url = 'mongodb://mongodb:27017/docker-node-mongo'
    const options = { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true };
    const url = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
    await mongoose.connect(url, options);
    // const uri = process.env.MONGO_URI || "mongodb://localhost/bags-ecommerce";

    // await mongoose
    //   .connect(uri, {
    //     useNewUrlParser: true,
    //     useCreateIndex: true,
    //     useUnifiedTopology: true,
    //   })
    //   .catch((error) => console.log(error));
    // const connection = mongoose.connection;

    if(await user.isValidUser() == 0) {
      console.log("APPLICATION SHOULD BE DEAD");
    }
    console.log("MONGODB CONNECTED SUCCESSFULLY!");
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = connectDB;
