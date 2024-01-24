// App.js
import React, { useState } from 'react';
import SplashScreen from './pages/SplashScreen/SplashScreen';
import { ThemeProvider, useTheme } from './context/ThemeContext';

import { ClickableProvider } from './context/ClickableContext';

import './App.css';
import Content from './Content';

function App() {

  

  const [isLoading, setIsLoading] = useState(true);

  const finishSplashScreen = () => {
    setIsLoading(false);
  };

  return (
    <ThemeProvider>
      <ClickableProvider>
        <AppContent isLoading={isLoading} onFinished={finishSplashScreen} />
      </ClickableProvider>
    </ThemeProvider>
  );
}

function AppContent({ isLoading, onFinished }) {
  const { theme } = useTheme(); // Use the theme from your context

  return (
    <div className={`App ${theme === 'dark' ? 'dark' : 'light'}`}>
      {isLoading ? (
        <SplashScreen onFinished={onFinished} />
      ) : (
        <Content />
      )}
    </div>
  );
}

export default App;
