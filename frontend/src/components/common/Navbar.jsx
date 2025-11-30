import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { BrainCircuit, LogOut } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../operations/authAPI';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout(navigate));
  };
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header className={`backdrop-blur-md sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 border-b border-gray-200 shadow-sm' 
        : 'bg-white/10 border-b border-white/20'
    }`}>
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        
        {/* Brand/Logo */}
        <Link 
          to="/" 
          className={`flex items-center space-x-2 text-xl font-bold transition-colors duration-300 ${
            isScrolled ? 'text-gray-900' : 'text-white'
          }`}
        >
          <BrainCircuit className="h-7 w-7 text-indigo-400" />
          <span>Quizora</span>
        </Link>
        
        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          {token === null ? (
            // User is Logged Out
            <>
              <NavLink 
                to="/quiz"
                className={({ isActive }) => `transition-colors duration-300 ${
                  isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-gray-300 hover:text-white'
                } ${isActive ? 'text-indigo-400 font-semibold' : ''}`}
              >
                Try Me
              </NavLink>
              <NavLink 
                to="/login" 
                className={({ isActive }) => `transition-colors duration-300 ${
                  isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-gray-300 hover:text-white'
                } ${isActive ? 'text-indigo-400 font-semibold' : ''}`}
              >
                Login
              </NavLink>
              <NavLink 
                to="/signup" 
                className={`px-5 py-2 rounded-md font-semibold transition-all duration-300 ${
                  isScrolled ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                Sign Up
              </NavLink>
            </>
          ) : (
            // User is Logged In
            <>
              <NavLink 
                to="/dashboard"
                className={({ isActive }) => `transition-colors duration-300 ${
                  isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-gray-300 hover:text-white'
                } ${isActive ? 'text-indigo-400 font-semibold' : ''}`}
              >
                Quiz
              </NavLink>
              <button
                onClick={handleLogout}
                className={`flex items-center space-x-2 px-5 py-2 rounded-md font-semibold transition-all duration-300 ${
                  isScrolled ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-red-500/80 text-white hover:bg-red-500'
                }`}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;



// import React, { useState, useEffect } from 'react';
// import { Link, NavLink, useNavigate } from 'react-router-dom';
// import { BrainCircuit, LogOut } from 'lucide-react';
// import { useSelector, useDispatch } from 'react-redux';
// import { logout } from '../../operations/authAPI'; // Make sure this path is correct

// const Navbar = () => {
//     const [isScrolled, setIsScrolled] = useState(false);
//     const { token } = useSelector((state) => state.auth); // Read token from Redux store
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const handleLogout = () => {
//         dispatch(logout(navigate));
//     };
    
//     useEffect(() => {
//         const handleScroll = () => {
//             const scrollPosition = window.scrollY;
//             setIsScrolled(scrollPosition > 50); // A smaller value works better with most pages
//         };
        
//         window.addEventListener('scroll', handleScroll);
//         return () => window.removeEventListener('scroll', handleScroll);
//     }, []);
    
//     return (
//         <header className={`backdrop-blur-md sticky top-0 z-50 transition-all duration-300 ${
//             isScrolled 
//                 ? 'bg-white/95 border-b border-gray-200 shadow-sm' 
//                 : 'bg-white/10 border-b border-white/20'
//         }`}>
//             <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
                
//               {/* Brand/Logo */}
//               <Link 
//                   to="/" 
//                   className={`flex items-center space-x-2 text-xl font-bold transition-colors duration-300 ${
//                       isScrolled ? 'text-gray-900' : 'text-white'
//                   }`}
//               >
//                   <BrainCircuit className="h-7 w-7 text-indigo-400" />
//                   <span>Quizora</span>
//               </Link>
                
//               {/* Navigation Links */}
//               <div className="flex items-center space-x-6">
//                   <NavLink 
//                       to="/quiz" 
//                       className={({ isActive }) => `transition-colors duration-300 ${isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-gray-300 hover:text-white'} ${isActive ? 'text-indigo-400 font-semibold' : ''}`}
//                   >
//                       Quiz
//                   </NavLink>
                  
//                   {/* --- THIS IS THE CORRECTED LOGIC --- */}
//                   {token === null ? (
//                       // If user is LOGGED OUT, show Login and Sign Up
//                       <>
//                         <NavLink 
//                             to="/login" 
//                             className={({ isActive }) => `transition-colors duration-300 ${isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-gray-300 hover:text-white'} ${isActive ? 'text-indigo-400 font-semibold' : ''}`}
//                         >
//                             Login
//                         </NavLink>
//                         <NavLink 
//                             to="/signup" 
//                             className={`px-5 py-2 rounded-md font-semibold transition-all duration-300 ${isScrolled ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-white/20 text-white hover:bg-white/30'}`}
//                         >
//                             Sign Up
//                         </NavLink>
//                       </>
//                   ) : (
//                       // If user is LOGGED IN, show Logout button
//                       <button
//                           onClick={handleLogout}
//                           className={`flex items-center space-x-2 px-5 py-2 rounded-md font-semibold transition-all duration-300 ${isScrolled ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-red-500/80 text-white hover:bg-red-500'}`}
//                       >
//                           <LogOut size={18} />
//                           <span>Logout</span>
//                       </button>
//                   )}
//               </div>
//             </nav>
//         </header>
//     );
// };

// export default Navbar;

// import React from 'react';
// import { Link, NavLink, useNavigate } from 'react-router-dom';
// import { BrainCircuit, LogOut } from 'lucide-react';
// import { useSelector, useDispatch } from 'react-redux';
// import { logout } from '../../operations/authAPI';

// const Navbar = () => {
//   const { token } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     dispatch(logout(navigate));
//   };

//   return (
//     <header className="bg-gray-800/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-700">
//       <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        
//         <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-white">
//           <BrainCircuit className="h-7 w-7 text-indigo-400" />
//           <span>Quizora</span>
//         </Link>
        
//         <div className="flex items-center space-x-6">
//           {/* --- UPDATED CONDITIONAL LOGIC --- */}
//           {token === null ? (
//             // User is Logged Out
//             <>
//               <NavLink 
//                 to="/quiz" // Link to the local quiz
//                 className={({ isActive }) => `text-gray-300 hover:text-white transition-colors ${isActive ? 'text-indigo-400 font-semibold' : ''}`}
//               >
//                 Try Me
//               </NavLink>
//               <NavLink 
//                 to="/login" 
//                 className={({ isActive }) => `text-gray-300 hover:text-white transition-colors ${isActive ? 'text-indigo-400 font-semibold' : ''}`}
//               >
//                 Login
//               </NavLink>
//               <Link to="/signup" className="bg-indigo-600 text-white hover:bg-indigo-700 px-5 py-2 rounded-md font-semibold">
//                 Sign Up
//               </Link>
//             </>
//           ) : (
//             // User is Logged In
//             <>
//               <NavLink 
//                 to="/dashboard" // Link to the AI quiz dashboard
//                 className={({ isActive }) => `text-gray-300 hover:text-white transition-colors ${isActive ? 'text-indigo-400 font-semibold' : ''}`}
//               >
//                 Quiz
//               </NavLink>
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center space-x-2 bg-red-600 text-white hover:bg-red-700 px-5 py-2 rounded-md font-semibold"
//               >
//                 <LogOut size={18} />
//                 <span>Logout</span>
//               </button>
//             </>
//           )}
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Navbar;

