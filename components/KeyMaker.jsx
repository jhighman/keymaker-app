import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { FiCopy, FiCheck, FiLink, FiPlus, FiTrash2, FiUser, FiLoader } from 'react-icons/fi';
import endpoints from '../config/endpoints.json';
import { keyService, customerService } from '../services/api';

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
  position: relative;
  z-index: 1;
`;

const OutputTitle = styled(CardTitle)`
  color: white;
`;

const OutputField = styled.input.attrs({ spellCheck: 'false' })`
  width: 100%;
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.primaryDark};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  color: #ffffff;
  font-family: ${props => props.theme.fonts.mono};
  font-size: 1.2rem;
  text-align: left;
  margin-bottom: ${props => props.theme.spacing.md};
  display: block;
  font-weight: 500;
  position: relative;
  z-index: 2;
  -webkit-text-fill-color: #ffffff;
  -webkit-background-clip: text;
  background-clip: text;

  &:focus {
    outline: none;
    color: #ffffff;
    -webkit-text-fill-color: #ffffff;
  }

  &::selection {
    background: rgba(255, 255, 255, 0.3);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
`;

const OutputContainer = styled.div`
  position: relative;
  z-index: 2;
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

const CollectionLinkCard = styled(OutputCard)`
  background: ${props => props.theme.colors.secondary};
`;

const CollectionLinkTitle = styled(OutputTitle)`
  color: white;
`;

const EndpointSelect = styled(Select)`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const EndpointDescription = styled.p`
  color: white;
  opacity: 0.8;
  font-size: 0.9rem;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const CustomerLinkCard = styled(Card)`
  background: ${props => props.theme.colors.surface};
  
  ${CopyButton} {
    background: ${props => props.theme.colors.primary};
    color: white;
  }
`;

const CustomerInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.md};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }
`;

const SaveButton = styled(CopyButton)`
  background: ${props => props.theme.colors.primary};
  color: white;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const CustomerLinksList = styled.div`
  margin-top: ${props => props.theme.spacing.xl};
`;

const CustomerLinkItem = styled.div`
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.md};
  background: white;
`;

const CustomerName = styled.div`
  font-weight: 600;
  margin-bottom: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.text};
`;

const CustomerLink = styled.div`
  font-family: ${props => props.theme.fonts.mono};
  font-size: 0.9rem;
  color: ${props => props.theme.colors.primary};
  word-break: break-all;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const DeleteButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  transition: background-color 0.2s;

  &:hover {
    background: #c82333;
  }

  &:active {
    background: #bd2130;
  }
`;

const IndividualSection = styled.div`
  margin-top: ${props => props.theme.spacing.md};
  padding-top: ${props => props.theme.spacing.md};
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const IndividualInput = styled(CustomerInput)`
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const IndividualList = styled.div`
  margin-top: ${props => props.theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const IndividualItem = styled.div`
  background: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${props => props.theme.spacing.md};
`;

const IndividualId = styled.div`
  font-family: ${props => props.theme.fonts.mono};
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text};
`;

const AddIndividualButton = styled(CopyButton)`
  background: ${props => props.theme.colors.success};
  color: white;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  width: auto;
`;

const SectionDivider = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: ${props => props.theme.spacing.xl} auto;
  text-align: center;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: ${props => props.theme.colors.border};
    z-index: 1;
  }
`;

const DividerText = styled.span`
  background: ${props => props.theme.colors.background};
  padding: 0 ${props => props.theme.spacing.lg};
  color: ${props => props.theme.colors.textLight};
  font-size: 1.2rem;
  position: relative;
  z-index: 2;
`;

const StepNumber = styled.div`
  background: ${props => props.theme.colors.primary};
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: ${props => props.theme.spacing.sm};
`;

const ConfigurationGrid = styled(Grid)`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.lg};
  color: ${props => props.theme.colors.textLight};
  
  svg {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.danger || '#dc3545'};
  background: ${props => props.theme.colors.dangerLight || '#ffebee'};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const OutputGrid = styled(Grid)`
  grid-template-columns: 1fr;
  max-width: 800px;
  gap: ${props => props.theme.spacing.xl};
`;

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
  const [selectedEndpoint, setSelectedEndpoint] = useState(endpoints.endpoints[0].id);
  const [copiedLink, setCopiedLink] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [individualId, setIndividualId] = useState('');
  const [customerLinks, setCustomerLinks] = useState([]);
  const [generatedKey, setGeneratedKey] = useState('');
  
  // New state for API integration
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedKeys, setSavedKeys] = useState([]);

  // Fetch saved keys on component mount
  useEffect(() => {
    const fetchSavedKeys = async () => {
      try {
        setLoading(true);
        setError(null);
        const keys = await keyService.getKeys();
        setSavedKeys(keys);
        
        const customers = await customerService.getCustomers();
        setCustomerLinks(customers);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load saved data. Using local state only.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSavedKeys();
  }, []);

  const generatePersonalInfoFacet = useCallback(() => {
    try {
      let facet = '';
      if (personalInfo.email) facet += 'E';
      if (personalInfo.phone) facet += 'P';
      if (personalInfo.address) facet += 'A';
      return facet || 'E'; // Default to E if nothing selected
    } catch (error) {
      console.error('Error generating personal info facet:', error);
      return 'E'; // Default to E on error
    }
  }, [personalInfo]);

  const generateConsentsFacet = useCallback(() => {
    try {
      if (!consents.drugTest && !consents.taxForms && !consents.biometric) return 'N';
      let facet = '';
      if (consents.drugTest) facet += 'D';
      if (consents.taxForms) facet += 'T';
      if (consents.biometric) facet += 'B';
      return facet;
    } catch (error) {
      console.error('Error generating consents facet:', error);
      return 'N'; // Default to N on error
    }
  }, [consents]);

  const generateKey = useCallback(() => {
    console.log('Generating new key...');
    const personalInfoFacet = generatePersonalInfoFacet();
    const consentsFacet = generateConsentsFacet();
    console.log('Facets:', { personalInfoFacet, consentsFacet });
    
    const key = [
      language,
      personalInfoFacet,
      consentsFacet,
      residenceHistory,
      employmentHistory,
      education ? 'E' : 'N',
      professionalLicense ? 'P' : 'N',
      signature
    ].join('-');
    console.log('Generated key:', key);
    return key;
  }, [language, generatePersonalInfoFacet, generateConsentsFacet, residenceHistory, employmentHistory, education, professionalLicense, signature]);

  useEffect(() => {
    console.log('State changed, updating generated key...');
    console.log('Current state:', {
      language,
      personalInfo,
      consents,
      residenceHistory,
      employmentHistory,
      education,
      professionalLicense,
      signature
    });
    const newKey = generateKey();
    console.log('Setting new generated key:', newKey);
    setGeneratedKey(newKey);
    console.log('Current generatedKey state after setting:', generatedKey);
    setTimeout(() => {
      console.log('GeneratedKey state after update:', generatedKey);
    }, 0);
  }, [language, personalInfo, consents, residenceHistory, employmentHistory, education, professionalLicense, signature, generateKey]);

  const getSelectedEndpoint = useCallback(() => {
    return endpoints.endpoints.find(endpoint => endpoint.id === selectedEndpoint);
  }, [selectedEndpoint]);

  const generateCollectionLink = useCallback(() => {
    const endpoint = getSelectedEndpoint();
    const key = generateKey();
    return `${endpoint.url}?key=${key}`;
  }, [getSelectedEndpoint, generateKey]);

  const handleCopyToClipboard = async () => {
    console.log('Copying key to clipboard:', generatedKey);
    try {
      await navigator.clipboard.writeText(generatedKey);
      console.log('Successfully copied key to clipboard');
      setCopied(true);
      setTimeout(() => {
        console.log('Resetting copied state');
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy key to clipboard:', error);
    }
  };

  const handleCopyCollectionLink = async () => {
    const endpoint = getSelectedEndpoint();
    const collectionLink = `${endpoint.url}/collect/${generatedKey}`;
    console.debug('Copying collection link to clipboard:', collectionLink);
    try {
      await navigator.clipboard.writeText(collectionLink);
      console.debug('Successfully copied collection link to clipboard');
      setCopiedLink(true);
      setTimeout(() => {
        console.debug('Resetting linkCopied state');
        setCopiedLink(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy collection link to clipboard:', error);
    }
  };

  const handlePersonalInfoChange = (name) => {
    setPersonalInfo(prev => {
      const newState = {
        ...prev,
        [name]: !prev[name]
      };
      console.log('Personal info updated:', newState);
      return newState;
    });
  };

  const handleConsentChange = (name) => {
    setConsents(prev => {
      const newState = {
        ...prev,
        [name]: !prev[name]
      };
      console.log('Consents updated:', newState);
      return newState;
    });
  };

  // Updated to use API
  const handleSaveCustomerLink = async () => {
    if (!customerName.trim()) return;
    
    const key = generateKey();
    const link = generateCollectionLink();
    
    const newCustomerLink = {
      name: customerName,
      link: link,
      endpoint: getSelectedEndpoint().name,
      individuals: []
    };
    
    try {
      setLoading(true);
      setError(null);
      
      // Save the key
      const keyData = {
        value: key,
        language,
        personalInfo,
        consents,
        residenceHistory: {
          required: residenceHistory !== 'N',
          years: residenceHistory === 'N' ? 0 : parseInt(residenceHistory.slice(1))
        },
        employmentHistory: {
          required: employmentHistory !== 'N',
          mode: employmentHistory.startsWith('EN') ? 'employers' : 'years',
          value: employmentHistory === 'N' ? 0 : parseInt(employmentHistory.slice(employmentHistory.startsWith('EN') ? 2 : 1))
        },
        education,
        professionalLicense,
        signature: signature === 'W' ? 'Wet' : 'Electronic'
      };
      
      await keyService.createKey(keyData);
      
      // Save the customer
      const savedCustomer = await customerService.createCustomer(newCustomerLink);
      
      // Update local state
      setCustomerLinks(prev => [...prev, savedCustomer]);
      setSavedKeys(prev => [...prev, keyData]);
      setCustomerName('');
    } catch (err) {
      console.error('Error saving customer link:', err);
      setError('Failed to save customer link. Please try again.');
      
      // Fallback to local state if API fails
      const fallbackCustomer = {
        id: Date.now(),
        name: customerName,
        key,
        link,
        endpoint: getSelectedEndpoint().name,
        individuals: []
      };
      
      setCustomerLinks(prev => [...prev, fallbackCustomer]);
      setCustomerName('');
    } finally {
      setLoading(false);
    }
  };

  // Updated to use API
  const handleAddIndividual = async (customerId) => {
    if (!individualId.trim()) return;

    try {
      setLoading(true);
      setError(null);
      
      const individualData = {
        id: individualId,
        status: 'pending',
        timestamp: Date.now()
      };
      
      // Add individual via API
      const updatedCustomer = await customerService.addIndividual(customerId, individualData);
      
      // Update local state
      setCustomerLinks(prev => prev.map(customer =>
        customer.id === customerId ? updatedCustomer : customer
      ));
      
      setIndividualId('');
    } catch (err) {
      console.error('Error adding individual:', err);
      setError('Failed to add individual. Please try again.');
      
      // Fallback to local state if API fails
      setCustomerLinks(prev => prev.map(customer => {
        if (customer.id === customerId) {
          return {
            ...customer,
            individuals: [...customer.individuals, {
              id: individualId,
              status: 'pending',
              timestamp: Date.now()
            }]
          };
        }
        return customer;
      }));
      
      setIndividualId('');
    } finally {
      setLoading(false);
    }
  };

  // Updated to use API
  const handleDeleteCustomerLink = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      // Delete customer via API
      await customerService.deleteCustomer(id);
      
      // Update local state
      setCustomerLinks(prev => prev.filter(link => link.id !== id));
    } catch (err) {
      console.error('Error deleting customer:', err);
      setError('Failed to delete customer. Please try again.');
      
      // Fallback to local state if API fails
      setCustomerLinks(prev => prev.filter(link => link.id !== id));
    } finally {
      setLoading(false);
    }
  };

  // Updated to use API
  const handleDeleteIndividual = async (customerId, individualId) => {
    try {
      setLoading(true);
      setError(null);
      
      // Remove individual via API
      const updatedCustomer = await customerService.removeIndividual(customerId, individualId);
      
      // Update local state
      setCustomerLinks(prev => prev.map(customer =>
        customer.id === customerId ? updatedCustomer : customer
      ));
    } catch (err) {
      console.error('Error deleting individual:', err);
      setError('Failed to delete individual. Please try again.');
      
      // Fallback to local state if API fails
      setCustomerLinks(prev => prev.map(customer => {
        if (customer.id === customerId) {
          return {
            ...customer,
            individuals: customer.individuals.filter(ind => ind.id !== individualId)
          };
        }
        return customer;
      }));
    } finally {
      setLoading(false);
    }
  };

  const getIndividualLink = (customerLink, individualId) => {
    return `${customerLink}&puid=${individualId}`;
  };

  const handleCopyIndividualLink = async (customerLink, individualId) => {
    const link = getIndividualLink(customerLink, individualId);
    try {
      await navigator.clipboard.writeText(link);
      console.log('Individual link copied to clipboard');
    } catch (error) {
      console.error('Failed to copy individual link:', error);
    }
  };

  return (
    <Container>
      <Header>
        <Title>KeyMaker</Title>
        <Description>Generate and manage background check requirement keys</Description>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {loading && <LoadingSpinner><FiLoader size={24} /></LoadingSpinner>}

      <ConfigurationGrid>
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
      </ConfigurationGrid>

      <SectionDivider>
        <DividerText>Generated Output</DividerText>
      </SectionDivider>

      <OutputGrid>
        <OutputCard>
          <OutputTitle>
            <StepNumber>1</StepNumber>
            Generated Key
          </OutputTitle>
          <OutputContainer>
            <OutputField
              type="text"
              value={generatedKey || ''}
              readOnly
              onClick={(e) => e.target.select()}
              data-testid="generated-key-field"
              style={{
                WebkitTextFillColor: '#ffffff',
                color: '#ffffff'
              }}
            />
          </OutputContainer>
          <CopyButton onClick={handleCopyToClipboard}>
            {copied ? (
              <>
                <FiCheck /> Copied!
              </>
            ) : (
              <>
                <FiCopy /> Copy Key
              </>
            )}
          </CopyButton>
        </OutputCard>

        <CollectionLinkCard>
          <CollectionLinkTitle>
            <StepNumber>2</StepNumber>
            Collection Link
          </CollectionLinkTitle>
          <EndpointSelect
            value={selectedEndpoint}
            onChange={(e) => setSelectedEndpoint(e.target.value)}
          >
            {endpoints.endpoints.map(endpoint => (
              <option key={endpoint.id} value={endpoint.id}>
                {endpoint.name}
              </option>
            ))}
          </EndpointSelect>
          <EndpointDescription>
            {getSelectedEndpoint()?.description}
          </EndpointDescription>
          <OutputField
            type="text"
            value={generateCollectionLink()}
            readOnly
          />
          <CopyButton onClick={handleCopyCollectionLink}>
            {copiedLink ? (
              <>
                <FiCheck /> Copied!
              </>
            ) : (
              <>
                <FiLink /> Copy Collection Link
              </>
            )}
          </CopyButton>
        </CollectionLinkCard>

        <CustomerLinkCard>
          <CardTitle>
            <StepNumber>3</StepNumber>
            Customer Collection Links
          </CardTitle>
          <CustomerInput
            type="text"
            placeholder="Enter customer name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          <SaveButton onClick={handleSaveCustomerLink}>
            <FiLink /> Save Customer Link
          </SaveButton>

          <CustomerLinksList>
            {customerLinks.map(customer => (
              <CustomerLinkItem key={customer.id}>
                <CustomerName>{customer.name}</CustomerName>
                <CustomerLink>{customer.link}</CustomerLink>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <CopyButton onClick={() => handleCopyCustomerLink(customer.link)}>
                    <FiCopy /> Copy Link
                  </CopyButton>
                  <DeleteButton onClick={() => handleDeleteCustomerLink(customer.id)}>
                    Delete
                  </DeleteButton>
                </div>

                <IndividualSection>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <IndividualInput
                      type="text"
                      placeholder="Enter individual ID"
                      value={individualId}
                      onChange={(e) => setIndividualId(e.target.value)}
                    />
                    <AddIndividualButton onClick={() => handleAddIndividual(customer.id)}>
                      Add Individual
                    </AddIndividualButton>
                  </div>

                  <IndividualList>
                    {customer.individuals.map(individual => (
                      <IndividualItem key={individual.id}>
                        <IndividualId>{individual.id}</IndividualId>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <CopyButton 
                            onClick={() => handleCopyIndividualLink(customer.link, individual.id)}
                          >
                            <FiCopy /> Copy Individual Link
                          </CopyButton>
                          <DeleteButton 
                            onClick={() => handleDeleteIndividual(customer.id, individual.id)}
                          >
                            Delete
                          </DeleteButton>
                        </div>
                      </IndividualItem>
                    ))}
                  </IndividualList>
                </IndividualSection>
              </CustomerLinkItem>
            ))}
          </CustomerLinksList>
        </CustomerLinkCard>
      </OutputGrid>
    </Container>
  );
};

export default KeyMaker; 
