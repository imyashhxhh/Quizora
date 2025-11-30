// const { GoogleGenerativeAI } = require("@google/generative-ai");
// require("dotenv").config();

// // Initialize the Google Generative AI model
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// exports.generateQuizFromText = async (text) => {
//     try {
//         const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

//         const prompt = `
//             Based on the following text, create a multiple-choice quiz.
//             The quiz should have exactly 5 questions.
//             Each question must have 4 options.
//             The response must be a valid JSON array of objects, with no extra text or markdown formatting before or after the array.
//             Each object in the array must have the following structure:
//             {
//                 "question": "The question text",
//                 "options": ["Option A", "Option B", "Option C", "Option D"],
//                 "correctAnswer": 0 // The index (0-3) of the correct option in the "options" array
//             }

//             Here is the text:
//             ---
//             ${text}
//             ---
//         `;

//         const result = await model.generateContent(prompt);
//         const response = await result.response;
//         const jsonResponse = response.text();

//         // Clean up the response to ensure it's valid JSON
//         const cleanedJson = jsonResponse.replace(/```json/g, "").replace(/```/g, "").trim();

//         // Parse the JSON string into an actual JavaScript object
//         const quiz = JSON.parse(cleanedJson);
//         return quiz;

//     } catch (error) {
//         console.error("Error in AI quiz generation:", error);
//         throw new Error("Failed to generate quiz from AI model.");
//     }
// };
// backend/utils/aiHelper.js

// const axios = require('axios');
// require("dotenv").config();

// exports.generateQuizFromText = async (text) => {
//     try {
//         console.log("🤖 Calling Gemini API with the correct model...");

//         // Use the exact model name from the list we retrieved
//         const modelName = "gemini-2.5-flash"; 
//         const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`;

//         const payload = {
//             contents: [{
//                 parts: [{
//                     text: `
//                         Based on the following text, create a multiple-choice quiz.
//                         The quiz must have exactly 5 questions.
//                         Each question must have 4 options.
//                         The response must be only a valid JSON array of objects, with no extra text or markdown.
//                         Each object in the array must have this exact structure:
//                         {
//                             "question": "The question text",
//                             "options": ["Option A", "Option B", "Option C", "Option D"],
//                             "correctAnswer": 0 
//                         }
//                         The correctAnswer value must be the 0-based index of the correct option.

//                         Here is the text:
//                         ---
//                         ${text}
//                         ---
//                     `
//                 }]
//             }]
//         };

//         const response = await axios.post(API_URL, payload);
//         const jsonOutput = response.data.candidates[0].content.parts[0].text;
        
//         const quiz = JSON.parse(jsonOutput);
//         return quiz;

//     } catch (error) {
//         if (error.response) {
//             console.error("Error from AI API:", error.response.data);
//         } else {
//             console.error("Error in AI quiz generation:", error.message);
//         }
//         throw new Error("Failed to generate a valid quiz from the AI model.");
//     }
// };


const axios = require('axios');
require("dotenv").config();

exports.generateQuizFromText = async (text) => {
    try {
        console.log("🤖 Calling Gemini API directly via REST...");

        const modelName = "gemini-2.5-flash"; 
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`;

        const payload = {
            contents: [{
                parts: [{
                    text: `
                        Based on the following text, create a multiple-choice quiz.
                        The quiz must have exactly 5 questions.
                        Each question must have 4 options.
                        The response must be only a valid JSON array of objects, with no extra text or markdown.
                        Each object in the array must have this exact structure:
                        {
                            "question": "The question text",
                            "options": ["Option A", "Option B", "Option C", "Option D"],
                            "correctAnswer": 0 
                        }
                        The correctAnswer value must be the 0-based index of the correct option.

                        Here is the text:
                        ---
                        ${text}
                        ---
                    `
                }]
            }]
        };

        const response = await axios.post(API_URL, payload);
        const rawResponseText = response.data.candidates[0].content.parts[0].text;
        
        // --- NEW ROBUST JSON EXTRACTION LOGIC ---
        // Find the start of the JSON array '[' and the end ']'
        const startIndex = rawResponseText.indexOf('[');
        const endIndex = rawResponseText.lastIndexOf(']');
        
        if (startIndex === -1 || endIndex === -1) {
            throw new Error("Could not find a valid JSON array in the AI response.");
        }

        // Extract just the JSON part of the string
        const jsonString = rawResponseText.substring(startIndex, endIndex + 1);
        // --- END OF NEW LOGIC ---
        
        const quiz = JSON.parse(jsonString);
        return quiz;

    } catch (error) {
        if (error.response) {
            console.error("Error from AI API:", error.response.data);
        } else {
            console.error("Error in AI quiz generation:", error.message);
        }
        throw new Error("Failed to generate a valid quiz from the AI model.");
    }
};

