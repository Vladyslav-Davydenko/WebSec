const Cypher = require("../models/Cypher");
const User = require("../models/User");

const getAllCyphers = async (req, res) => {
  const cyphers = await Cypher.find()
    .select(" -createdAt -updatedAt -__v")
    .lean();

  if (!cyphers?.length) {
    return res.status(400).json({ message: "No cyphers found" });
  }

  const cyphersWithUser = await Promise.all(
    cyphers.map(async (cypher) => {
      const foundUser = await User.findById(cypher.user).lean().exec();
      const { user, ...rest } = cypher;
      return { ...rest, username: foundUser.username };
    })
  );

  res.json(cyphersWithUser);
};

const createNewCypher = async (req, res) => {
  const { user, plainText, cypherMethod } = req.body;

  if (!user || !plainText || !cypherMethod) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let cypherText = "";
  if (cypherMethod === "Caesar") {
    let shift = 7;

    for (let i = 0; i < plainText.length; i++) {
      let char = plainText[i];
      let charCode = plainText.charCodeAt(i);

      if (char.match(/[a-zA-Z]/)) {
        const isUpperCase = char === char.toUpperCase();
        charCode =
          ((((charCode - (isUpperCase ? 65 : 97) + shift) % 26) + 26) % 26) +
          (isUpperCase ? 65 : 97);
      } else {
        charCode = charCode + shift;
      }

      cypherText += String.fromCharCode(charCode);
    }
  } else if (cypherMethod === "Vigenere") {
    text = plainText.toUpperCase();
    keyword = "KEY";
    encrypt = true;

    for (let i = 0, j = 0; i < text.length; i++) {
      let char = text[i];

      if (char.match(/[A-Z]/)) {
        const keywordChar = keyword[j % keyword.length];
        const shift = encrypt
          ? keywordChar.charCodeAt(0) - 65
          : 26 - (keywordChar.charCodeAt(0) - 65);

        char = String.fromCharCode(
          ((char.charCodeAt(0) - 65 + shift) % 26) + 65
        );

        j++;
      }

      cypherText += char;
    }
  } else {
    cypherText = plainText;
  }

  const cypher = await Cypher.create({
    user,
    plainText,
    cypherMethod,
    cypherText,
  });

  if (cypher) {
    // Created
    return res.status(201).json({ message: "New cypher created" });
  } else {
    return res.status(400).json({ message: "Invalid cypher data received" });
  }
};

const deleteCypher = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  if (!id) {
    return res.status(400).json({ message: "Cypher ID required" });
  }

  let cypher;

  try {
    cypher = await Cypher.findById(id).exec();
  } catch (error) {
    return res.status(400).json({ message: "Cypher ID Invalid" });
  }

  if (!cypher) {
    return res.status(400).json({ message: "Cypher not found" });
  }

  await cypher.deleteOne();

  const reply = `Cypher with ID ${id} deleted`;

  res.json(reply);
};

module.exports = {
  getAllCyphers,
  createNewCypher,
  deleteCypher,
};
