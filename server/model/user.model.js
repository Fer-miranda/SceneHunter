import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  // userName: {
  //   type: String,
  //   required: [true, 'Username is required'],
  // },
  userName: {
    type: String,
    required: [true, 'Username is required'],
    unique: [true, 'username ya existe'] // Add the unique property here
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: [true, 'email ya existe'],
    validate: {
			validator: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
			message: 'Please enter a valid email'
		},
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [5, 'Contraseña debe tener al menos 5 caracteres'],
  },

  savedLocations: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Location' }],
  
  likedLocations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location'
  }]
  }, { timestamps: true });


export const UserModel = mongoose.model("users", UserSchema);
