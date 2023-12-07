const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const Category = require("../models/category");
const mongoose = require("mongoose");
const connectDB = require("./../config/db");


async function seedDBCategory() {
  async function seedCateg(titleStr) {
    try {
      const categ = await new Category({ title: titleStr });
      await categ.save();
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  await seedCateg("Backpacks");
  await seedCateg("Briefcases");
  await seedCateg("Mini Bags");
  await seedCateg("Large Handbags");
  await seedCateg("Travel");
  await seedCateg("Totes");
  await seedCateg("Purses");
}

module.exports = seedDBCategory;
