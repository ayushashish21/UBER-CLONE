import React, { createContext, useState, useContext } from 'react';

// Export the raw context for the Provider
export const CaptainDataContext = createContext();

// Export the Provider component wrapper
export const CaptainContext = ({ children }) => {
  const [captain, setCaptain] = useState(null);

  return (
    <CaptainDataContext.Provider value={{ captain, setCaptain }}>
      {children}
    </CaptainDataContext.Provider>
  );
};

// Export the custom hook for clean imports in your pages
export const useCaptainContext = () => {
  const context = useContext(CaptainDataContext);
  if (!context) {
    throw new Error('useCaptainContext must be used within a CaptainContext provider');
  }
  return context;
};

export default CaptainContext;