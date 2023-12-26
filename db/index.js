/* 
1. Create a Schema
2. Create a Model from the Schema
3. Create a Document which is an instance of the model
*/

const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect("your own MongoDB Cluster URL/connection string");

// Define schemas
const AdminSchema = new mongoose.Schema({
  username: String,
  password: String,
  token: String,
});

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  token: String,
  purchasedCourses: [],
});

const CourseSchema = new mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean,
  adminId: String,
});

// Define the models which use the above defined schemas
const AdminModel = mongoose.model("Admin", AdminSchema);
const UserModel = mongoose.model("User", UserSchema);
const CourseModel = mongoose.model("Course", CourseSchema);

module.exports = {
  AdminModel,
  UserModel,
  CourseModel,
};
