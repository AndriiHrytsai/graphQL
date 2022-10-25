// ************************************* QUERIES *****************************************
const getUserById = (id) => `query {
  user(id: ${id}) {
    id, email
  }
}`;

const currentUser = () => `query {
  currentUser {
    email
  }
}`;

// ************************************* MUTATIONS *****************************************

const createUser = (email, password, firstName, lastName) => `mutation {
  createUser(first_name: ${firstName}, last_name: ${lastName}, email: ${email}, password: ${password}) {
    email
  }
}`;

const login = (email, password) => `mutation {
  login(email: ${email}, password: ${password} ) {
    access_token
  }
}`;

const forgotPassword = (email) => `mutation {
  forgotPassword(email: ${email}) {
    message
  }
}`;

const updateUser = (firstName) => `mutation{
  updateUser(first_name: ${firstName}) {
    message
  }
}`;

module.exports = {
  createUser,
  login,
  getUserById,
  currentUser,
  forgotPassword,
  updateUser,
};
