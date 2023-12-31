const User = require("../models/User");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  const duplicate = await User.findOne({ username }).exec();

  if (duplicate) return res.sendStatus(409);
  try {
    const hashedPwd = await bcrypt.hash(password, 10);

    const result = await User.create({
      username,
      password: hashedPwd,
    });
    console.log(result);
    res.status(201).json({ success: `New user ${username} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
