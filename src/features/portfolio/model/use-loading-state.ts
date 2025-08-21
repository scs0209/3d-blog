import { useState } from 'react';

export const useLoadingState = () => {
  const [showWorksLoading, setShowWorksLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingBarFullExpand, setLoadingBarFullExpand] = useState(false);
  const [showExitLoading, setShowExitLoading] = useState(false);
  const [exitLoadingProgress, setExitLoadingProgress] = useState(100);
  const [showPortfolioContent, setShowPortfolioContent] = useState(true);
  const [portfolioExiting, setPortfolioExiting] = useState(false);
  const [showCards, setShowCards] = useState(false);

  const resetLoadingState = () => {
    setShowWorksLoading(false);
    setLoadingProgress(0);
    setLoadingBarFullExpand(false);
    setShowExitLoading(false);
    setExitLoadingProgress(100);
    setShowPortfolioContent(true);
    setPortfolioExiting(false);
    setShowCards(false);
  };

  return {
    // State
    showWorksLoading,
    loadingProgress,
    loadingBarFullExpand,
    showExitLoading,
    exitLoadingProgress,
    showPortfolioContent,
    portfolioExiting,
    showCards,
    // Setters
    setShowWorksLoading,
    setLoadingProgress,
    setLoadingBarFullExpand,
    setShowExitLoading,
    setExitLoadingProgress,
    setShowPortfolioContent,
    setPortfolioExiting,
    setShowCards,
    // Actions
    resetLoadingState,
  };
};
