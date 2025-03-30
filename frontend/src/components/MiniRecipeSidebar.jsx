import { motion } from "framer-motion";
import { FaClock, FaHeart, FaRegHeart, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useState } from "react";

const recipes = [
  { 
    id: 1,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200",
    title: "Avocado Toast",
    time: 5,
    likes: 24,
    liked: false
  },
  { 
    id: 2,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200",
    title: "Greek Salad",
    time: 10,
    likes: 18,
    liked: true
  },
  { 
    id: 3,
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=200",
    title: "Berry Smoothie",
    time: 7,
    likes: 32,
    liked: false
  },
  { 
    id: 4,
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=200",
    title: "Caprese Sandwich",
    time: 12,
    likes: 15,
    liked: false
  },
  { 
    id: 5,
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=200",
    title: "Margherita Pizza",
    time: 20,
    likes: 42,
    liked: true
  },
  { 
    id: 6,
    image: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=200",
    title: "Chocolate Pancakes",
    time: 15,
    likes: 37,
    liked: false
  },
  { 
    id: 7,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200",
    title: "Beef Burger",
    time: 18,
    likes: 29,
    liked: false
  },
  { 
    id: 8,
    image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=200",
    title: "Vegetable Stir Fry",
    time: 12,
    likes: 21,
    liked: true
  },
  { 
    id: 9,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200",
    title: "Chicken Caesar Wrap",
    time: 10,
    likes: 33,
    liked: false
  },
  { 
    id: 10,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=200",
    title: "Fruit Yogurt Bowl",
    time: 5,
    likes: 28,
    liked: true
  }
];

const MiniRecipeSidebar = () => {
  const [showAll, setShowAll] = useState(false);
  const displayedRecipes = showAll ? recipes : recipes.slice(0, 5);

  return (
    <motion.div
      className="bg-white shadow-md rounded-lg p-4 w-80 sticky top-4"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">Quick Recipes</h3>
        <motion.button
          className="text-xs text-primary hover:underline flex items-center gap-1"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? (
            <>
              <span>Show Less</span>
              <FaChevronUp className="text-xs" />
            </>
          ) : (
            <>
              <span>View All</span>
              <FaChevronDown className="text-xs" />
            </>
          )}
        </motion.button>
      </div>
      
      <div className="flex flex-col gap-3">
        {displayedRecipes.map((recipe, index) => (
          <motion.div
            key={recipe.id}
            className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors border border-gray-200"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.div 
              className="relative"
              whileHover={{ rotate: 2 }}
            >
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-16 h-16 object-cover rounded-md shadow-sm"
              />
              <motion.div 
                className="absolute bottom-1 left-1 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <FaClock className="text-xs" />
                <span>{recipe.time} min</span>
              </motion.div>
            </motion.div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-800 truncate">{recipe.title}</h4>
              <div className="flex items-center gap-2 mt-1">
                <motion.button 
                  className="text-xs text-gray-500 hover:text-red-500"
                  whileTap={{ scale: 0.9 }}
                >
                  {recipe.liked ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart />
                  )}
                </motion.button>
                <span className="text-xs text-gray-500">{recipe.likes}</span>
              </div>
            </div>

            <motion.button
              className="bg-primary hover:bg-primary-dark text-white px-3 py-1 text-xs rounded-md whitespace-nowrap"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View
            </motion.button>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="mt-4 pt-3 border-t border-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-xs text-gray-500 text-center">
          {showAll ? `${recipes.length} quick recipes` : "Try these quick recipes for busy days!"}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default MiniRecipeSidebar;