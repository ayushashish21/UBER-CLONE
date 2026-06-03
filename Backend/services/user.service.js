const userModel = require('../models/user.model');

/**
 * Create a new user
 * @param {Object} userData - User data object
 * @param {string} userData.firstname - User's first name
 * @param {string} userData.lastname - User's last name
 * @param {string} userData.email - User's email
 * @param {string} userData.password - User's hashed password
 * @returns {Promise<Object>} Created user object
 * @throws {Error} If required fields are missing
 */
module.exports.createUser = async ({
    firstname,
    lastname,
    email,
    password
}) => {
    if (!firstname || !email || !password) {
        throw new Error('All fields are required');
    }

    const user = await userModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password
    });

    return user;
}