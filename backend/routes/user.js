// ye file URL Endpoint ya fir User routes define karti hai...
const express = require("express");
const router = express.Router();

// Controller functions ko import kar rahe hain
const { signup, login,verifyOTP } = require("../controllers/Auth");

// Middleware ko import kar rahe hain
const { auth } = require("../middlewares/auth");

// --- Public Routes (Inpar security guard nahi hai)

// Route for user signup
// Jab is URL par POST request aayegi, toh 'signup' function chalega
router.post("/signup", signup);

// Route for user login (hum isse baad mein banayenge)
router.post("/login", login);

router.post("/verify-otp", verifyOTP);

// --- Protected Route (Is darwaze par security guard khada hai) ---
// Is route ko access karne se pehle, 'auth' middleware chalega
router.get("/test", auth, (req, res) => {
    // Agar auth middleware ne request ko yahan tak aane diya,
    // iska matlab token valid tha.
    res.status(200).json({
        success: true,
        message: "Welcome to the protected test route!",
        user: req.user, // Middleware ne user ki details req mein daal di thi
    });
});

// Router ko export kar rahe hain
module.exports = router;