import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: ${props => props.theme.spacing.xl};
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h2`
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const InputGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Input = styled.input`
  flex: 1;
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-family: ${props => props.theme.fonts.mono};
`;

const AnalyzeButton = styled.button`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
  }

  &:disabled {
    background: ${props => props.theme.colors.textLight};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  margin-bottom: ${props => props.theme.spacing.lg};
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.errorLight};
  border-radius: ${props => props.theme.borderRadius.md};
`;

const ResultCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.md};
`;

const ResultSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ResultTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const ResultItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.sm};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const languages = {
  en: 'English',
  es: 'Spanish',
  fr: 'French'
};

const timelineLabels = {
  '000': '1 Entry (0 years)',
  '001': '3 Years',
  '010': '5 Years',
  '011': '7 Years',
  '100': '10 Years'
};

const KeyAnalyzer = () => {
  const [key, setKey] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const analyzeKey = (inputKey) => {
    // Reset error state
    setError(null);

    // Basic validation
    if (!inputKey) {
      setError('Please enter a key to analyze');
      return null;
    }

    if (inputKey.length < 2) {
      setError('Invalid key format: Key must be at least 2 characters long');
      return null;
    }

    const language = inputKey[0] + inputKey[1];
    const bits = inputKey.slice(2);

    // Validate language
    if (!languages[language]) {
      setError(`Invalid language code: ${language}`);
      return null;
    }

    // Validate bits length (should be 14: 1 + 3 + 4 + 3 + 3)
    if (bits.length !== 14) {
      setError(`Invalid key length: Expected 14 bits after language code, got ${bits.length}`);
      return null;
    }

    // Validate bits content
    if (!/^[01]+$/.test(bits)) {
      setError('Invalid key format: Key must contain only 0s and 1s after the language code');
      return null;
    }

    // Parse the bits according to the structure
    const consents = {
      driverLicense: bits[1] === '1',
      drugTest: bits[2] === '1',
      biometric: bits[3] === '1'
    };

    const steps = {
      education: bits[4] === '1',
      professionalLicense: bits[5] === '1',
      residence: bits[6] === '1',
      employment: bits[9] === '1'
    };

    const timelines = {
      residence: bits.slice(7, 10),
      employment: bits.slice(10, 13)
    };

    // Validate timeline codes
    if (steps.residence && !timelineLabels[timelines.residence]) {
      setError(`Invalid residence timeline code: ${timelines.residence}`);
      return null;
    }

    if (steps.employment && !timelineLabels[timelines.employment]) {
      setError(`Invalid employment timeline code: ${timelines.employment}`);
      return null;
    }

    return {
      language,
      consents,
      steps,
      timelines
    };
  };

  const handleKeyChange = (e) => {
    const inputKey = e.target.value.trim();
    setKey(inputKey);
    // Clear previous analysis when input changes
    setAnalysis(null);
    setError(null);
  };

  const handleAnalyze = () => {
    setAnalysis(analyzeKey(key));
  };

  return (
    <Container>
      <Title>Key Analyzer</Title>
      <InputGroup>
        <Input
          type="text"
          placeholder="Enter a key to analyze (e.g., en1000000000000)"
          value={key}
          onChange={handleKeyChange}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleAnalyze();
            }
          }}
        />
        <AnalyzeButton 
          onClick={handleAnalyze}
          disabled={!key.trim()}
        >
          Analyze Key
        </AnalyzeButton>
      </InputGroup>
      
      {error && (
        <ErrorMessage>
          {error}
        </ErrorMessage>
      )}
      
      {analysis && !error && (
        <ResultCard>
          <ResultSection>
            <ResultTitle>Language</ResultTitle>
            <ResultItem>
              <span>Selected Language:</span>
              <span>{languages[analysis.language]}</span>
            </ResultItem>
          </ResultSection>

          <ResultSection>
            <ResultTitle>Consents</ResultTitle>
            <ResultItem>
              <span>Driver's License:</span>
              <span>{analysis.consents.driverLicense ? 'Yes' : 'No'}</span>
            </ResultItem>
            <ResultItem>
              <span>Drug Test:</span>
              <span>{analysis.consents.drugTest ? 'Yes' : 'No'}</span>
            </ResultItem>
            <ResultItem>
              <span>Biometric Data:</span>
              <span>{analysis.consents.biometric ? 'Yes' : 'No'}</span>
            </ResultItem>
          </ResultSection>

          <ResultSection>
            <ResultTitle>Steps</ResultTitle>
            <ResultItem>
              <span>Education:</span>
              <span>{analysis.steps.education ? 'Required' : 'Not Required'}</span>
            </ResultItem>
            <ResultItem>
              <span>Professional License:</span>
              <span>{analysis.steps.professionalLicense ? 'Required' : 'Not Required'}</span>
            </ResultItem>
            <ResultItem>
              <span>Residence History:</span>
              <span>{analysis.steps.residence ? 'Required' : 'Not Required'}</span>
            </ResultItem>
            <ResultItem>
              <span>Employment History:</span>
              <span>{analysis.steps.employment ? 'Required' : 'Not Required'}</span>
            </ResultItem>
          </ResultSection>

          <ResultSection>
            <ResultTitle>Timelines</ResultTitle>
            <ResultItem>
              <span>Residence Timeline:</span>
              <span>{analysis.steps.residence ? timelineLabels[analysis.timelines.residence] : 'N/A'}</span>
            </ResultItem>
            <ResultItem>
              <span>Employment Timeline:</span>
              <span>{analysis.steps.employment ? timelineLabels[analysis.timelines.employment] : 'N/A'}</span>
            </ResultItem>
          </ResultSection>
        </ResultCard>
      )}
    </Container>
  );
};

export default KeyAnalyzer; 