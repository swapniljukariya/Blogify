import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiBookmark, FiClock, FiArrowRight, FiWifiOff, FiRefreshCw, FiDatabase, FiLayers } from 'react-icons/fi';
import { blogs as dummyBlogs } from '../data/dummyBLogs';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState('connecting');
  const [retryCount, setRetryCount] = useState(0);

  // Process dummy blogs data
  const processedDummyBlogs = useMemo(() => {
    return dummyBlogs.map(blog => ({
      id: `dummy-${blog.id}`,
      title: blog.title,
      description: blog.description ? 
        (blog.description.length > 150 ? blog.description.substring(0, 150) + '...' : blog.description) : 
        'No description available',
      category: blog.category || 'General',
      image: blog.image,
      readTime: blog.readTime || '5 min read',
      author: blog.author || 'Unknown Author',
      authorImage: blog.authorImage || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
      date: blog.date || new Date().toISOString().split('T')[0],
      source: 'dummy'
    }));
  }, []);

  // Fetch blogs from backend and combine with dummy data
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        setBackendStatus('connecting');
        
        // Try to fetch from backend
        const response = await fetch('http://localhost:5000/api/blog', {
          signal: AbortSignal.timeout(5000)
        });
        
        if (response.ok) {
          const backendBlogs = await response.json();
          console.log('Backend blogs:', backendBlogs); // Debug: see what backend returns
          
          // Transform backend data - USE ACTUAL FIELDS FROM DATABASE
          const transformedBackendBlogs = backendBlogs.map(blog => ({
            id: blog._id, // Use the actual database ID
            title: blog.title,
            description: blog.content ? 
              (blog.content.length > 150 ? blog.content.substring(0, 150) + '...' : blog.content) : 
              'No description available',
            category: (blog.tags && blog.tags.length > 0) ? blog.tags[0] : 'General',
            image: blog.coverImage, // USE ACTUAL coverImage FROM DATABASE
            readTime: '5 min read',
            author: blog.author?.fullName || 'Unknown Author',
            authorImage: blog.author?.profileImage || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
            date: blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : new Date().toISOString().split('T')[0],
            source: 'database'
          }));
          
          const combinedBlogs = [...transformedBackendBlogs, ...processedDummyBlogs];
          setBlogs(combinedBlogs);
          setBackendStatus('connected');
        } else {
          throw new Error(`Backend returned status: ${response.status}`);
        }
      } catch (err) {
        console.log('Backend connection failed, using only dummy data:', err.message);
        setError('Backend connection failed. Using demo data only.');
        setBackendStatus('failed');
        setBlogs(processedDummyBlogs);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [retryCount, processedDummyBlogs]);

  // Get unique categories from all blogs
  const categories = useMemo(() => {
    return ['All', ...new Set(blogs.map(blog => blog.category))];
  }, [blogs]);

  // Filter blogs
  useEffect(() => {
    const results = blogs.filter(blog => {
      const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          blog.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeFilter === 'All' || blog.category === activeFilter;
      return matchesSearch && matchesCategory;
    });
    setFilteredBlogs(results);
  }, [searchTerm, activeFilter, blogs]);

  // Clear search
  const clearSearch = () => setSearchTerm('');

  // Handle bookmark click
  const handleBookmark = (e, blogId) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Bookmarked blog:', blogId);
  };

  // Retry backend connection
  const retryConnection = () => {
    setRetryCount(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blogs...</p>
          <p className="text-sm text-gray-500 mt-2">Connecting to backend</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Connection Status Banner */}
      {backendStatus === 'failed' && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FiWifiOff className="text-yellow-400 mr-3" />
                <p className="text-yellow-700">
                  {error}
                </p>
              </div>
              <button 
                onClick={retryConnection}
                className="flex items-center text-yellow-700 hover:text-yellow-800 font-medium"
              >
                <FiRefreshCw className="mr-1" /> Retry Connection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Data Source Info */}
      <div className="bg-indigo-50 border-b border-indigo-200">
        <div className="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center text-sm text-indigo-700">
            {backendStatus === 'connected' ? (
              <>
                <FiDatabase className="mr-2" />
                <span>Showing {blogs.filter(b => b.source === 'database').length} database blogs + {blogs.filter(b => b.source === 'dummy').length} demo blogs</span>
              </>
            ) : (
              <>
                <FiLayers className="mr-2" />
                <span>Showing {blogs.length} demo blogs (backend offline)</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-900 to-purple-800 py-20 px-4 sm:px-6 lg:px-8 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Your Next Read</h1>
            <p className="text-xl text-indigo-200 max-w-2xl mx-auto">
              Explore our collection of insightful articles and tutorials
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 max-w-2xl mx-auto relative"
          >
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-10 py-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              />
              {searchTerm && (
                <button 
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-200 hover:text-white"
                >
                  <FiX size={20} />
                </button>
              )}
            </div>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-0 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-0 right-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map(category => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === category 
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results info */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {activeFilter === 'All' ? 'Latest Articles' : activeFilter}
          </h2>
          <p className="text-gray-500">
            Showing {filteredBlogs.length} {filteredBlogs.length === 1 ? 'result' : 'results'}
          </p>
        </div>

        {/* Blog Grid */}
        {filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredBlogs.map(blog => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  {/* FIXED: Add source parameter to the URL */}
                  <Link to={`/blog/${blog.id}?source=${blog.source}`} className="group block h-full">
                    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow h-full flex flex-col border border-gray-100 overflow-hidden">
                      {/* Source indicator */}
                      {blog.source === 'dummy' && (
                        <div className="absolute top-2 left-2 z-10">
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                            Demo
                          </span>
                        </div>
                      )}
                      
                      {/* Image - USE ACTUAL coverImage FROM DATABASE */}
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={blog.image} 
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                        <div className="absolute top-4 right-4">
                          <button 
                            className="p-2 bg-white/90 rounded-full text-gray-700 hover:bg-white transition-colors"
                            onClick={(e) => handleBookmark(e, blog.id)}
                          >
                            <FiBookmark className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center mb-3">
                          <span className="text-xs font-medium px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                            {blog.category}
                          </span>
                          <span className="ml-auto text-xs text-gray-500 flex items-center">
                            <FiClock className="mr-1" size={12} />
                            {blog.readTime}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                          {blog.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{blog.description}</p>

                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center">
                            {/* Author Image - USE ACTUAL profileImage FROM DATABASE */}
                            <img 
                              src={blog.authorImage} 
                              alt={blog.author}
                              className="w-8 h-8 rounded-full mr-3 object-cover"
                              onError={(e) => {
                                e.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
                                e.target.classList.add('object-contain');
                                e.target.classList.add('p-1');
                              }}
                            />
                            <span className="text-sm font-medium text-gray-700">{blog.author}</span>
                          </div>
                          <span className="text-indigo-600 group-hover:text-indigo-800 transition-colors flex items-center">
                            Read <FiArrowRight className="ml-1" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="mx-auto w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
              <FiSearch className="text-indigo-400" size={32} />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Try adjusting your search or filter criteria to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveFilter('All');
              }}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Reset filters
            </button>
          </motion.div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to start reading?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of readers discovering new insights every day.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md">
              Explore All Articles
            </button>
            <button className="px-8 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-sm border border-gray-300">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;