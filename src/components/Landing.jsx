import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { blogs } from '../data/dummyBLogs';

export default function Landing() {
  const [isVisible, setIsVisible] = useState(false);
  const [featuredBlogs, setFeaturedBlogs] = useState([]);

  useEffect(() => {
    setIsVisible(true);
    // Get the 3 most recent blogs
    setFeaturedBlogs(blogs.slice(0, 3));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-pink-700 text-white px-4 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-indigo-800/70 to-pink-700/70 animate-pulse-slow"></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-float"
            style={{
              width: Math.random() * 10 + 2,
              height: Math.random() * 10 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500 rounded-full filter blur-3xl opacity-30 animate-orb-move-1"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-pink-500 rounded-full filter blur-3xl opacity-30 animate-orb-move-2"></div>

      <div className="container mx-auto py-12 relative z-10">
        {/* Hero Section */}
        <div className={`text-center space-y-8 max-w-2xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Logo with enhanced animation */}
          <div className="animate-float-slow">
            <h1 className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300 mb-2 drop-shadow-lg">
              Blogify
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full mt-4"></div>
          </div>
          
          {/* Tagline with staggered animation */}
          <div className="overflow-hidden">
            <p className="text-xl md:text-2xl font-light leading-relaxed text-purple-100 transform transition-all duration-700 delay-300 opacity-100 translate-y-0">
              Where <span className="font-medium text-purple-200">ideas become stories</span>. Share your thoughts, learn from others, and connect 
              with a world of passionate writers and readers.
            </p>
          </div>
          
          {/* CTA buttons with hover effects */}
          <div className="flex flex-col sm:flex-row justify-center gap-6 pt-4">
            <Link 
              to="/login" 
              className="group relative overflow-hidden bg-white text-purple-700 font-semibold px-8 py-4 rounded-full shadow-2xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300"
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link 
              to="/register" 
              className="group relative overflow-hidden bg-transparent border-2 border-white text-white font-semibold px-8 py-4 rounded-full shadow-2xl hover:shadow-white/20 hover:scale-105 transition-all duration-300"
            >
              <span className="relative z-10">Join Our Community</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>

        {/* Featured Blogs Section */}
        <div className="mt-24 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Featured Blogs</h2>
            <p className="text-purple-200 mt-2">Discover our latest and most popular stories</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBlogs.map((blog, index) => (
              <div 
                key={blog.id} 
                className="bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.02] group"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  transitionDelay: `${index * 0.05}s`
                }}
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={blog.image} 
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Featured
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center text-sm text-purple-200 mb-3">
                    <span className="font-medium">{blog.author}</span>
                    <span className="mx-2">•</span>
                    <span>{blog.date || "Recent"}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-purple-300 transition-colors">
                    {blog.title}
                  </h3>
                  
                  <p className="text-purple-100 line-clamp-3 mb-4">
                    {blog.description.length > 150 
                      ? `${blog.description.substring(0, 150)}...` 
                      : blog.description}
                  </p>
                  
                  <Link 
                    to={`/blog/${blog.id}`}
                    className="inline-flex items-center text-purple-300 font-medium hover:text-white transition-colors"
                  >
                    Read More
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/blogs"
              className="inline-flex items-center bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:scale-105"
            >
              View All Blogs
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-purple-300 mb-2">100+</div>
              <div className="text-purple-100">Published Blogs</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-300 mb-2">50+</div>
              <div className="text-purple-100">Active Writers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-300 mb-2">10K+</div>
              <div className="text-purple-100">Monthly Readers</div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to share your story?</h2>
          <p className="text-xl text-purple-100 mb-8">Join our community of writers and start publishing your ideas today.</p>
          <Link 
            to="/register" 
            className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-8 py-4 rounded-full shadow-2xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300"
          >
            Start Writing Now
          </Link>
        </div>
      </div>
      
      {/* Add custom animation keyframes to your global CSS */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          @keyframes float-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
          }
          @keyframes orb-move-1 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(50px, 50px) scale(1.1); }
          }
          @keyframes orb-move-2 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(-50px, -50px) scale(1.1); }
          }
          .animate-float {
            animation: float 10s ease-in-out infinite;
          }
          .animate-float-slow {
            animation: float-slow 8s ease-in-out infinite;
          }
          .animate-orb-move-1 {
            animation: orb-move-1 15s ease-in-out infinite;
          }
          .animate-orb-move-2 {
            animation: orb-move-2 20s ease-in-out infinite;
          }
          .animate-pulse-slow {
            animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}
      </style>
    </div>
  );
}