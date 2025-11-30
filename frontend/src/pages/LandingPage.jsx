import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, UserCheck, Trophy } from 'lucide-react';


// Import your local video file
import heroVideo from '../assets/a_bit_longer_the_video_is_ama.mp4';

// Register the GSAP plugin once
gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const main = useRef();

  useEffect(() => {
    // GSAP context provides easy cleanup
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".video-section",
          start: "top top",
          end: "bottom top",
          scrub: 2,
          pin: true,
        }
      });

      tl.to(".scroll-video", {
        scale: 1.9,
        ease: "power1.inOut"
      });
      
      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: ".features-grid",
          start: "top 80%",
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      });

    }, main); // Scope animations to the main ref

    return () => ctx.revert(); // Cleanup GSAP animations
  }, []);

  return (
    <div ref={main} className="bg-white text-gray-800 font-unbounded mt-[-29px]">
      
      {/* App Name Full Screen Section */}
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 via-rose-500 to-orange-400 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='65' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
        <div className="text-center z-10">
          <h1 className="text-8xl md:text-9xl lg:text-[12rem] text-rose-300 tracking-wider select-none">
            QUIZORA
          </h1>
          <div className="mt-6 w-32 h-1 bg-gradient-to-r from-pink-400 to-purple-300 mx-auto rounded-full"></div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="flex flex-col items-center">
            <span className="text-sm mb-2 opacity-80">Scroll down</span>
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center"><div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div></div>
          </div>
        </div>
      </div>

      {/* Video Scroll Animation Section */}
      <div className="video-section h-screen w-full bg-gradient-to-br from-white to-gray-400 flex items-center justify-center overflow-hidden">
        <video 
          className="scroll-video w-96 h-64 object-cover rounded-2xl shadow-2xl"
          style={{ transformOrigin: 'center center', filter: 'brightness(0.9) contrast(1.1)' }}
          autoPlay loop muted playsInline
        >
          <source src={heroVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Hero Section */}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-400 p-6">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-800 animate-fade-in-down">
            Transform Documents into <span className="text-indigo-600">Knowledge</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-600 font-sans max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            Upload any PDF and let our AI create a personalized quiz for you. The smartest way to study, prepare, and master any subject.
          </p>
          <div className="mt-8 animate-fade-in-up" style={{ animationDelay: '1s' }}>
            <Link
              to="/quiz"
              className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 duration-300"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-white to-gray-400">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Unlock Your Learning Potential</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12 font-sans">
            Quizora is more than just a quiz app. It's a powerful tool designed to enhance your learning experience.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 features-grid">
            <div className="feature-card p-8 bg-gray-50 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="bg-indigo-100 text-indigo-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6"><FileText size={32} /></div>
              <h3 className="text-2xl font-bold mb-3">AI Quiz Generation</h3>
              <p className="text-gray-600 font-sans">Our AI reads your PDFs, understands the context, and generates relevant questions in seconds.</p>
            </div>
            <div className="feature-card p-8 bg-gray-50 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="bg-indigo-100 text-indigo-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6"><UserCheck size={32} /></div>
              <h3 className="text-2xl font-bold mb-3">Track Your Progress</h3>
              <p className="text-gray-600 font-sans">Create a profile to save your results, track scores over time, and identify areas for improvement.</p>
            </div>
            <div className="feature-card p-8 bg-gray-50 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="bg-indigo-100 text-indigo-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6"><Trophy size={32} /></div>
              <h3 className="text-2xl font-bold mb-3">Compete & Conquer</h3>
              <p className="text-gray-600 font-sans">Challenge your friends, compete on leaderboards, and prove your mastery of the subject matter.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;