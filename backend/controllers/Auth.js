// User model ko import kar rahe hain taaki hum database se interact kar sakein
const User = require("../models/User");

// bcrypt library ko import kar rahe hain password hashing ke liye
const bcrypt = require("bcryptjs");

// jsonwebtoken library ko import kar rahe hain token banane ke liye
const jwt = require("jsonwebtoken");

const otpGenerator = require('otp-generator'); 
const mailSender = require('../utils/mailSender');

require("dotenv").config();

// Signup logic
exports.signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ success: false, message: "Please fill all details." });
        }

        // Check if user already exists (regardless of verification status)
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // If user exists but is not verified, we can resend OTP (logic can be added later)
            // For now, just prevent duplicate signups
             return res.status(400).json({
                success: false,
                message: "User with this email already exists.",
             });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate OTP
        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        // Set OTP expiry time (e.g., 5 minutes from now)
        const otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes in milliseconds

        // Create user document but keep isVerified as false
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            otp: otp,
            otpExpires: otpExpires,
            isVerified: false, // User is not verified yet
        });

        // Send OTP email
        try {
            await mailSender(
                email,
                "Quizora - Verify Your Email",
                `<p>Your One-Time Password (OTP) for Quizora registration is: <h2>${otp}</h2> It is valid for 5 minutes.</p>`
            );
            console.log(`OTP sent successfully to ${email}`);
        } catch (mailError) {
            console.error("Failed to send OTP email:", mailError);
            // Optional: Delete the user if email fails, or allow retry later
            await User.deleteOne({ _id: newUser._id }); // Rollback user creation
            return res.status(500).json({
                success: false,
                message: "Failed to send verification email. Please try signing up again.",
            });
        }

        // Respond to frontend - IMPORTANT: Don't send user data yet
        return res.status(200).json({ // Use 200 OK because the user isn't fully created yet
            success: true,
            message: "OTP sent successfully! Please check your email to verify your account.",
            // We might send back the email to help the frontend confirm which user to verify
            email: email, 
        });

    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ success: false, message: "User registration failed." });
    }
};

// --- ADD A PLACEHOLDER FOR THE VERIFY FUNCTION ---
exports.verifyOTP = async (req, res) => {
    try {
        // 1. Get email and OTP from request body
        const { email, otp } = req.body;

        // 2. Validate input
        if (!email || !otp) {
            return res.status(400).json({ success: false, message: "Please provide email and OTP." });
        }

        // 3. Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found. Please sign up first." });
        }

        // 4. Check if user is already verified
        if (user.isVerified) {
             return res.status(400).json({ success: false, message: "Account already verified. Please log in." });
        }

        // 5. Verify the OTP
        if (user.otp !== otp || user.otpExpires < Date.now()) {
            // Check if OTP matches and hasn't expired
             return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
        }

        // 6. Mark the user as verified and clear OTP fields
        user.isVerified = true;
        user.otp = undefined; // Remove OTP
        user.otpExpires = undefined; // Remove expiry
        await user.save(); // Save the changes to the database

        // 7. Send success response
        return res.status(200).json({
            success: true,
            message: "Account verified successfully! You can now log in.",
        });

    } catch (error) {
        console.error("OTP Verification error:", error);
        return res.status(500).json({ success: false, message: "OTP verification failed." });
    }
};

// Login logic
exports.login = async (req, res) => {
    try {
        // Step 1: User se data lena
        const { email, password } = req.body;

        // Step 2: Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide both email and password.",
            });
        }

        // Step 3: Check karna ki user exist karta hai ya nahi
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ // 401 = Unauthorized
                success: false,
                message: "Invalid credentials. User not found.",
            });
        }

        if (!user.isVerified) {
            return res.status(401).json({ // 401 Unauthorized
                success: false,
                message: "Account not verified. Please check your email for the OTP.",
            });
        }

        // Step 4: Password ko compare karna
        // bcrypt.compare() user ke diye plain password ko database ke hashed password se compare karta hai
        if (await bcrypt.compare(password, user.password)) {
            // Passwords match

            // Step 5: JWT Token create karna
            const payload = {
                email: user.email,
                id: user._id, // User ki unique ID
            };
            
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h", // Token 2 ghante mein expire ho jayega
            });

            // Password ko response se hata do taaki woh frontend par na jaaye
            user = user.toObject();
            user.password = undefined; 
            
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Cookie 3 din mein expire hogi
                httpOnly: true, // Isse cookie client-side script se access nahi ho sakti (security)
            };

            // Step 6: Token ko cookie mein bhejna aur success response dena
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "Logged in successfully!",
            });

        } else {
            // Passwords do not match
            return res.status(401).json({
                success: false,
                message: "Invalid credentials. Please check your password.",
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Login failed. Please try again.",
        });
    }
};

