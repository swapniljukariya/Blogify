import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const BlogCard = ({ blog, horizontal = false }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/blogs/${blog.id}`); // Assuming your route is '/blogs/:id'
  };

  if (horizontal) {
    return (
      <motion.div 
        className="bg-white rounded-2xl overflow-hidden shadow-xl h-full flex cursor-pointer"
        whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
        onClick={handleClick}
      >
        <div className="w-1/3">
          <img 
            src={blog.image} 
            alt={blog.title} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-2/3 p-6 flex flex-col">
          <div className="flex items-center mb-3">
            <span className="text-xs font-medium px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full">
              {blog.category}
            </span>
            <span className="text-xs text-gray-500 ml-auto">
              {blog.date}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{blog.title}</h3>
          <p className="text-gray-600 mb-4 line-clamp-3">{blog.excerpt}</p>
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center">
              <img 
                src={blog.authorImage} 
                alt={blog.author} 
                className="w-8 h-8 rounded-full mr-2"
              />
              <span className="text-sm text-gray-700">{blog.author}</span>
            </div>
            <button 
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the card's onClick
                handleClick();
              }}
            >
              Read <span className="hidden sm:inline ml-1">More</span> →
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow h-full flex flex-col cursor-pointer"
      whileHover={{ y: -5 }}
      onClick={handleClick}
    >
      <div className="h-48 overflow-hidden">
        <motion.img 
          src={blog.image} 
          alt={blog.title} 
          className="w-full h-full object-cover hover:scale-105 transition-transform"
          whileHover={{ scale: 1.05 }}
        />
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center mb-3">
          <span className="text-xs font-medium px-3 py-1 bg-pink-100 text-pink-800 rounded-full">
            {blog.category}
          </span>
          <span className="text-xs text-gray-500 ml-auto">
            {blog.date}
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{blog.title}</h3>
        <p className="text-gray-600 mb-4 flex-1">{blog.excerpt}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src={blog.authorImage} 
              alt={blog.author} 
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="text-sm text-gray-700">{blog.author}</span>
          </div>
          <button 
            className="text-pink-600 hover:text-pink-800 text-sm font-medium"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the card's onClick
              handleClick();
            }}
          >
            Read More →
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogCard;