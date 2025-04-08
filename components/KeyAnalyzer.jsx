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

  &:last-child {
    margin-bottom: 0;
  }
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

const KeyAnalyzer = () => {
  const [key, setKey] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const analyzeKey = (inputKey) => {
    setError(null);

    if (!inputKey) {
      setError('Please enter a key to analyze');
      return null;
    }

    const facets = inputKey.split('-');

    if (facets.length !== 8) {
      setError(`Invalid key format: Expected 8 facets, got ${facets.length}`);
      return null;
    }

    const [
      language,
      personalInfo,
      consents,
      residenceHistory,
      employmentHistory,
      education,
      professionalLicense,
      signature
    ] = facets;

    // Validate language
    if (!languages[language]) {
      setError(`Invalid language code: ${language}`);
      return null;
    }

    // Validate personal info
    if (!/^E|EP|EPA$/.test(personalInfo)) {
      setError(`Invalid personal info format: ${personalInfo}`);
      return null;
    }

    // Validate consents
    if (consents !== 'N' && !/^[DTB]+$/.test(consents)) {
      setError(`Invalid consents format: ${consents}`);
      return null;
    }

    // Validate residence history
    if (residenceHistory !== 'N' && !/^R[135]$/.test(residenceHistory)) {
      setError(`Invalid residence history format: ${residenceHistory}`);
      return null;
    }

    // Validate employment history
    if (employmentHistory !== 'N' && !/^(E[135]|EN[123])$/.test(employmentHistory)) {
      setError(`Invalid employment history format: ${employmentHistory}`);
      return null;
    }

    // Validate education
    if (!/^[EN]$/.test(education)) {
      setError(`Invalid education format: ${education}`);
      return null;
    }

    // Validate professional license
    if (!/^[PN]$/.test(professionalLicense)) {
      setError(`Invalid professional license format: ${professionalLicense}`);
      return null;
    }

    // Validate signature
    if (!/^[WE]$/.test(signature)) {
      setError(`Invalid signature format: ${signature}`);
      return null;
    }

    return {
      language,
      personalInfo: {
        email: personalInfo.includes('E'),
        phone: personalInfo.includes('P'),
        address: personalInfo.includes('A')
      },
      consents: {
        drugTest: consents.includes('D'),
        taxForms: consents.includes('T'),
        biometric: consents.includes('B')
      },
      residenceHistory: {
        required: residenceHistory !== 'N',
        years: residenceHistory === 'N' ? 0 : parseInt(residenceHistory.slice(1))
      },
      employmentHistory: {
        required: employmentHistory !== 'N',
        mode: employmentHistory.startsWith('EN') ? 'employers' : 'years',
        value: employmentHistory === 'N' ? 0 : parseInt(employmentHistory.slice(employmentHistory.startsWith('EN') ? 2 : 1))
      },
      education: education === 'E',
      professionalLicense: professionalLicense === 'P',
      signature: signature === 'W' ? 'Wet' : 'Electronic'
    };
  };

  const handleKeyChange = (e) => {
    const inputKey = e.target.value.trim();
    setKey(inputKey);
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
          placeholder="Enter a key to analyze (e.g., en-EPA-DTB-R5-E3-E-P-W)"
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
            <ResultTitle>Personal Information</ResultTitle>
            <ResultItem>
              <span>Email:</span>
              <span>{analysis.personalInfo.email ? 'Required' : 'Not Required'}</span>
            </ResultItem>
            <ResultItem>
              <span>Phone Number:</span>
              <span>{analysis.personalInfo.phone ? 'Required' : 'Not Required'}</span>
            </ResultItem>
            <ResultItem>
              <span>Address:</span>
              <span>{analysis.personalInfo.address ? 'Required' : 'Not Required'}</span>
            </ResultItem>
          </ResultSection>

          <ResultSection>
            <ResultTitle>Required Consents</ResultTitle>
            <ResultItem>
              <span>Drug Test:</span>
              <span>{analysis.consents.drugTest ? 'Required' : 'Not Required'}</span>
            </ResultItem>
            <ResultItem>
              <span>Tax Forms:</span>
              <span>{analysis.consents.taxForms ? 'Required' : 'Not Required'}</span>
            </ResultItem>
            <ResultItem>
              <span>Biometric Data:</span>
              <span>{analysis.consents.biometric ? 'Required' : 'Not Required'}</span>
            </ResultItem>
          </ResultSection>

          <ResultSection>
            <ResultTitle>Residence History</ResultTitle>
            <ResultItem>
              <span>Required:</span>
              <span>{analysis.residenceHistory.required ? 'Yes' : 'No'}</span>
            </ResultItem>
            {analysis.residenceHistory.required && (
              <ResultItem>
                <span>Time Period:</span>
                <span>{analysis.residenceHistory.years} Year{analysis.residenceHistory.years !== 1 ? 's' : ''}</span>
              </ResultItem>
            )}
          </ResultSection>

          <ResultSection>
            <ResultTitle>Employment History</ResultTitle>
            <ResultItem>
              <span>Required:</span>
              <span>{analysis.employmentHistory.required ? 'Yes' : 'No'}</span>
            </ResultItem>
            {analysis.employmentHistory.required && (
              <>
                <ResultItem>
                  <span>Mode:</span>
                  <span>{analysis.employmentHistory.mode === 'years' ? 'Years' : 'Employers'}</span>
                </ResultItem>
                <ResultItem>
                  <span>Requirement:</span>
                  <span>
                    {analysis.employmentHistory.mode === 'years' 
                      ? `${analysis.employmentHistory.value} Year${analysis.employmentHistory.value !== 1 ? 's' : ''}`
                      : `${analysis.employmentHistory.value} Employer${analysis.employmentHistory.value !== 1 ? 's' : ''}`}
                  </span>
                </ResultItem>
              </>
            )}
          </ResultSection>

          <ResultSection>
            <ResultTitle>Additional Requirements</ResultTitle>
            <ResultItem>
              <span>Education Verification:</span>
              <span>{analysis.education ? 'Required' : 'Not Required'}</span>
            </ResultItem>
            <ResultItem>
              <span>Professional License:</span>
              <span>{analysis.professionalLicense ? 'Required' : 'Not Required'}</span>
            </ResultItem>
          </ResultSection>

          <ResultSection>
            <ResultTitle>Signature Type</ResultTitle>
            <ResultItem>
              <span>Required Type:</span>
              <span>{analysis.signature}</span>
            </ResultItem>
          </ResultSection>
        </ResultCard>
      )}
    </Container>
  );
};

export default KeyAnalyzer; 