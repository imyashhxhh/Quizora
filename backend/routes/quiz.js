// const express = require('express');
// const router = express.Router();
// const multer = require('multer');

// const { generateQuiz } = require('../controllers/Quiz'); 
// const { auth } = require('../middlewares/auth');

// console.log("📌 quizRoutes loaded");

// const upload = multer({ storage: multer.memoryStorage() });

// router.post('/generate', auth, upload.single('pdfFile'), generateQuiz);

// module.exports = router; 


const express = require('express');
const router = express.Router();
const multer = require('multer');

// Import both controller functions
const { generateQuiz, listModels } = require('../controllers/Quiz'); // <-- ADD listModels
const { auth } = require('../middlewares/auth');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/generate', auth, upload.single('pdfFile'), generateQuiz);
router.get('/list-models', listModels); // <-- ADD THIS NEW ROUTE

module.exports = router;