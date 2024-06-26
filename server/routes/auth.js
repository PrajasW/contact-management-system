const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const auth = require("../middlewares/auth");
const User = require("../models/User");
const dotenv = require("dotenv");
dotenv.config();
// 
// POST /api/register
router.post("/register", async (req, res) => {
	const { name, email, password } = req.body;
	
	if (!name || !email || !password)
		return res
	.status(400)
	.json({ error: `Please enter all the required field.` });
	
	const emailReg =
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	
	if (!emailReg.test(email))
	return res
.status(400)
.json({ error: "please enter a valid email address." });

if (password.length < 6)
return res
.status(400)
.json({ error: "password must be atleast 6 characters long" });
try {
	const doesUserAlreadyExist = await User.findOne({ email });
	
	if (doesUserAlreadyExist)
		return res.status(400).json({
			error: `user [${email}] already exists.`,
		});
		
		const hashedPassword = await bcrypt.hash(password, 12);
		const newUser = new User({ name, email, password: hashedPassword });
		
		const result = await newUser.save();
		//
		result._doc.password = undefined;
		
		return res.status(201).json({ ...result._doc });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: err.message });
	}
});

// POST /api/login
router.post("/login", async (req, res) => {
	// console.log("jwt = ",process.env.JWT_SECRET);
	const { email, password } = req.body;
	
	if (!email || !password)
	return res
.status(400)
.json({ error: "please enter all the required fields!" });

const emailReg =
/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

if (!emailReg.test(email))
return res
.status(400)
.json({ error: "please enter a valid email address." });

try {
	const doesUserExits = await User.findOne({ email });
	
	if (!doesUserExits)
	return res.status(400).json({ error: "Invalid email or password!" });

		const doesPasswordMatch = await bcrypt.compare(
		password,
		doesUserExits.password
		);

		if (!doesPasswordMatch)
		return res.status(400).json({ error: "Invalid email or password!" });

		const payload = { _id: doesUserExits._id };
		const token = jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: "1h",
		});

		const user = { ...doesUserExits._doc, password: undefined };
		return res.status(200).json({ token, user });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: err.message });
	}
});

// router.get("/me", auth, async (req, res) => {
//   	return res.status(200).json({ ...req.user._doc });
// });

router.get("/me", auth, async (req, res) => {
    if (!req.user) {
        return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ ...req.user._doc });
});

module.exports = router;
