const User = require('../models/User');
const bcrypt = require('bcrypt');

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const registerController = async (req, res) => {
    const { user, pwd } = req.body;

    // test user and pwd for the regex
    if(!USER_REGEX.test(user) || !PWD_REGEX.test(pwd)) {
        return res.status(401).json({ message: "Invalid UserName and Password" });
    }

    // check if User does not have a duplicate
    const duplicate = User.findOne({ userName: user });
    if(duplicate) {
        return res.status(402).json({ message: "Username taken" });
    }

    try {
        const hashedPwd = await bcrypt.hash(pwd, 10);
        await User.create({ userName: user, password: hashedPwd, roles: ["user"]});

        return res.status(201).json({ message: "successfully registered" });
    }
    catch(e) {
        return res.status(500).json({ message: e.message });
    }
};

module.exports = registerController;