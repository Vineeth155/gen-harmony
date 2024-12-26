"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // On mount, check for saved theme or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light"); // Ensure light mode class is set
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = !isDarkMode ? "dark" : "light";
    setIsDarkMode(!isDarkMode);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light"); // Ensure light mode class is added
    }

    localStorage.setItem("theme", newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative flex bg-gray-800 dark:bg-gray-500 items-center justify-center w-8 h-8 rounded-full transition-colors"
    >
      {/* Moon Icon */}
      <motion.div
        initial={{ opacity: 1, x: isDarkMode ? -20 : 0 }}
        animate={{
          opacity: isDarkMode ? 1 : 0,
          x: isDarkMode ? 0 : -20,
        }}
        transition={{ duration: 0.4 }}
        className="absolute w-6 h-6 rounded-full flex items-center justify-center"
      >
        🌙
      </motion.div>

      {/* Sun Icon */}
      <motion.div
        initial={{ opacity: 1, x: isDarkMode ? 20 : 0 }}
        animate={{
          opacity: isDarkMode ? 0 : 1,
          x: isDarkMode ? 20 : 0,
        }}
        transition={{ duration: 0.4 }}
        className="absolute w-6 h-6 rounded-full flex items-center justify-center"
      >
        ☀️
      </motion.div>

      {/* Toggle Slider */}
      {/* <motion.div
        className="absolute w-8 h-8 bg-white rounded-full shadow-md"
        animate={{ x: isDarkMode ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      /> */}
    </button>
  );
};

export default ThemeToggle;
