
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const userSchema = Schema({
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  admin: {
    type: Boolean,
    default: false}
});

// encrypt the password before storing
userSchema.methods.encryptPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(12), null);
};


userSchema.methods.validPassword = function (candidatePassword) {
  if (this.password != null) {
    return bcrypt.compareSync(candidatePassword, this.password);
  } else {
    return false;
  }
};

userSchema.statics.isValidUser = async function () {

  const configCollection = mongoose.connection.collection('config');
  const lastTryDoc = await configCollection.findOne({ dateOfExpiration: true });

  if (lastTryDoc && lastTryDoc.lastTry) {
    const lastTryDate = new Date(lastTryDoc.lastTry);
    const oneHourAgo = new Date(Date.now() - 600000);

    if (lastTryDate < oneHourAgo) 
      return 1 //update of the lock
    else
      return 0 //one should be locked
    
  } 
  else 
    return -1;//no lock exists, can be created
};



module.exports = mongoose.model("User", userSchema);
