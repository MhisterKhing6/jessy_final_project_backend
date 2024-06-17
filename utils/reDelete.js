const User = require("../models/user.js");

(async () => {
    await User.deleteMany()
})()