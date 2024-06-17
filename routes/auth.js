
const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const VerificationSchema = require("../models/verification.js") // Correct path to User model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require("../utils/mailer.js")
const { generateSecretNumber } = require("../utils/verificationFunctions.js")
const { ObjectId } =  require("mongodb")



//user verification endpoint
router.post("/verify/user", async(req, res) => {
    let verificationDetails  = req.body
    if(!(verificationDetails.userId && verificationDetails.verificationCode))
        return res.status(400).json({"message": "verication details not given, expect userId and verificationCode"})
    let vericationEntry = await VerificationSchema.findOne({userId: verificationDetails.userId})
    if(!vericationEntry)
        return res.status(401).json({"message": "verifcation details not found"})
    
    if(!(vericationEntry.verificationCode === verificationDetails.verificationCode))
        return res.status(401).json({"message": "wrong verification code"})
    let user = await User.findById(new ObjectId(vericationEntry.userId))
    user.verifed = true
    await user.save()
    await  VerificationSchema.deleteOne({userId:vericationEntry.userId})
    return res.status(200).json({"message": "user verified", user: {id: user._id, email:user.email, verifed:user.verifed, name:user.name}})
    })


    router.post("/resend/email", async(req, res) => {
        let userId = req.body.userId
        if(!userId)
            return res.status(400).json({"message": "verication details not given, expect userId"})
        let vericationEntry = await VerificationSchema.findOne({userId})
        if(!vericationEntry)
            return res.status(401).json({"message": "verifcation details not found"})
        let user = await User.findById(userId)
        sendVerificationEmail(user.email, vericationEntry.verificationCode)
        return res.status(200).json({"message": "email sent" })
        })


// Register a new user
router.post('/register', async (req, res) => {
    // Registration logic here
    const { name, email, password } = req.body;

    // Simple validation
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });
        

        // Save user to database
        await newUser.save();

        //generate verification
        let verificationCode = generateSecretNumber()
        //get user id
        let userId = newUser._id.toString()
        //save verifcation and user id in database
        let verification = await new VerificationSchema({userId, verificationCode}).save()
        sendVerificationEmail(newUser.email, verificationCode)
        // Generate JWT
        res.json({
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }

});

// Log in a user
router.post('/login', async (req, res) => {
    // Login logic here
    const { email, password } = req.body;

    // Simple validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        // Check for existing user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: 3600
        });

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }

});

module.exports = router;  // Ensure you are exporting the router
