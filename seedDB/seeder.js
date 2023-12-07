const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const Category = require("../models/category");
const mongoose = require("mongoose");
const connectDB = require("./../config/db");
const seedDBCategory = require("./category-seed");
const seedDBProducts = require("./products-seed");
const User = require("../models/user");



async function seedDB() {
    
  async function closeDB() {
    console.log("CLOSING CONNECTION");
    await mongoose.disconnect();
  }

    connectDB();
    const hasBeenSeeded = await mongoose.connection.collection('config').findOne({ seeded: true });
    if (hasBeenSeeded) {
        console.log("Database already seeded. Skipping...");
        await mongoose.disconnect();
        return;
    }

    await seedDBCategory();

    await seedDBProducts();

    const newUser = await new User();
    
        newUser.email = process.env.ADMIN_EMAIL;
        newUser.password = process.env.ADMIN_PASSWORD;
        newUser.username = 'admin';
        newUser.admin = true;
        await newUser.save();



    await mongoose.connection.collection('config').insertOne({ seeded: true });
    await closeDB();
}
seedDB();

