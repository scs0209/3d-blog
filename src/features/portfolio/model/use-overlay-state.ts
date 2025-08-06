import { useState } from 'react';

export const useOverlayState = () => {
  const [showAboutMeOverlay, setShowAboutMeOverlay] = useState(false);
  const [showExperienceOverlay, setShowExperienceOverlay] = useState(false);
  const [showSkillsOverlay, setShowSkillsOverlay] = useState(false);
  const [aboutMeClosing, setAboutMeClosing] = useState(false);
  const [experienceClosing, setExperienceClosing] = useState(false);
  const [skillsClosing, setSkillsClosing] = useState(false);
  const [contactClosing, setContactClosing] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [aboutMeAnimationDone, setAboutMeAnimationDone] = useState(false);

  const resetOverlayState = () => {
    setShowAboutMeOverlay(false);
    setShowExperienceOverlay(false);
    setShowSkillsOverlay(false);
    setAboutMeClosing(false);
    setExperienceClosing(false);
    setSkillsClosing(false);
    setContactClosing(false);
    setShowContactForm(false);
    setAboutMeAnimationDone(false);
  };

  return {
    // State
    showAboutMeOverlay,
    showExperienceOverlay,
    showSkillsOverlay,
    aboutMeClosing,
    experienceClosing,
    skillsClosing,
    contactClosing,
    showContactForm,
    aboutMeAnimationDone,
    // Setters
    setShowAboutMeOverlay,
    setShowExperienceOverlay,
    setShowSkillsOverlay,
    setAboutMeClosing,
    setExperienceClosing,
    setSkillsClosing,
    setContactClosing,
    setShowContactForm,
    setAboutMeAnimationDone,
    // Actions
    resetOverlayState,
  };
};
