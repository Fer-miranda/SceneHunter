import mongoose from "mongoose";

const locationSchema = mongoose.Schema({
  userName: {
    type: String,
  },
  category: {
    type: String,
    enum: ['Movies', 'Series', 'Music videos'],
    required: [true, "Category is required"],
  },
  name: {
    type: String,
    required: [true, "Title is required"],
    minlength: [3, "Title must be al least 3 characters"]
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    minlength: [3, "Description must be al least 5 characters"],
    maxlength: [300, "Description must have a maximum of 300 characters"]
  },
  lat: {
    type : Number,
    required : true,
  },

  lon: {
      type : Number,
      required : true
  },
  images: [{
    type: String,
  }],
  
  userOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
}, { timestamps: true });


export const LocationModel = mongoose.model("Locations", locationSchema);