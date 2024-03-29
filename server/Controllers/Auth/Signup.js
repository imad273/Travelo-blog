const User = require('../../Model/Users');
const bcrypt = require('bcrypt');

const Signup = async (request, response) => {
  async function cryptPass(value) {
    const salt = await bcrypt.genSalt();
    var hashed = await bcrypt.hash(value, salt);
    return hashed;
  }

  // Check if the user already has an acoount in our database
  var findUser = await User.find({ Email: request.body.Email });

  if (findUser.length > 0) {
    response.send({
      status: 'Fail',
      Message: "This email is already exist"
    })
  } else {
    var password = await cryptPass(request.body.Password);
    try {
      // create new account
      var newUser = await User.create({
        SignType: "normal",
        Name: request.body.Name,
        Picture: "avatar.png",
        Email: request.body.Email,
        Password: password,
        Description: "",
        Blogs: 0,
        GoogleAccountID: ""
      })

      response.send({
        status: 'success',
        userID: newUser._id.toString()
      });

    } catch (error) {
      response.send({
        status: 'Fail',
        Message: error
      });
      console.log(error);
    }
  }
}

module.exports = Signup