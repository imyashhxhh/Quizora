import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ChevronRight, ChevronLeft, RotateCcw, CheckCircle, XCircle, Trophy, BookOpen } from 'lucide-react';
import { quizQuestions as localQuizQuestions } from '../data/quizQuestions';

const QuizPage = () => {
    // --- STATE AND REFS ---
    const location = useLocation();
    const { token } = useSelector((state) => state.auth);
    
    const [gameState, setGameState] = useState('start');
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [score, setScore] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [timer, setTimer] = useState(60);
    const timerInterval = useRef(null);

    // --- EFFECTS ---
    useEffect(() => {
        const aiQuestions = location.state?.questions;

        if (aiQuestions && aiQuestions.length > 0) {
            setQuestions(aiQuestions);
        } else {
            setQuestions(localQuizQuestions);
        }
    }, [location.state]);

    useEffect(() => {
        if (gameState === 'quiz' && !showAnswer) {
            timerInterval.current = setInterval(() => {
                setTimer(t => (t > 0 ? t - 1 : 0));
            }, 1000);
        }
        return () => clearInterval(timerInterval.current);
    }, [gameState, showAnswer]);

    useEffect(() => {
        if (timer === 0) {
            submitAnswer(true);
        }
    }, [timer]);

    // --- LOGIC FUNCTIONS ---
    const resetQuizState = () => {
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setAnswers([]);
        setScore(0);
        setShowAnswer(false);
        setTimer(60);
    };

    const startQuiz = () => {
        resetQuizState();
        setGameState('quiz');
    };

    const handleAnswerSelect = (index) => {
        if (!showAnswer) setSelectedAnswer(index);
    };

    const submitAnswer = (isTimeUp = false) => {
        clearInterval(timerInterval.current);
        if (!isTimeUp && selectedAnswer === null) return;
        const isCorrect = selectedAnswer === questions[currentQuestion]?.correctAnswer;
        setAnswers(prev => [...prev, { ...questions[currentQuestion], selectedAnswer, isCorrect }]);
        if (isCorrect) setScore(s => s + 1);
        setShowAnswer(true);
    };

    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(q => q + 1);
            setSelectedAnswer(null);
            setShowAnswer(false);
            setTimer(60);
        } else {
            setGameState('results');
        }
    };

    const previousQuestion = () => {
        if (currentQuestion > 0 && !showAnswer) {
            const answersCopy = [...answers];
            const lastAnswer = answersCopy.pop();
            if (lastAnswer && lastAnswer.isCorrect) setScore(s => s - 1);
            setAnswers(answersCopy);
            setCurrentQuestion(q => q - 1);
            setSelectedAnswer(null);
            setTimer(60);
        }
    };

    const restartQuiz = () => {
        resetQuizState();
        setGameState('start');
    };

    // --- UI SUB-COMPONENTS ---

    const CircularTimer = ({ timeLeft, totalTime = 60 }) => {
        const radius = 22;
        const circumference = 2 * Math.PI * radius;
        const progress = timeLeft / totalTime;
        const strokeDashoffset = circumference * (1 - progress);
        const isLowTime = timeLeft <= 10;

        return (
            <div className="relative w-14 h-14">
                <svg className="w-full h-full" viewBox="0 0 52 52">
                    <circle className="stroke-gray-200" strokeWidth="4" fill="transparent" r={radius} cx="26" cy="26" />
                    <circle
                        className={`transform -rotate-90 origin-center ${isLowTime ? 'stroke-red-500' : 'stroke-indigo-600'}`}
                        strokeWidth="4" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" fill="transparent" r={radius} cx="26" cy="26"
                        style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                </svg>
                <span className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-bold ${isLowTime ? 'text-red-600' : 'text-gray-800'}`}>
                    {timeLeft}
                </span>
            </div>
        );
    };
    
    const StartScreen = () => (
        <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4 mt-[-20px]">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
    
            <div className="relative z-10 w-full max-w-md mx-auto">
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8 text-center transition-all duration-500 transform hover:scale-105">
                    <div className="relative mb-6 w-24 h-24 mx-auto flex items-center justify-center">
                        <div className="absolute inset-0 bg-white/20 rounded-full blur-xl scale-150"></div>
                        <div className="relative bg-gradient-to-br from-white/20 to-white/10 rounded-full p-4 backdrop-blur-sm border border-white/30">
                            <BookOpen className="w-12 h-12 text-white mx-auto" />
                        </div>
                    </div>
                    
                    <h1 className="text-4xl font-bold font-unbounded text-white mb-3 bg-gradient-to-r from-white via-purple-100 to-indigo-100 bg-clip-text text-transparent">
                        Ready for a Quiz?
                    </h1>
                    
                    <p className="text-white/80 mb-8 text-lg leading-relaxed">
                        Generate a new quiz from a PDF or start a random one.
                    </p>
                    
                    {token ? (
                        <button
                            onClick={startQuiz}
                            className="group relative w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:via-indigo-500 hover:to-blue-500 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center space-x-3 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                            <span className="relative z-10">Start Quiz</span>
                            <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className="group relative w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:via-indigo-500 hover:to-blue-500 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center space-x-3 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                            <span className="relative z-10">Login to Start</span>
                            <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );

    const QuizScreen = () => {
        const question = questions[currentQuestion];
        if (!question) return null;
        const progress = ((currentQuestion + 1) / questions.length) * 100;
        
        return (
            <div className="min-h-[calc(100vh-64px)] bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 py-8 px-4 flex items-center mt-[-20px]">
                <div className="max-w-2xl mx-auto">
                    <div className="flex justify-between items-center mb-2 text-gray-700">
                        <p>Question {currentQuestion + 1} of {questions.length}</p>
                        <p>Score: {score}</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
                        <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6 relative">
                        <div className="absolute top-4 right-4"><CircularTimer timeLeft={timer} /></div>
                        <span className="inline-block bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full mb-4">{question.category || "General"}</span>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pr-16">{question.question}</h2>
                    </div>
                    <div className="space-y-3 mb-6">
                        {question.options.map((option, index) => {
                            let btnClass = "w-full p-4 text-left rounded-lg border transition-colors duration-200 text-gray-800 ";
                            if (showAnswer) {
                                if (index === question.correctAnswer) btnClass += "border-green-500 bg-green-50 font-semibold";
                                else if (index === selectedAnswer) btnClass += "border-red-500 bg-red-50 font-semibold";
                                else btnClass += "border-gray-200 bg-gray-50 text-gray-500";
                            } else {
                                btnClass += selectedAnswer === index ? "border-indigo-600 bg-indigo-50 border-2" : "border-gray-200 bg-white";
                            }
                            return (
                                <button key={index} onClick={() => handleAnswerSelect(index)} className={btnClass} disabled={showAnswer}>
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">{option}</span>
                                        {showAnswer && index === question.correctAnswer && <CheckCircle className="w-5 h-5 text-green-600" />}
                                        {showAnswer && index === selectedAnswer && index !== question.correctAnswer && <XCircle className="w-5 h-5 text-red-600" />}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                    <div className="flex space-x-4">
                        <button onClick={previousQuestion} disabled={currentQuestion === 0 || showAnswer} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50">
                            <ChevronLeft size={20} /><span>Previous</span>
                        </button>
                        {!showAnswer ? (
                            <button onClick={() => submitAnswer(false)} disabled={selectedAnswer === null} className="flex-1 bg-gray-400 text-white font-semibold py-3 rounded-lg disabled:bg-gray-300">
                                Submit Answer
                            </button>
                        ) : (
                            <button onClick={nextQuestion} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center space-x-2">
                                <span>{currentQuestion === questions.length - 1 ? 'View Results' : 'Next Question'}</span><ChevronRight size={20} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const ResultsScreen = () => {
        if (questions.length === 0) return null;
        const percentage = Math.round((score / questions.length) * 100);
        return (
            <div className="flex items-center justify-center p-4 min-h-[calc(100vh-64px)]  bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 py-8 px-4 mt-[-20px]">
                <div className="max-w-2xl mx-auto w-full">
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 text-center">
                        <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 font-unbounded">Quiz Complete!</h1>
                        <p className="text-gray-600">Here's how you performed</p>
                        <div className="grid grid-cols-2 gap-4 my-6">
                            <div className="bg-green-50 rounded-lg p-4"><div className="text-2xl font-bold text-green-800">{score}</div><div className="text-green-600">Correct</div></div>
                            <div className="bg-red-50 rounded-lg p-4"><div className="text-2xl font-bold text-red-800">{questions.length - score}</div><div className="text-red-600">Incorrect</div></div>
                        </div>
                        <div className="text-center mb-6">
                            <div className="text-5xl font-extrabold text-indigo-600 mb-2">{percentage}%</div>
                            <div className="text-gray-700 text-lg">Final Score</div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Question Review</h2>
                        <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                            {answers.map((answer, index) => (
                                <div key={answer.id || index} className="border-l-4 border-gray-200 pl-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900 mb-2">{index + 1}. {answer.question}</h3>
                                            <div className="text-sm space-y-1">
                                                <div className={`flex items-center space-x-2 ${answer.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                                    {answer.isCorrect ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                                    <span>Your answer: {answer.selectedAnswer !== null ? answer.options[answer.selectedAnswer] : 'Not Answered'}</span>
                                                </div>
                                                {!answer.isCorrect && (
                                                    <div className="text-green-700 flex items-center space-x-2">
                                                        <CheckCircle className="w-4 h-4" />
                                                        <span>Correct answer: {answer.options[answer.correctAnswer]}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${answer.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {answer.category || "General"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button onClick={restartQuiz} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center space-x-2">
                        <RotateCcw className="w-4 h-4" />
                        <span>Take Quiz Again</span>
                    </button>
                </div>
            </div>
        );
    };

    // --- MAIN RENDER ---
    if (questions.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="ml-4">Preparing your quiz...</p>
            </div>
        );
    }
    
    switch (gameState) {
        case 'quiz': return <QuizScreen />;
        case 'results': return <ResultsScreen />;
        default: return <StartScreen />;
    }
};

export default QuizPage;






// import React, { useState, useEffect, useRef } from 'react';
// import { ChevronRight, ChevronLeft, RotateCcw, CheckCircle, XCircle, Trophy, BookOpen } from 'lucide-react';
// import { quizQuestions } from '../data/quizQuestions';
// import { Link, useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';


// const QuizPage = () => {
//   // --- STATE AND REFS ---
//   const { token } = useSelector((state) => state.auth);
//   const [gameState, setGameState] = useState('start'); // 'start', 'quiz', 'results'
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [answers, setAnswers] = useState([]);
//   const [score, setScore] = useState(0);
//   const [showAnswer, setShowAnswer] = useState(false);
//   const [timer, setTimer] = useState(60);
//   const timerInterval = useRef(null);

//   // --- EFFECTS ---
//   useEffect(() => {
//     setQuestions(quizQuestions);
//   }, []);

//   useEffect(() => {
//     if (gameState === 'quiz' && !showAnswer) {
//       timerInterval.current = setInterval(() => {
//         setTimer(t => (t > 0 ? t - 1 : 0));
//       }, 1000);
//     }
//     return () => clearInterval(timerInterval.current);
//   }, [gameState, showAnswer]);

//   useEffect(() => {
//     if (timer === 0) {
//       submitAnswer(true);
//     }
//   }, [timer]);

//   // --- LOGIC FUNCTIONS ---
//   const resetQuizState = () => {
//     setCurrentQuestion(0);
//     setSelectedAnswer(null);
//     setAnswers([]);
//     setScore(0);
//     setShowAnswer(false);
//     setTimer(60);
//   };

//   const startQuiz = () => {
//     resetQuizState();
//     setGameState('quiz');
//   };

//   const handleAnswerSelect = (index) => {
//     if (!showAnswer) setSelectedAnswer(index);
//   };

//   const submitAnswer = (isTimeUp = false) => {
//     clearInterval(timerInterval.current);
//     if (!isTimeUp && selectedAnswer === null) return;

//     const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
    
//     setAnswers(prev => [...prev, {
//       ...questions[currentQuestion],
//       selectedAnswer: selectedAnswer,
//       isCorrect,
//     }]);

//     if (isCorrect) setScore(s => s + 1);
//     setShowAnswer(true);
//   };

//   const nextQuestion = () => {
//     if (currentQuestion < questions.length - 1) {
//       setCurrentQuestion(q => q + 1);
//       setSelectedAnswer(null);
//       setShowAnswer(false);
//       setTimer(60);
//     } else {
//       setGameState('results');
//     }
//   };

//   const previousQuestion = () => {
//     if (currentQuestion > 0 && !showAnswer) {
//       const answersCopy = [...answers];
//       const lastAnswer = answersCopy.pop();
      
//       if (lastAnswer && lastAnswer.isCorrect) {
//         setScore(s => s - 1);
//       }
//       setAnswers(answersCopy);
//       setCurrentQuestion(q => q - 1);
//       setSelectedAnswer(null);
//       setTimer(60);
//     }
//   };

//   const restartQuiz = () => {
//     resetQuizState();
//     setGameState('start');
//   };

//   // --- UI SUB-COMPONENTS ---

//   const CircularTimer = ({ timeLeft, totalTime = 60 }) => {
//     const radius = 22;
//     const circumference = 2 * Math.PI * radius;
//     const progress = timeLeft / totalTime;
//     const strokeDashoffset = circumference * (1 - progress);
  
//     return (
//       <div className="relative w-14 h-14">
//         <svg className="w-full h-full" viewBox="0 0 52 52">
//           <circle className="stroke-gray-200" strokeWidth="4" fill="transparent" r={radius} cx="26" cy="26" />
//           <circle
//             className="transform -rotate-90 origin-center stroke-indigo-600"
//             strokeWidth="4" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" fill="transparent" r={radius} cx="26" cy="26"
//             style={{ transition: 'stroke-dashoffset 1s linear' }}
//           />
//         </svg>
//         <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-bold text-gray-800">
//           {timeLeft}
//         </span>
//       </div>
//     );
//   };

//   // const StartScreen = () => (
//   //   <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4 mt-[-29px] mb-[-70px]">
//   //     {/* Animated background elements */}
//   //     <div className="absolute inset-0 bg-black/20"></div>
//   //     <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
//   //     <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
//   //     <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      
//   //     {/* Grid pattern overlay */}
//   //     <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

//   //     {/*Card*/}
//   //     <div className="relative z-10 flex items-center justify-center min-h-screen p-4 pt-20">
//   //       <div className="w-full max-w-md mx-auto">
//   //           {/* Glass morphism card */}
//   //           <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8 text-center hover:bg-white/15 transition-all duration-500 transform hover:scale-105">
//   //               {/* Icon with glow effect */}
//   //               <div className="relative mb-6">
//   //                   <div className="absolute inset-0 bg-white/20 rounded-full blur-xl scale-150"></div>
//   //                   <div className="relative bg-gradient-to-br from-white/20 to-white/10 rounded-full p-4 backdrop-blur-sm border border-white/30">
//   //                       <BookOpen className="w-12 h-12 text-white mx-auto" />
//   //                   </div>
//   //               </div>
                
//   //               <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-white via-purple-100 to-indigo-100 bg-clip-text text-transparent">
//   //                   Ready for a Quiz?
//   //               </h1>
                
//   //               <p className="text-white/80 mb-8 text-lg leading-relaxed">
//   //                   Please go to your dashboard to generate a new quiz from a PDF.
//   //               </p>
                
//   //               <button
//   //                   onClick={startQuiz}
//   //                   className="group relative w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:via-indigo-500 hover:to-blue-500 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center space-x-3 overflow-hidden"
//   //               >
//   //                   {/* Button shine effect */}
//   //                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                    
//   //                   <span className="relative z-10">Go to Dashboard</span>
//   //                   <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
//   //               </button>
                
//   //           </div>
            
//   //           {/* Floating elements */}
//   //           <div className="absolute -top-0 -left-4 w-8 h-8 bg-white/10 rounded-full animate-float"></div>
//   //           <div className="absolute -bottom-[-60px] -right-20 w-6 h-6 bg-purple-400/20 rounded-full animate-float delay-1000"></div>
//   //       </div>
//   //     </div>
//   //   </div>
//   // );

//   const StartScreen = () => (
//     <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
//       {/* Animated background elements */}
//       <div className="absolute inset-0 bg-black/20"></div>
//       <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
//       <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
//       <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      
//       {/* Grid pattern overlay */}
//       <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

//       {/*Card*/}
//       <div className="relative z-10 w-full max-w-md mx-auto">
//           {/* Glass morphism card */}
//           <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8 text-center transition-all duration-500 transform hover:scale-105">
//               {/* Icon with glow effect */}
//               <div className="relative mb-6 w-24 h-24 mx-auto flex items-center justify-center">
//                   <div className="absolute inset-0 bg-white/20 rounded-full blur-xl scale-150"></div>
//                   <div className="relative bg-gradient-to-br from-white/20 to-white/10 rounded-full p-4 backdrop-blur-sm border border-white/30">
//                       <BookOpen className="w-12 h-12 text-white mx-auto" />
//                   </div>
//               </div>
              
//               <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-white via-purple-100 to-indigo-100 bg-clip-text text-transparent">
//                   Ready for a Quiz?
//               </h1>
              
//               <p className="text-white/80 mb-8 text-lg leading-relaxed">
//                   Generate a new quiz from a PDF or start a random one.
//               </p>
              
//               {/* Conditional Button: Renders a <button> for logged-in users and a <Link> for guests */}
//               {token ? (
//                 <button
//                   onClick={startQuiz}
//                   className="group relative w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:via-indigo-500 hover:to-blue-500 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center space-x-3 overflow-hidden"
//                 >
//                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
//                   <span className="relative z-10">Start Quiz</span>
//                   <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
//                 </button>
//               ) : (
//                 <Link
//                   to="/login"
//                   className="group relative w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:via-indigo-500 hover:to-blue-500 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center space-x-3 overflow-hidden"
//                 >
//                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
//                   <span className="relative z-10">Login to Start</span>
//                   <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
//                 </Link>
//               )}
//           </div>
//       </div>
//     </div>
//   );

//   const QuizScreen = () => {
//   const question = questions[currentQuestion];
//   const progress = ((currentQuestion + 1) / questions.length) * 100;
  
//   // Circular timer calculations (matching the first component)
//   const radius = 22;
//   const circumference = 2 * Math.PI * radius;
//   const strokeDashoffset = circumference * (1 - (timer / 60));
//   const isLowTime = timer <= 10;
  
//   return (
//     <div className="min-h-[calc(100vh-64px)] bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 py-8 px-4 flex items-center mt-[-20px]">
//       <div className="max-w-2xl mx-auto w-full">
//         {/* Progress Bar */}
//         <div className="mb-8">
//           <div className="flex justify-between items-center mb-2 text-sm font-medium text-gray-600">
//             <span>Question {currentQuestion + 1} of {questions.length}</span>
//             <span>Score: {score}</span>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-2">
//             <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
//           </div>
//         </div>

//         {/* Question Card */}
//         <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 relative">
//           {/* Circular Timer */}
//           <div className="absolute top-4 right-4">
//             <div className="relative w-14 h-14">
//               <svg className="w-full h-full" viewBox="0 0 52 52">
//                 <circle 
//                   className="stroke-current text-gray-200" 
//                   strokeWidth="4" 
//                   fill="transparent" 
//                   r={radius} 
//                   cx="26" 
//                   cy="26" 
//                 />
//                 <circle 
//                   className={`transform -rotate-90 origin-center ${isLowTime ? 'stroke-red-500' : 'stroke-indigo-600'}`} 
//                   strokeWidth="4" 
//                   strokeDasharray={circumference} 
//                   strokeDashoffset={strokeDashoffset} 
//                   strokeLinecap="round" 
//                   fill="transparent" 
//                   r={radius} 
//                   cx="26" 
//                   cy="26" 
//                   style={{ transition: 'stroke-dashoffset 1s linear' }} 
//                 />
//               </svg>
//               <span className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-bold ${isLowTime ? 'text-red-600' : 'text-indigo-800'}`}>
//                 {timer}
//               </span>
//             </div>
//           </div>
          
//           <span className="inline-block bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
//             {question.category}
//           </span>
//           <h2 className="text-2xl font-bold text-gray-900 leading-tight pr-16">
//             {question.question}
//           </h2>
          
//           {/* Options */}
//           <div className="mt-6 space-y-3">
//             {question.options.map((option, index) => {
//               let buttonClass = "w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ";
              
//               if (showAnswer) {
//                 if (index === question.correctAnswer) {
//                   buttonClass += "border-green-500 bg-green-50 text-green-800";
//                 } else if (index === selectedAnswer) {
//                   buttonClass += "border-red-500 bg-red-50 text-red-800";
//                 } else {
//                   buttonClass += "border-gray-200 bg-gray-50 text-gray-500";
//                 }
//               } else if (selectedAnswer === index) {
//                 buttonClass += "border-indigo-500 bg-indigo-50 text-indigo-800";
//               } else {
//                 buttonClass += "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700";
//               }
              
//               return (
//                 <button 
//                   key={index} 
//                   onClick={() => handleAnswerSelect(index)} 
//                   className={buttonClass} 
//                   disabled={showAnswer}
//                 >
//                   <div className="flex items-center justify-between">
//                     <span className="font-medium">{option}</span>
//                     {showAnswer && index === question.correctAnswer && (
//                       <CheckCircle className="w-5 h-5 text-green-600" />
//                     )}
//                     {showAnswer && index === selectedAnswer && index !== question.correctAnswer && (
//                       <XCircle className="w-5 h-5 text-red-600" />
//                     )}
//                   </div>
//                 </button>
//               );
//             })}
//           </div>
//         </div>
        
//         {/* Action Buttons */}
//         <div className="flex space-x-4">
//           {currentQuestion > 0 && !showAnswer && (
//             <button 
//               onClick={previousQuestion} 
//               className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
//             >
//               <ChevronLeft className="w-4 h-4" />
//               <span>Previous</span>
//             </button>
//           )}
          
//           {!showAnswer ? (
//             <button 
//               onClick={() => submitAnswer(false)} 
//               disabled={selectedAnswer === null} 
//               className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
//             >
//               Submit
//             </button>
//           ) : (
//             <button 
//               onClick={nextQuestion} 
//               className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-gray-200 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
//             >
//               <span>{currentQuestion === questions.length - 1 ? 'View Results' : 'Next Question'}</span>
//               <ChevronRight className="w-4 h-4" />
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

//   const ResultsScreen = () => {
//     const percentage = Math.round((score / questions.length) * 100);
//     return (
//       <div className="min-h-[calc(100vh-64px)]  bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 py-8 px-4 mt-[-20px]">
//         <div className="max-w-2xl mx-auto w-full">
//           <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 text-center">
//             <div className="mb-6">
//               <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
//                 <Trophy className="w-8 h-8 text-indigo-600" />
//               </div>
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h1>
//               <p className="text-gray-600">Here's how you performed</p>
//             </div>
//             <div className="grid grid-cols-2 gap-4 mb-6">
//               <div className="bg-green-50 rounded-lg p-4">
//                 <div className="text-2xl font-bold text-green-800">{score}</div>
//                 <div className="text-green-600">Correct</div>
//               </div>
//               <div className="bg-red-50 rounded-lg p-4">
//                 <div className="text-2xl font-bold text-red-800">{questions.length - score}</div>
//                 <div className="text-red-600">Incorrect</div>
//               </div>
//             </div>
//             <div className="text-center mb-6">
//               <div className="text-4xl font-bold text-indigo-600">{percentage}%</div>
//               <div className="text-gray-600">Final Score</div>
//             </div>
//           </div>

//           <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
//             <h2 className="text-xl font-bold text-gray-900 mb-6">Question Review</h2>
//             <div className="space-y-4">
//               {answers.map((answer, index) => (
//                 <div key={answer.id} className="border-l-4 border-gray-200 pl-4">
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1">
//                       <h3 className="font-medium text-gray-900 mb-2">{index + 1}. {answer.question}</h3>
//                       <div className="text-sm space-y-1">
//                         <div className={`flex items-center space-x-2 ${answer.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
//                           {answer.isCorrect ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
//                           <span>Your answer: {answer.selectedAnswer !== null ? answer.options[answer.selectedAnswer] : 'Not Answered'}</span>
//                         </div>
//                         {!answer.isCorrect && (
//                           <div className="text-green-700 flex items-center space-x-2">
//                             <CheckCircle className="w-4 h-4" />
//                             <span>Correct answer: {answer.options[answer.correctAnswer]}</span>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                     <span className={`px-2 py-1 rounded text-xs font-medium ${answer.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                       {answer.category}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//           <button onClick={restartQuiz} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
//             <RotateCcw className="w-4 h-4" />
//             <span>Take Quiz Again</span>
//           </button>
//         </div>
//       </div>
//     );
//   };

//   // --- MAIN RENDER ---
//   if (questions.length === 0) {
//     return (
//       <div className="min-h-screen bg-slate-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//       </div>
//     );
//   }
  
//   switch (gameState) {
//     case 'quiz': return <QuizScreen />;
//     case 'results': return <ResultsScreen />;
//     default: return <StartScreen />;
//   }
// };

// export default QuizPage;


