const userModel = require('../models/user.model');

/**
 * Create a new user
 * @param {Object} userData - User data object
 * @param {string} userData.firstname - User's first name
 * @param {string} userData.lastname - User's last name
 * @param {string} userData.email - User's email
 * @param {string} userData.password - User's hashed password
 * @param {string} userData.country - User's country code
 * @returns {Promise<Object>} Created user object
 * @throws {Error} If required fields are missing
 */
module.exports.createUser = async ({
    firstname,
    lastname,
    email,
    password,
    country
}) => {
    // ADDED: country to the validation check
    if (!firstname || !email || !password || !country) {
        throw new Error('All fields are required');
    }

    const user = await userModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password,
        country // ADDED: Save country to database
    });

    return user;
}