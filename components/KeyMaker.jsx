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
  { value: '000', label: '1 Entry (0 years)' },
  { value: '001', label: '3 Years' },
  { value: '010', label: '5 Years' },
  { value: '011', label: '7 Years' },
  { value: '100', label: '10 Years' }
];

const languages = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' }
];

const KeyMaker = () => {
  const [language, setLanguage] = useState('en');
  const [consents, setConsents] = useState({
    driverLicense: false,
    drugTest: false,
    biometric: false
  });
  const [steps, setSteps] = useState({
    education: false,
    professionalLicense: false,
    residence: false,
    employment: false
  });
  const [timelines, setTimelines] = useState({
    residence: '000',
    employment: '000'
  });
  const [copied, setCopied] = useState(false);

  const generateKey = useCallback(() => {
    let bits = '1';
    bits += consents.driverLicense ? '1' : '0';
    bits += consents.drugTest ? '1' : '0';
    bits += consents.biometric ? '1' : '0';
    bits += steps.education ? '1' : '0';
    bits += steps.professionalLicense ? '1' : '0';
    bits += steps.residence ? '1' : '0';
    bits += steps.residence ? timelines.residence : '000';
    bits += steps.employment ? '1' : '0';
    bits += steps.employment ? timelines.employment : '000';
    return language + bits;
  }, [language, consents, steps, timelines]);

  const handleCopyToClipboard = () => {
    const key = generateKey();
    navigator.clipboard.writeText(key)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => console.error('Failed to copy key:', err));
  };

  const handleConsentChange = (name) => {
    setConsents(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleStepChange = (name) => {
    setSteps(prev => {
      const newSteps = {
        ...prev,
        [name]: !prev[name]
      };
      
      if (!newSteps[name]) {
        setTimelines(prev => ({
          ...prev,
          [name]: '000'
        }));
      }
      
      return newSteps;
    });
  };

  const handleTimelineChange = (name, value) => {
    setTimelines(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Container>
      <Header>
        <Title>Collection Key Generator</Title>
        <Description>
          Generate a configuration key for your form by selecting the required steps and options
        </Description>
      </Header>

      <Grid>
        <Card>
          <CardTitle>Language</CardTitle>
          <Select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.label} ({lang.code})
              </option>
            ))}
          </Select>
        </Card>

        <Card>
          <CardTitle>Required Consents</CardTitle>
          <CheckboxGroup>
            <CheckboxLabel>
              <Checkbox
                type="checkbox"
                checked={consents.driverLicense}
                onChange={() => handleConsentChange('driverLicense')}
              />
              Driver's License Consent
            </CheckboxLabel>

            <CheckboxLabel>
              <Checkbox
                type="checkbox"
                checked={consents.drugTest}
                onChange={() => handleConsentChange('drugTest')}
              />
              Drug Test Consent
            </CheckboxLabel>

            <CheckboxLabel>
              <Checkbox
                type="checkbox"
                checked={consents.biometric}
                onChange={() => handleConsentChange('biometric')}
              />
              Biometric Consent
            </CheckboxLabel>
          </CheckboxGroup>
        </Card>

        <Card>
          <CardTitle>Form Steps</CardTitle>
          <CheckboxGroup>
            <CheckboxLabel>
              <Checkbox
                type="checkbox"
                checked={steps.education}
                onChange={() => handleStepChange('education')}
              />
              Education History
            </CheckboxLabel>

            <CheckboxLabel>
              <Checkbox
                type="checkbox"
                checked={steps.professionalLicense}
                onChange={() => handleStepChange('professionalLicense')}
              />
              Professional License
            </CheckboxLabel>

            <CheckboxLabel>
              <Checkbox
                type="checkbox"
                checked={steps.residence}
                onChange={() => handleStepChange('residence')}
              />
              Residence History
            </CheckboxLabel>
            
            {steps.residence && (
              <RadioGroup>
                {timelineOptions.map(option => (
                  <CheckboxLabel key={option.value}>
                    <input
                      type="radio"
                      name="residenceTimeline"
                      value={option.value}
                      checked={timelines.residence === option.value}
                      onChange={(e) => handleTimelineChange('residence', e.target.value)}
                    />
                    {option.label}
                  </CheckboxLabel>
                ))}
              </RadioGroup>
            )}

            <CheckboxLabel>
              <Checkbox
                type="checkbox"
                checked={steps.employment}
                onChange={() => handleStepChange('employment')}
              />
              Employment History
            </CheckboxLabel>
            
            {steps.employment && (
              <RadioGroup>
                {timelineOptions.map(option => (
                  <CheckboxLabel key={option.value}>
                    <input
                      type="radio"
                      name="employmentTimeline"
                      value={option.value}
                      checked={timelines.employment === option.value}
                      onChange={(e) => handleTimelineChange('employment', e.target.value)}
                    />
                    {option.label}
                  </CheckboxLabel>
                ))}
              </RadioGroup>
            )}
          </CheckboxGroup>
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