// OnboardingContext.js
import React, { createContext, useState, useContext } from 'react';

// Context 생성
const OnboardingContext = createContext();

// Provider 컴포넌트 생성
export function OnboardingProvider({ children }) {
  const [onboardingData, setOnboardingData] = useState({});

  // 데이터를 추가하거나 수정하는 함수
  const updateOnboardingData = (newData) => {
    setOnboardingData(prevData => ({ ...prevData, ...newData }));
  };

  const value = { onboardingData, updateOnboardingData };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

// Custom Hook 생성
export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}