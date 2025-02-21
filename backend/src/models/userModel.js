import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  isBlock: {
    type: Boolean,
    required: true,
    default: false,
  },
  
},
{
  timestamps:true
});
const User = mongoose.model("user", userSchema);

export default User;






// import mongoose from 'mongoose';
// // const Schema=mongoose.Schema
// // const userSchema = new Schema({
// const userSchema = new mongoose.Schema({
//     username: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//         match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
//     },
//     password: {
//         type: String,
//         required: true,
//         // validate: passwordValidator
//     },
//     name: {
//         type: String,
//         required: true,
//     },
//     isAdmin: { type: Boolean, required: true, default: false },
//     isBlock: { type: Boolean, required: true, default: false },
// },
//     {
//         timestamps: true,     //automatically createdAt and updatedAt fields 
//     }
// );

// const User = mongoose.model('User', userSchema);

// export default User;
