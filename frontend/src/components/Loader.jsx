import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";

const Loader = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const dotVariants = {
    hidden: { y: 0 },
    visible: {
      y: [0, -15, 0],
      transition: {
        repeat: Infinity,
        duration: 1,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
      <motion.div
        className="flex flex-col items-center gap-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Animated icon */}
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "linear",
          }}
        >
        {/* <FaSpinner className="text-4xl text-primary " /> */}
        </motion.div>

        {/* Loading text */}
        <motion.p
          className="text-lg font-medium text-gray-800"
          animate={{
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
          }}
        >
          Cooking up something delicious...
        </motion.p>

        {/* Animated dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full bg-blue-500"
              variants={dotVariants}
              custom={i}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Loader;