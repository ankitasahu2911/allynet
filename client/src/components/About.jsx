import { motion } from "framer-motion";

export default function About() {
  return (
    <motion.section
      id="about"
      className="min-h-screen flex flex-col justify-center items-center px-4 py-16 bg-white"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="max-w-5xl text-center">
        <h3 className="text-3xl font-semibold text-indigo-700 mb-6">
          About AllyNet
        </h3>
        <p className="text-gray-700 text-lg">
          AllyNet is a platform designed for college students to connect with alumni for mentorship,
          internships, mental wellness support, and real-world career guidance. Whether you're a
          final-year student seeking clarity or an alumnus willing to give back — this is your space.
        </p>
      </div>
    </motion.section>
  );
}
