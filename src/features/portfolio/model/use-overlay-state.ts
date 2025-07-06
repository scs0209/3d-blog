import { useState } from 'react';

export const useOverlayState = () => {
  const [showAboutMeOverlay, setShowAboutMeOverlay] = useState(false);
  const [showExperienceOverlay, setShowExperienceOverlay] = useState(false);
  const [aboutMeClosing, setAboutMeClosing] = useState(false);
  const [experienceClosing, setExperienceClosing] = useState(false);
  const [contactClosing, setContactClosing] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [aboutMeAnimationDone, setAboutMeAnimationDone] = useState(false);

  const resetOverlayState = () => {
    setShowAboutMeOverlay(false);
    setShowExperienceOverlay(false);
    setAboutMeClosing(false);
    setExperienceClosing(false);
    setContactClosing(false);
    setShowContactForm(false);
    setAboutMeAnimationDone(false);
  };

  return {
    // State
    showAboutMeOverlay,
    showExperienceOverlay,
    aboutMeClosing,
    experienceClosing,
    contactClosing,
    showContactForm,
    aboutMeAnimationDone,
    // Setters
    setShowAboutMeOverlay,
    setShowExperienceOverlay,
    setAboutMeClosing,
    setExperienceClosing,
    setContactClosing,
    setShowContactForm,
    setAboutMeAnimationDone,
    // Actions
    resetOverlayState,
  };
};
