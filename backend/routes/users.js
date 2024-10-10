const router = express.Router();
const User = require("../models/User");

//Sign Up
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, address } = req.body;

        //check username length is more than 3 characters
        if (username.length < 4) {
            return res.status(400).json({ message: "Username must be at least 4 characters long" });
        }

        //check username already exists
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: "Username already exists" });
        }

        //check email already exists
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: "Email already exists" });
        }

        //check password's length
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }
    } catch (err) {
        res.status(500).json({ message: "Internal serveur error" });
    }
    });



module.exports = router;