// apis.js: This file will hold all your backend API endpoints as constants. This prevents typos and makes it incredibly
// easy to update URLs in the future without hunting through multiple files.

// apiConnector.js: This will be a single, generic function that makes all your axios calls. It's the perfect place to 
// handle common logic, like setting the base URL, adding authentication tokens to headers, or managing errors.

// const BASE_URL = "http://localhost:8000/api"; 
const BASE_URL = "https://quizora-ai-quiz-app18.onrender.com/api";

// We will define our API endpoints here
export const authEndpoints = {
    // UPDATED: Route path to include '/auth'
    SIGNUP_API: `${BASE_URL}/auth/signup`,
    LOGIN_API: `${BASE_URL}/auth/login`,
    VERIFY_OTP_API: `${BASE_URL}/auth/verify-otp`,
};

export const quizEndpoints = {
    // This is ready for when we build the AI feature
    GENERATE_QUIZ_API: `${BASE_URL}/quiz/generate`,
};