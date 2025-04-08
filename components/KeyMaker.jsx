import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { FiCopy, FiCheck } from 'react-icons/fi';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: ${props => props.theme.spacing['2xl']};
`;

const Header = styled.header`
  margin-bottom: ${props => props.theme.spacing.xl};
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const Description = styled.p`
  color: ${props => props.theme.colors.textLight};
  font-size: 1.1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const Card = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.md};
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  cursor: pointer;
  transition: border-color 0.2s;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  cursor: pointer;
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.theme.colors.background};
  }
`;

const Checkbox = styled.input`
  width: 1.2rem;
  height: 1.2rem;
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.md};
  margin-left: ${props => props.theme.spacing.xl};
`;

const OutputCard = styled(Card)`
  background: ${props => props.theme.colors.primary};
  color: white;
`;

const OutputTitle = styled(CardTitle)`
  color: white;
`;

const OutputField = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.primaryDark};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  color: white;
  font-family: ${props => props.theme.fonts.mono};
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.md};

  &:focus {
    outline: none;
  }
`;

const CopyButton = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  background: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.primary};
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const timelineOptions = [
  { value: 'N', label: 'Not Required' },
  { value: 'R1', label: '1 Year' },
  { value: 'R3', label: '3 Years' },
  { value: 'R5', label: '5 Years' }
];

const employmentOptions = [
  { value: 'N', label: 'Not Required' },
  { value: 'E1', label: '1 Year' },
  { value: 'E3', label: '3 Years' },
  { value: 'E5', label: '5 Years' },
  { value: 'EN1', label: '1 Employer' },
  { value: 'EN2', label: '2 Employers' },
  { value: 'EN3', label: '3 Employers' }
];

const languages = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' }
];

const KeyMaker = () => {
  const [language, setLanguage] = useState('en');
  const [personalInfo, setPersonalInfo] = useState({
    email: true,
    phone: false,
    address: false
  });
  const [consents, setConsents] = useState({
    drugTest: false,
    taxForms: false,
    biometric: false
  });
  const [residenceHistory, setResidenceHistory] = useState('N');
  const [employmentHistory, setEmploymentHistory] = useState('N');
  const [education, setEducation] = useState(false);
  const [professionalLicense, setProfessionalLicense] = useState(false);
  const [signature, setSignature] = useState('W'); // W for wet, E for electronic
  const [copied, setCopied] = useState(false);

  const generatePersonalInfoFacet = useCallback(() => {
    let facet = '';
    if (personalInfo.email) facet += 'E';
    if (personalInfo.phone) facet += 'P';
    if (personalInfo.address) facet += 'A';
    return facet || 'E'; // Default to E if nothing selected
  }, [personalInfo]);

  const generateConsentsFacet = useCallback(() => {
    if (!consents.drugTest && !consents.taxForms && !consents.biometric) return 'N';
    let facet = '';
    if (consents.drugTest) facet += 'D';
    if (consents.taxForms) facet += 'T';
    if (consents.biometric) facet += 'B';
    return facet;
  }, [consents]);

  const generateKey = useCallback(() => {
    const facets = [
      language,
      generatePersonalInfoFacet(),
      generateConsentsFacet(),
      residenceHistory,
      employmentHistory,
      education ? 'E' : 'N',
      professionalLicense ? 'P' : 'N',
      signature
    ];
    return facets.join('-');
  }, [
    language,
    personalInfo,
    consents,
    residenceHistory,
    employmentHistory,
    education,
    professionalLicense,
    signature
  ]);

  const handleCopyToClipboard = () => {
    const key = generateKey();
    navigator.clipboard.writeText(key)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => console.error('Failed to copy key:', err));
  };

  const handlePersonalInfoChange = (name) => {
    setPersonalInfo(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleConsentChange = (name) => {
    setConsents(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  return (
    <Container>
      <Header>
        <Title>Trua Collect Key Maker</Title>
        <Description>Generate verification requirement keys for Trua Collect</Description>
      </Header>

      <Grid>
        <Card>
          <CardTitle>Language</CardTitle>
          <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </Select>
        </Card>

        <Card>
          <CardTitle>Personal Information</CardTitle>
          <CheckboxGroup>
            <CheckboxLabel>
              <Checkbox
                type="checkbox"
                checked={personalInfo.email}
                onChange={() => handlePersonalInfoChange('email')}
              />
              Email (Required)
            </CheckboxLabel>
            <CheckboxLabel>
              <Checkbox
                type="checkbox"
                checked={personalInfo.phone}
                onChange={() => handlePersonalInfoChange('phone')}
              />
              Phone Number
            </CheckboxLabel>
            <CheckboxLabel>
              <Checkbox
                type="checkbox"
                checked={personalInfo.address}
                onChange={() => handlePersonalInfoChange('address')}
              />
              Address
            </CheckboxLabel>
          </CheckboxGroup>
        </Card>

        <Card>
          <CardTitle>Required Consents</CardTitle>
          <CheckboxGroup>
            <CheckboxLabel>
              <Checkbox
                type="checkbox"
                checked={consents.drugTest}
                onChange={() => handleConsentChange('drugTest')}
              />
              Drug Test
            </CheckboxLabel>
            <CheckboxLabel>
              <Checkbox
                type="checkbox"
                checked={consents.taxForms}
                onChange={() => handleConsentChange('taxForms')}
              />
              Tax Forms
            </CheckboxLabel>
            <CheckboxLabel>
              <Checkbox
                type="checkbox"
                checked={consents.biometric}
                onChange={() => handleConsentChange('biometric')}
              />
              Biometric Data
            </CheckboxLabel>
          </CheckboxGroup>
        </Card>

        <Card>
          <CardTitle>Residence History</CardTitle>
          <Select 
            value={residenceHistory} 
            onChange={(e) => setResidenceHistory(e.target.value)}
          >
            {timelineOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Card>

        <Card>
          <CardTitle>Employment History</CardTitle>
          <Select 
            value={employmentHistory} 
            onChange={(e) => setEmploymentHistory(e.target.value)}
          >
            {employmentOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Card>

        <Card>
          <CardTitle>Additional Requirements</CardTitle>
          <CheckboxGroup>
            <CheckboxLabel>
              <Checkbox
                type="checkbox"
                checked={education}
                onChange={() => setEducation(!education)}
              />
              Education Verification
            </CheckboxLabel>
            <CheckboxLabel>
              <Checkbox
                type="checkbox"
                checked={professionalLicense}
                onChange={() => setProfessionalLicense(!professionalLicense)}
              />
              Professional License Verification
            </CheckboxLabel>
          </CheckboxGroup>
        </Card>

        <Card>
          <CardTitle>Signature Type</CardTitle>
          <Select 
            value={signature} 
            onChange={(e) => setSignature(e.target.value)}
          >
            <option value="W">Wet Signature</option>
            <option value="E">Electronic Signature</option>
          </Select>
        </Card>

        <OutputCard>
          <OutputTitle>Generated Key</OutputTitle>
          <OutputField
            type="text"
            value={generateKey()}
            readOnly
          />
          <CopyButton onClick={handleCopyToClipboard}>
            {copied ? (
              <>
                <FiCheck /> Copied!
              </>
            ) : (
              <>
                <FiCopy /> Copy to Clipboard
              </>
            )}
          </CopyButton>
        </OutputCard>
      </Grid>
    </Container>
  );
};

export default KeyMaker; 