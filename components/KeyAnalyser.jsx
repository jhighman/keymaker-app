import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiSearch, FiLink, FiUser, FiExternalLink } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import endpoints from '../config/endpoints.json';
import { customerService, initializeDatabase } from '../services/api';

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

const LaunchButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.success};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  margin-top: ${props => props.theme.spacing.sm};

  &:hover {
    background: ${props => props.theme.colors.successDark || '#218838'};
  }
`;

const KeyAnalyser = () => {
  console.debug('KeyAnalyser component mounted');
  const [input, setInput] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [customerName, setCustomerName] = useState(null);
  const location = useLocation();

  useEffect(() => {
    console.debug('Initializing database in local mode for KeyAnalyser');
    initializeDatabase('local');
  }, []);

  useEffect(() => {
    console.debug('KeyAnalyser useEffect triggered');
    console.debug('Current location:', location);
    console.debug('Location state:', location.state);
    
    if (location.state?.url) {
      console.debug('Setting input from location state:', location.state.url);
      setInput(location.state.url);
      analyseInput(location.state.url);
    } else {
      console.debug('No URL in location state');
    }
  }, [location]);

  const fetchCustomerName = async (spid) => {
    try {
      console.debug('Fetching customer details for SPID:', spid);
      const customer = await customerService.getCustomer(spid);
      console.debug('Found customer:', customer);
      if (customer?.name) {
        setCustomerName(customer.name);
      }
    } catch (error) {
      console.error('Error fetching customer details:', error);
    }
  };

  const extractKeyFromUrl = (url) => {
    console.debug('Extracting key from URL:', url);
    try {
      let urlObj;
      try {
        urlObj = new URL(url);
      } catch {
        urlObj = new URL(url, 'http://localhost');
      }

      const key = urlObj.searchParams.get('key');
      const spid = urlObj.searchParams.get('spid');
      const puid = urlObj.searchParams.get('puid');

      console.debug('Extracted parameters:', { key, spid, puid });

      if (key) {
        return { 
          key, 
          spid, 
          individualId: puid 
        };
      }

      if (url.match(/^[a-z]{2}-[EPA]*-[DTBN]*-[NR][0-5N]-[EN][0-5N]*-[EN]-[PN]-[WE]$/)) {
        console.debug('Input matches key format directly:', url);
        return { key: url, spid: null, individualId: null };
      }

      console.debug('No valid key found in URL');
      return { key: null, spid, individualId: puid };
    } catch (error) {
      console.error('Error extracting key from URL:', error);
      return { key: url, spid: null, individualId: null };
    }
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
    if (!key) return null;
    
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

  const analyseInput = async (value) => {
    console.debug('analyseInput called with:', value);
    const inputValue = value.trim();
    
    let analysisResult = {
      inputType: 'key',
      environment: null,
      spid: null,
      customerName: null,
      customerLookupStatus: null,
      individualId: null,
      key: null,
      keyAnalysis: null
    };

    if (inputValue.includes('http')) {
      analysisResult.inputType = 'url';
      analysisResult.environment = getEnvironmentFromUrl(inputValue);
    }

    const { key, spid, individualId } = extractKeyFromUrl(inputValue);
    analysisResult.key = key;
    analysisResult.spid = spid;
    analysisResult.individualId = individualId;

    if (individualId) {
      analysisResult.inputType = 'individual';
    } else if (spid && analysisResult.inputType === 'url') {
      analysisResult.inputType = 'customer';
    }

    if (spid) {
      try {
        console.debug('Attempting to fetch customer details for SPID:', spid);
        const customer = await customerService.getCustomer(spid);
        if (customer?.name) {
          analysisResult.customerName = customer.name;
          analysisResult.customerLookupStatus = 'found';
        } else {
          analysisResult.customerLookupStatus = 'not_found';
        }
      } catch (error) {
        console.error('Error fetching customer details:', error);
        analysisResult.customerLookupStatus = 'error';
      }
    }

    analysisResult.keyAnalysis = analyseKey(key);
    setAnalysis(analysisResult);
  };

  const handleLaunchUrl = (url) => {
    if (url && url.includes('http')) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const renderAnalysis = () => {
    if (!analysis) return null;

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
                    <TableRow>
                      <TableCell>URL</TableCell>
                      <TableCell>
                        {input}
                        <LaunchButton onClick={() => handleLaunchUrl(input)}>
                          <FiExternalLink /> Launch
                        </LaunchButton>
                      </TableCell>
                    </TableRow>
                  </>
                )}
                {analysis.spid && (
                  <>
                    <TableRow>
                      <TableCell>Customer SPID</TableCell>
                      <TableCell>{analysis.spid}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Customer Details</TableCell>
                      <TableCell>
                        {analysis.customerLookupStatus === 'found' ? (
                          analysis.customerName
                        ) : analysis.customerLookupStatus === 'not_found' ? (
                          'Customer not found'
                        ) : analysis.customerLookupStatus === 'error' ? (
                          'Error looking up customer'
                        ) : (
                          'Loading...'
                        )}
                      </TableCell>
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

        {analysis.keyAnalysis ? (
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
        ) : (
          <ResultSection>
            <SectionTitle>
              <FiSearch /> Analysis Result
            </SectionTitle>
            <ResultTable>
              <tbody>
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell>Invalid key format</TableCell>
                </TableRow>
              </tbody>
            </ResultTable>
          </ResultSection>
        )}
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