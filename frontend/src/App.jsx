import React from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/common/Navbar';
import { Route, Routes } from 'react-router-dom';
import Footer from "./components/common/Footer.jsx";
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';

// Import the components we need to protect and add
import QuizPage from './pages/QuizPage'; 
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/core/ProtectedRoute';

function App() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Routes */}
          <Route 
            path="/quiz" 
            element={
              <ProtectedRoute> {/* Wrap QuizPage with ProtectedRoute */}
                <QuizPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" // Add the new protected route for the Dashboard
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Toaster />
      <Footer />
    </div>
  );
}

export default App;



// import React from 'react';
// import { Toaster } from 'react-hot-toast';
// import Navbar from './components/common/Navbar';
// import { Route, Routes } from 'react-router-dom';
// import QuizPage from './pages/QuizPage'; 
// import LandingPage from './pages/LandingPage';
// import Footer from "./components/common/Footer.jsx";
// import SignupPage from './pages/SignupPage';
// import LoginPage from './pages/LoginPage';


// function App() {
//   return (
//     <div className="bg-gray-50 min-h-screen flex flex-col">
//       <Navbar />
      
//       <main>
//         <Routes>
//           <Route path="/" element={<LandingPage />} />
           
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/signup" element={<SignupPage />} />

//           {/* Protected Route */}
//           <Route 
//             path="/quiz" 
//             element={<QuizPage />} 
//           />
//         </Routes>
//       </main>
//       <Toaster />
//       <Footer />
//     </div>
//   );
// }

// export default App;


