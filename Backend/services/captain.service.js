const captainModel = require("../models/captain.model");

/**
 * Create a new captain
 * @param {Object} captainData - Captain data object
 * @param {string} captainData.firstname - Captain's first name
 * @param {string} captainData.lastname - Captain's last name
 * @param {string} captainData.email - Captain's email
 * @param {string} captainData.password - Captain's hashed password
 * @param {string} captainData.color - Vehicle color
 * @param {string} captainData.plate - Vehicle plate number
 * @param {number} captainData.capacity - Vehicle capacity
 * @param {string} captainData.vehicleType - Type of vehicle
 * @returns {Promise<Object>} Created captain object
 * @throws {Error} If required fields are missing
 */
module.exports.createCaptain = async ({
  firstname,
  lastname,
  email,
  password,
  color,
  plate,
  capacity,
  vehicleType,
}) => {
  if (!firstname || !email || !password || !color || !plate || !capacity || !vehicleType) {
    throw new Error("All fields are required");
  }

  const captain = await captainModel.create({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password,
    vehicle: {
      color,
      plate,
      capacity,
      vehicleType
    }
  });
}
