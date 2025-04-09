import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiSearch, FiLink, FiUser } from 'react-icons/fi';
import { useSearchParams } from 'react-router-dom';
import endpoints from '../config/endpoints.json';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl};
`;

const Title = styled.h1`
  margin-bottom: ${props => props.theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.text};
`;

const Card = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.md};
`;

const InputField = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.background};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.fonts.mono};
  font-size: 1.2rem;
  margin-bottom: ${props => props.theme.spacing.lg};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ResultsContainer = styled.div`
  margin-top: ${props => props.theme.spacing.xl};
`;

const ResultSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const ResultTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: ${props => props.theme.colors.surface};
  }
`;

const TableCell = styled.td`
  padding: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const TableHeader = styled.th`
  padding: ${props => props.theme.spacing.md};
  text-align: left;
  background: ${props => props.theme.colors.primary};
  color: white;
`;

const KeyAnalyser = () => {
  const [input, setInput] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const keyParam = searchParams.get('key');
    if (keyParam) {
      setInput(keyParam);
      analyseInput(keyParam);
    }
  }, [searchParams]);

  const extractKeyFromUrl = (url) => {
    // Handle full URLs
    const urlMatch = url.match(/\/collect\/([\w-]+)/);
    if (urlMatch) return urlMatch[1];

    // Handle query parameter style URLs
    const queryMatch = url.match(/[?&]key=([\w-]+)/);
    if (queryMatch) return queryMatch[1];

    // Handle individual IDs
    const puidMatch = url.match(/&puid=([\w-]+)/);
    const puid = puidMatch ? puidMatch[1] : null;

    return { key: url, puid };
  };

  const getEnvironmentFromUrl = (url) => {
    if (!url.includes('http')) return null;
    
    const matchingEndpoint = endpoints.endpoints.find(endpoint => 
      url.includes(endpoint.url.replace('https://', '').replace('http://', ''))
    );

    return matchingEndpoint ? {
      name: matchingEndpoint.name,
      description: matchingEndpoint.description,
      url: matchingEndpoint.url
    } : null;
  };

  const analyseKey = (key) => {
    const parts = key.split('-');
    if (parts.length !== 8) return null;

    const [language, personalInfo, consents, residenceHistory, employmentHistory, education, professionalLicense, signature] = parts;

    return {
      language: {
        code: language,
        name: {
          'en': 'English',
          'es': 'Spanish',
          'fr': 'French'
        }[language] || 'Unknown'
      },
      personalInfo: {
        email: personalInfo.includes('E'),
        phone: personalInfo.includes('P'),
        address: personalInfo.includes('A')
      },
      consents: {
        drugTest: consents.includes('D'),
        taxForms: consents.includes('T'),
        biometric: consents.includes('B'),
        none: consents === 'N'
      },
      residenceHistory: {
        required: residenceHistory !== 'N',
        years: residenceHistory === 'N' ? 0 : parseInt(residenceHistory.slice(1)),
        type: residenceHistory.startsWith('R') ? 'years' : 'none'
      },
      employmentHistory: {
        required: employmentHistory !== 'N',
        value: employmentHistory === 'N' ? 0 : parseInt(employmentHistory.slice(employmentHistory.startsWith('EN') ? 2 : 1)),
        type: employmentHistory.startsWith('EN') ? 'employers' : employmentHistory.startsWith('E') ? 'years' : 'none'
      },
      education: education === 'E',
      professionalLicense: professionalLicense === 'P',
      signature: signature === 'W' ? 'Wet' : 'Electronic'
    };
  };

  const analyseInput = (value) => {
    const inputValue = value.trim();
    
    // Initialize analysis object
    let analysisResult = {
      inputType: 'key',
      environment: null,
      individualId: null,
      key: null,
      keyAnalysis: null
    };

    // Determine if input is a URL
    if (inputValue.includes('http') || inputValue.includes('/collect/')) {
      analysisResult.inputType = 'url';
      analysisResult.environment = getEnvironmentFromUrl(inputValue);
      
      // Check for individual ID
      if (inputValue.includes('puid=')) {
        analysisResult.inputType = 'individual';
        analysisResult.individualId = inputValue.split('puid=')[1].split('&')[0];
      }
    }

    // Extract key
    const keyData = extractKeyFromUrl(inputValue);
    const key = typeof keyData === 'string' ? keyData : keyData.key;
    analysisResult.key = key;

    // If we got an individual ID from key extraction, use it
    if (keyData.puid) {
      analysisResult.inputType = 'individual';
      analysisResult.individualId = keyData.puid;
    }

    // Analyse the key
    analysisResult.keyAnalysis = analyseKey(key);

    setAnalysis(analysisResult);
  };

  const renderAnalysis = () => {
    if (!analysis || !analysis.keyAnalysis) return null;

    return (
      <>
        {analysis.inputType !== 'key' && (
          <ResultSection>
            <SectionTitle>
              <FiLink /> Input Details
            </SectionTitle>
            <ResultTable>
              <tbody>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>{analysis.inputType.charAt(0).toUpperCase() + analysis.inputType.slice(1)}</TableCell>
                </TableRow>
                {analysis.environment && (
                  <>
                    <TableRow>
                      <TableCell>Environment</TableCell>
                      <TableCell>{analysis.environment.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell>{analysis.environment.description}</TableCell>
                    </TableRow>
                  </>
                )}
                {analysis.individualId && (
                  <TableRow>
                    <TableCell>Individual ID</TableCell>
                    <TableCell>{analysis.individualId}</TableCell>
                  </TableRow>
                )}
              </tbody>
            </ResultTable>
          </ResultSection>
        )}

        <ResultSection>
          <SectionTitle>
            <FiSearch /> Key Analysis
          </SectionTitle>
          <ResultTable>
            <tbody>
              <TableRow>
                <TableCell>Key</TableCell>
                <TableCell>{analysis.key}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Language</TableCell>
                <TableCell>{analysis.keyAnalysis.language.name} ({analysis.keyAnalysis.language.code})</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Personal Information</TableCell>
                <TableCell>
                  {[
                    analysis.keyAnalysis.personalInfo.email && 'Email',
                    analysis.keyAnalysis.personalInfo.phone && 'Phone',
                    analysis.keyAnalysis.personalInfo.address && 'Address'
                  ].filter(Boolean).join(', ')}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Consents Required</TableCell>
                <TableCell>
                  {analysis.keyAnalysis.consents.none ? 'None' : [
                    analysis.keyAnalysis.consents.drugTest && 'Drug Test',
                    analysis.keyAnalysis.consents.taxForms && 'Tax Forms',
                    analysis.keyAnalysis.consents.biometric && 'Biometric'
                  ].filter(Boolean).join(', ')}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Residence History</TableCell>
                <TableCell>
                  {analysis.keyAnalysis.residenceHistory.required
                    ? `${analysis.keyAnalysis.residenceHistory.years} Years`
                    : 'Not Required'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Employment History</TableCell>
                <TableCell>
                  {analysis.keyAnalysis.employmentHistory.required
                    ? `${analysis.keyAnalysis.employmentHistory.value} ${analysis.keyAnalysis.employmentHistory.type === 'employers' ? 'Employers' : 'Years'}`
                    : 'Not Required'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Education Verification</TableCell>
                <TableCell>{analysis.keyAnalysis.education ? 'Required' : 'Not Required'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Professional License</TableCell>
                <TableCell>{analysis.keyAnalysis.professionalLicense ? 'Required' : 'Not Required'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Signature Type</TableCell>
                <TableCell>{analysis.keyAnalysis.signature}</TableCell>
              </TableRow>
            </tbody>
          </ResultTable>
        </ResultSection>
      </>
    );
  };

  return (
    <Container>
      <Title>
        <FiSearch /> Key Analyser
      </Title>
      <Card>
        <InputField
          type="text"
          placeholder="Enter a key, collection URL, or individual link to analyse..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && analyseInput(input)}
        />
        {analysis && (
          <ResultsContainer>
            {renderAnalysis()}
          </ResultsContainer>
        )}
      </Card>
    </Container>
  );
};

export default KeyAnalyser; 