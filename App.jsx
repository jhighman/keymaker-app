import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme, GlobalStyle } from './theme';
import Navigation from './components/Navigation';
import KeyMaker from './components/KeyMaker';
import InviteAndTrack from './components/InviteAndTrack';
import KeyAnalyser from './components/KeyAnalyser';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<KeyMaker />} />
          <Route path="/analyze" element={<KeyAnalyser />} />
          <Route path="/analyse" element={<KeyAnalyser />} />
          <Route path="/invite" element={<InviteAndTrack />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App; 