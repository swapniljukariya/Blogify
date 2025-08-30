import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiClock, FiUser, FiCalendar, FiTag, FiHeart, FiMessageSquare, FiSend, FiThumbsUp } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState, useEffect } from 'react';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDummyBlog, setIsDummyBlog] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        
        // Check if it's a dummy blog (has 'dummy-' prefix)
        if (id.startsWith('dummy-')) {
          setIsDummyBlog(true);
          const cleanId = id.replace('dummy-', '');
          const { blogs } = await import('../data/dummyBLogs');
          const foundBlog = blogs.find(b => b.id === parseInt(cleanId));
          
          if (foundBlog) {
            setBlog({
              id: foundBlog.id,
              title: foundBlog.title,
              content: foundBlog.content || foundBlog.description,
              author: foundBlog.author,
              authorImage: foundBlog.authorImage || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
              coverImage: foundBlog.image,
              date: foundBlog.date,
              tags: foundBlog.tags || [foundBlog.category || 'General'],
              readTime: foundBlog.readTime || '5 min read'
            });
            // Set dummy likes and comments
            setLikes(Math.floor(Math.random() * 50) + 10);
            setComments(generateDummyComments());
          } else {
            throw new Error('Dummy blog not found');
          }
        } else {
          // Fetch from database
          setIsDummyBlog(false);
          const response = await fetch(`http://localhost:5000/api/blog/${id}`);
          
          if (response.ok) {
            const blogData = await response.json();
            setBlog({
              id: blogData._id,
              title: blogData.title,
              content: blogData.content,
              author: blogData.author?.fullName || 'Unknown Author',
              authorImage: blogData.author?.profileImage || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
              coverImage: blogData.coverImage,
              date: blogData.createdAt,
              tags: blogData.tags || [],
              readTime: calculateReadTime(blogData.content)
            });
            setLikes(blogData.likes?.length || 0);
            setComments(blogData.comments || []);
          } else if (response.status === 404) {
            throw new Error('Blog not found in database');
          } else {
            throw new Error('Failed to fetch blog from server');
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  // Generate dummy comments for demo
  const generateDummyComments = () => {
    return [
      {
        _id: '1',
        user: {
          fullName: 'Sarah Johnson',
          profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
        },
        comment: 'This is exactly what I was looking for! Thanks for the detailed explanation.',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: '2',
        user: {
          fullName: 'Mike Chen',
          profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
        },
        comment: 'Great post! I especially liked the section about best practices.',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: '3',
        user: {
          fullName: 'Emma Davis',
          profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
        },
        comment: 'Could you elaborate more on the performance optimization part?',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  };

  // Helper function to calculate read time
  const calculateReadTime = (content) => {
    if (!content) return '5 min read';
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const handleLike = async () => {
    if (isDummyBlog) {
      // Handle dummy like
      setLikes(prev => isLiked ? prev - 1 : prev + 1);
      setIsLiked(!isLiked);
      return;
    }

    try {
      // TODO: Implement actual like API call
      setLikes(prev => isLiked ? prev - 1 : prev + 1);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (isDummyBlog) {
      // Handle dummy comment
      const dummyComment = {
        _id: Date.now().toString(),
        user: {
          fullName: 'Current User',
          profileImage: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
        },
        comment: newComment,
        createdAt: new Date().toISOString()
      };
      setComments(prev => [dummyComment, ...prev]);
      setNewComment('');
      return;
    }

    try {
      // TODO: Implement actual comment API call
      const comment = {
        _id: Date.now().toString(),
        user: {
          fullName: 'Current User',
          profileImage: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
        },
        comment: newComment,
        createdAt: new Date().toISOString()
      };
      setComments(prev => [comment, ...prev]);
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Blog Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The blog you are looking for does not exist.'}</p>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      {/* Demo indicator for dummy blogs */}
      {isDummyBlog && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded">
          <p className="font-medium">Demo Content</p>
          <p className="text-sm">This is sample demo data for testing purposes.</p>
        </div>
      )}

      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors"
      >
        <FiArrowLeft className="mr-2" />
        Back to Blogs
      </button>

      <article className="prose prose-lg max-w-none mb-12">
        {/* Blog Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>
          
          {/* Author Info */}
          <div className="flex items-center mb-4">
            <img 
              src={blog.authorImage} 
              alt={blog.author}
              className="w-12 h-12 rounded-full mr-4 object-cover"
              onError={(e) => {
                e.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
              }}
            />
            <div>
              <p className="font-medium text-gray-900">{blog.author}</p>
              <div className="flex items-center text-sm text-gray-500 space-x-4">
                {blog.date && (
                  <span className="flex items-center">
                    <FiCalendar className="mr-1" size={12} />
                    {new Date(blog.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                )}
                <span className="flex items-center">
                  <FiClock className="mr-1" size={12} />
                  {blog.readTime}
                </span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  <FiTag className="mr-1" size={12} />
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Cover Image */}
          {blog.coverImage && (
            <img 
              src={blog.coverImage} 
              alt={blog.title}
              className="w-full h-auto mb-8 rounded-lg shadow-lg object-cover max-h-96"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
              }}
            />
          )}
        </header>

        {/* Formatted Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({node, inline, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    language={match[1]}
                    style={atomDark}
                    PreTag="div"
                    showLineNumbers
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                    {children}
                  </code>
                );
              },
              img({node, ...props}) {
                return (
                  <div className="my-6">
                    <img 
                      {...props} 
                      className="rounded-lg shadow-md mx-auto max-h-96 object-contain"
                      alt={props.alt || 'Blog image'}
                    />
                    {props.alt && (
                      <p className="text-center text-sm text-gray-500 mt-2">
                        {props.alt}
                      </p>
                    )}
                  </div>
                )
              }
            }}
          >
            {blog.content}
          </ReactMarkdown>
        </div>
      </article>

      {/* Like and Comment Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        {/* Engagement Stats */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-6">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 transition-colors ${
                isLiked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
              }`}
            >
              <FiHeart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
            </button>
            
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <FiMessageSquare className="w-5 h-5" />
              <span>{comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}</span>
            </button>
          </div>
        </div>

        {/* Comment Input */}
        <form onSubmit={handleCommentSubmit} className="mb-6">
          <div className="flex space-x-3">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png" 
              alt="Your profile" 
              className="w-10 h-10 rounded-full flex-shrink-0"
            />
            <div className="flex-1">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <FiSend className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Comments List */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {comments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
              ) : (
                comments.map((comment) => (
                  <motion.div
                    key={comment._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex space-x-3 p-4 bg-gray-50 rounded-lg"
                  >
                    <img 
                      src={comment.user.profileImage} 
                      alt={comment.user.fullName}
                      className="w-10 h-10 rounded-full flex-shrink-0 object-cover"
                      onError={(e) => {
                        e.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900">{comment.user.fullName}</h4>
                        <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-gray-700">{comment.comment}</p>
                      
                      {/* Comment Actions */}
                      <div className="flex items-center space-x-4 mt-2">
                        <button className="text-sm text-gray-500 hover:text-blue-600 flex items-center">
                          <FiThumbsUp className="w-3 h-3 mr-1" />
                          Like
                        </button>
                        <button className="text-sm text-gray-500 hover:text-blue-600">
                          Reply
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Related Posts Suggestion */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4 text-blue-900">Enjoyed this article?</h3>
        <p className="text-blue-700 mb-4">
          Check out more posts about {blog.tags && blog.tags.length > 0 ? blog.tags[0] : 'similar topics'}.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Explore More Articles
        </button>
      </div>
    </motion.div>
  );
};

export default BlogDetails;