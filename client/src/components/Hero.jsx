import { motion } from "framer-motion";

export default function Hero() {
  return (
    <motion.section
      className="bg-indigo-100 min-h-screen flex flex-col justify-center items-center text-center px-4"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <h2 className="text-4xl font-bold text-indigo-700 mb-4">
        Welcome to AllyNet
      </h2>
      <p className="text-gray-600 mb-6 text-lg max-w-xl">
        Bridging students with alumni for mentorship, guidance, and opportunity.
      </p>
      <motion.a
        href="/login"
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Get Started
      </motion.a>
    </motion.section>
  );
}
