import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const updateTheme = (e) => {
      setTheme(e.matches ? "dark" : "light");
    };
    const query = window.matchMedia("(prefers-color-scheme: dark)");

    updateTheme(query);

    query.addEventListener("change", updateTheme);

    return () => query.removeEventListener("change", updateTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);