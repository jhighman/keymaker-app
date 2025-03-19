import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle, theme } from './theme';
import KeyMaker from './components/KeyMaker';
import KeyAnalyzer from './components/KeyAnalyzer';
import styled from 'styled-components';

const AppContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const Tab = styled.button`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  border: none;
  background: none;
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.textLight};
  font-size: 1rem;
  cursor: pointer;
  border-bottom: 2px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  transition: all 0.2s;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const App = () => {
  const [activeTab, setActiveTab] = useState('maker');

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppContainer>
        <TabContainer>
          <Tab 
            active={activeTab === 'maker'} 
            onClick={() => setActiveTab('maker')}
          >
            Generate Key
          </Tab>
          <Tab 
            active={activeTab === 'analyzer'} 
            onClick={() => setActiveTab('analyzer')}
          >
            Analyze Key
          </Tab>
        </TabContainer>
        
        {activeTab === 'maker' ? <KeyMaker /> : <KeyAnalyzer />}
      </AppContainer>
    </ThemeProvider>
  );
};

export default App; 