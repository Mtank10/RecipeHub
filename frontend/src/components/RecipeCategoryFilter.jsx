import { useQuery,gql } from "@apollo/client";
import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";


const GET_CATEGORIES = gql`
  query GetCategories {
    categories
  }
`;




const RecipeCategoryFilter = ({ selectedCategory, setSelectedCategory }) => {
  const { loading, error, data } = useQuery(GET_CATEGORIES);
  if (loading) return <FaSpinner className="text-gray-200"/>
  if (error) return <p>Error loading categories</p>;

  return (
    <div className="flex gap-4 mb-6">
      {data.categories.map((category, index) => (
        <motion.button
          key={category}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
            selectedCategory === category
              ? "bg-black text-white"
              : "bg-white text-gray-700"
          }`}
          onClick={() => setSelectedCategory(category)}
          whileHover={{ scale: 1.1 }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          {category}
        </motion.button>
      ))}
    </div>
  );
};

export default RecipeCategoryFilter;
