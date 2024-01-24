import React, { createContext, useState, useContext } from 'react';

export const ClickableContext = createContext();

export const useClickable = () => useContext(ClickableContext);

export const ClickableProvider = ({ children }) => {
  const [isClickable, setIsClickable] = useState(false);

  return (
    <ClickableContext.Provider value={{ isClickable, setIsClickable }}>
      {children}
    </ClickableContext.Provider>
  );
};
