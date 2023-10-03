const User = require('../models/User');
const bcrypt = require('bcrypt');

const authController = async (req, res) => {
    const { user, pwd } = req.body;
    if(!user || !pwd) {
        return res.status(400).json({ message: "username and password are required" });
    }

    // check wether user and pwd match with mongoDB database
    const data = await User.find({ userName: `${user}` }).exec();
    if(!data?.length) {
        return res.status(401).json({ message: "Invalid Username" });
    }
    const match = await bcrypt.compare(pwd, data[0].password);
    if(!match) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    // send some access token for later
    return res.status(201).json({ message: "Successfully Logged In" });
};

module.exports = authController;