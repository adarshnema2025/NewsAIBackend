const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");


// Registeration
// exports.register=async(data)=>{
//   console.log("Incoming data:", data);  // 👈 ADD THIS
//     const hashed=await bcrypt.hash(data.password,10);
//     return User.create({...data,password_hash:hashed});
// }


exports.register = async (data) => {
  console.log("Incoming data:", data);

  const hashed = await bcrypt.hash(data.password, 10);

  return User.create({
    name: data.name,
    email: data.email,
    password_hash: hashed
  });
};

//First hashed the password using bcrypt.hash() 
//Create the User row along with hashed_password

//Login
exports.login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");

  if (!user.password_hash) {
    throw new Error("This account uses Google sign-in. Please use 'Continue with Google'.");
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new Error("Invalid password");

  return jwt.sign({ id: user.id, name: user.name, email: user.email }, process.env.JWT_SECRET);
};



//fIRST find the user in database if its there
//Then compare the hashed password stored in db with user entered password compare it using .compare()
//It its valid then it will generate new token using user_id and JWT_SECRET 

