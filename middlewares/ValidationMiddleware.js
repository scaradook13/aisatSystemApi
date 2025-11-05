const User = require('../models/User.Model')
const bcrypt = require("bcryptjs");
class ValidationChecker {
    async validateRegistration(req, res, next) {
        try {

            const { email } = req.body;
            const userData = await User.findOne({ email: email });
            if (userData && userData?.status === 1) {
                return res.status(409).json("This email has already been taken");
            }
            if (userData && userData?.status === 0) {
                return res.status(409).json(`This email you've used is already registered but not verified.`);
            }
            next();
        } catch (error) {
            return res.status(500).json("Internal Server Error");
        }
    }

    async validateLogin(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email) {
                return res.status(400).json("Email is required");
            }
            if (!password) {
                return res.status(400).json("Password is required");
            }
            const userData = await User.findOne({ email: email });

            if (!userData) {
                return res.status(409).json("This email is not registered");
            }
            const isMatch = await bcrypt.compare(password, userData.password);


            if (!isMatch) throw new Error('Invalid Credentials')

            req.id = userData._id
            next();
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }
}

module.exports = new ValidationChecker();