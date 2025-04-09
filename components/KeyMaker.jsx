import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { FiCopy, FiCheck, FiLink, FiPlus, FiTrash2, FiUser, FiLoader, FiSearch } from 'react-icons/fi';
import endpoints from '../config/endpoints.json';
import { keyService, customerService, initializeDatabase } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
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
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  align-items: center;
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

const AnalyzeButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.secondary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.secondaryDark};
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

const CustomerInputGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const CustomerInputField = styled.input`
  flex: 1;
  padding: ${props => props.theme.spacing.md};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-family: ${props => props.theme.fonts.body};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const CustomerInfoDisplay = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

const CustomerDetail = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textLight};
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

const IndividualInput = styled(CustomerInputField)`
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

const CustomerList = styled.div`
  margin-top: ${props => props.theme.spacing.xl};
`;

const CustomerLinkItem = styled.div`
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.md};
  background: white;
`;

const SaveButton = styled(CopyButton)`
  background: ${props => props.theme.colors.primary};
  color: white;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const EndpointSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const CollectionLinkDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.secondaryDark};
  border-radius: ${props => props.theme.borderRadius.md};
  font-family: ${props => props.theme.fonts.mono};
  word-break: break-all;
  color: white;
`;

const DatabaseEnvironmentSelect = styled(Select)`
  margin-bottom: ${props => props.theme.spacing.lg};
  background-color: ${props => props.theme.colors.warning};
  color: white;
  border: none;

  &:focus {
    box-shadow: 0 0 0 2px ${props => props.theme.colors.warning}40;
  }
`;

const KeyMaker = () => {
  const [databaseEnvironment, setDatabaseEnvironment] = useState('local');
  const [selectedEndpoint, setSelectedEndpoint] = useState(endpoints.endpoints[0]);
  
  // Initialize savedKeys from localStorage
  const [savedKeys, setSavedKeys] = useState(() => {
    try {
      const stored = localStorage.getItem('keymaker_customers');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  });

  // Keep localStorage in sync with savedKeys
  useEffect(() => {
    try {
      localStorage.setItem('keymaker_customers', JSON.stringify(savedKeys));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [savedKeys]);

  const [language, setLanguage] = useState('en');
  const [personalInfo, setPersonalInfo] = useState({
    mode: 'essential',
    dob: false,
    phone: false,
    email: false,
    address: false
  });
  const [consents, setConsents] = useState({
    background: false,
    credit: false,
    criminal: false
  });
  const [residenceHistory, setResidenceHistory] = useState('N');
  const [employmentHistory, setEmploymentHistory] = useState('N');
  const [education, setEducation] = useState('N');
  const [professionalLicense, setProfessionalLicense] = useState('N');
  const [signature, setSignature] = useState('W');
  const [generatedKey, setGeneratedKey] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerSpid, setCustomerSpid] = useState('');
  const [individualId, setIndividualId] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [customerLinks, setCustomerLinks] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleDatabaseEnvironmentChange = (event) => {
    const newEnvironment = event.target.value;
    console.debug('Changing database environment to:', newEnvironment);
    setDatabaseEnvironment(newEnvironment);
  };

  const handleEndpointChange = (event) => {
    const endpoint = endpoints.endpoints.find(e => e.id === event.target.value);
    console.debug('Changing collection endpoint to:', endpoint);
    setSelectedEndpoint(endpoint);
  };

  const getSelectedEndpoint = useCallback(() => {
    return selectedEndpoint;
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
    const collectionLink = `${selectedEndpoint.url}/collect/${generatedKey}`;
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

  const handleSaveCustomerLink = async () => {
    if (!customerName || !customerSpid) {
      setError('Please enter both customer name and SPID');
      return;
    }

    const newCustomer = {
      id: Date.now().toString(),
      name: customerName,
      spid: customerSpid,
      link: `${selectedEndpoint.url}/collect/${generatedKey}?spid=${encodeURIComponent(customerSpid)}`,
      individuals: []
    };

    try {
      setLoading(true);
      setError(null);
      
      if (databaseEnvironment === 'production') {
        // Only try API calls in production mode
        try {
          console.debug('Creating customer via API:', newCustomer);
          const savedCustomer = await customerService.createCustomer(newCustomer);
          console.debug('Customer created:', savedCustomer);
          setSavedKeys(prev => [...(prev || []), savedCustomer]);
        } catch (apiError) {
          console.error('API create customer failed:', apiError);
          setError('Failed to save customer to production database. Please try again.');
          return;
        }
      } else {
        // In local mode, just use local state
        console.debug('Local mode: Saving customer to local state:', newCustomer);
        setSavedKeys(prev => [...(prev || []), newCustomer]);
      }

      setCustomerName('');
      setCustomerSpid('');
      setError('');
    } catch (err) {
      console.error('Error in handleSaveCustomerLink:', err);
      setError('Failed to save customer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomerLink = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      if (databaseEnvironment === 'production') {
        // Only try API calls in production mode
        try {
          await customerService.deleteCustomer(id);
        } catch (apiError) {
          console.error('API delete failed:', apiError);
          setError('Failed to delete customer from production database. Please try again.');
          return;
        }
      }
      
      // Always update local state
      setSavedKeys(prev => prev.filter(customer => customer.id !== id));
      
    } catch (err) {
      console.error('Error in handleDeleteCustomerLink:', err);
      setError('Failed to delete customer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
      
      if (databaseEnvironment === 'production') {
        // Only try API calls in production mode
        try {
          const updatedCustomer = await customerService.addIndividual(customerId, individualData);
          setSavedKeys(prev => prev.map(customer =>
            customer.id === customerId ? updatedCustomer : customer
          ));
        } catch (apiError) {
          console.error('API add individual failed:', apiError);
          setError('Failed to add individual to production database. Please try again.');
          return;
        }
      } else {
        // In local mode, just update local state
        setSavedKeys(prev => prev.map(customer => {
          if (customer.id === customerId) {
            return {
              ...customer,
              individuals: [...(customer.individuals || []), individualData]
            };
          }
          return customer;
        }));
      }
      
      setIndividualId('');
    } catch (err) {
      console.error('Error in handleAddIndividual:', err);
      setError('Failed to add individual. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteIndividual = async (customerId, individualId) => {
    try {
      setLoading(true);
      setError(null);
      
      if (databaseEnvironment === 'production') {
        // Only try API calls in production mode
        try {
          await customerService.removeIndividual(customerId, individualId);
        } catch (apiError) {
          console.error('API delete individual failed:', apiError);
          setError('Failed to delete individual from production database. Please try again.');
          return;
        }
      }
      
      // Always update local state
      setSavedKeys(prev => prev.map(customer => {
        if (customer.id === customerId) {
          return {
            ...customer,
            individuals: (customer.individuals || []).filter(ind => ind.id !== individualId)
          };
        }
        return customer;
      }));
      
    } catch (err) {
      console.error('Error in handleDeleteIndividual:', err);
      setError('Failed to delete individual. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getIndividualLink = (customerLink, individualId) => {
    // Add puid to the existing URL while preserving the structure
    const url = new URL(customerLink);
    url.searchParams.append('puid', individualId);
    return url.toString();
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

  const handleAnalyze = (value, type = 'key') => {
    let analysisValue;
    
    console.debug('handleAnalyze called with:', { value, type });
    console.debug('Current endpoint:', selectedEndpoint);
    console.debug('Current generated key:', generatedKey);
    
    if (type === 'collection') {
      // For collection links, construct the full URL with /collect/ path
      analysisValue = `${selectedEndpoint.url}/collect/${generatedKey}`;
      console.debug('Collection link analysis value:', analysisValue);
    } else if (type === 'customer' || type === 'individual') {
      // For customer and individual links, use the full URL as is
      analysisValue = value;
      console.debug('Customer/Individual link analysis value:', analysisValue);
    } else {
      // For raw key analysis
      analysisValue = `${selectedEndpoint.url}/collect/${value}`;
      console.debug('Raw key analysis value:', analysisValue);
    }

    console.debug('Final analysis value:', analysisValue);
    console.debug('Navigating to analyze with state:', {
      url: analysisValue,
      type,
      endpoint: selectedEndpoint
    });

    navigate('/analyze', {
      state: {
        url: analysisValue,
        type,
        endpoint: selectedEndpoint
      }
    });
  };

  const handleCopyCustomerLink = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedLink(true);
      setTimeout(() => {
        setCopiedLink(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy customer link:', error);
    }
  };

  return (
    <Container>
      <Header>
        <Title>KeyMaker</Title>
        <Description>Generate and manage background check requirement keys</Description>
      </Header>

      <Card style={{ marginBottom: '2rem' }}>
        <CardTitle>Database Environment</CardTitle>
        <DatabaseEnvironmentSelect 
          value={databaseEnvironment} 
          onChange={handleDatabaseEnvironmentChange}
        >
          <option value="local">Local Database</option>
          <option value="production">Production Database</option>
        </DatabaseEnvironmentSelect>
      </Card>

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
              value={generatedKey}
              readOnly
              onClick={(e) => e.target.select()}
              data-testid="generated-key-field"
            />
            <AnalyzeButton onClick={() => handleAnalyze(generatedKey)}>
              <FiSearch /> Analyze
            </AnalyzeButton>
          </OutputContainer>
          <CopyButton onClick={handleCopyToClipboard}>
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </CopyButton>
        </OutputCard>

        <CollectionLinkCard>
          <CardTitle>
            <StepNumber>2</StepNumber>
            Collection Link
          </CardTitle>
          <EndpointSection>
            <EndpointSelect value={selectedEndpoint?.id} onChange={handleEndpointChange}>
              {endpoints.endpoints.map(endpoint => (
                <option key={endpoint.id} value={endpoint.id}>
                  {endpoint.name}
                </option>
              ))}
            </EndpointSelect>
            <EndpointDescription>{selectedEndpoint?.description}</EndpointDescription>
          </EndpointSection>
          <OutputContainer>
            <OutputField
              type="text"
              value={`${selectedEndpoint.url}/collect/${generatedKey}`}
              readOnly
              onClick={(e) => e.target.select()}
            />
            <AnalyzeButton onClick={() => {
              console.debug('Collection link analyze button clicked');
              console.debug('Current generated key:', generatedKey);
              console.debug('Current endpoint:', selectedEndpoint);
              handleAnalyze(`${selectedEndpoint.url}/collect/${generatedKey}`, 'collection');
            }}>
              <FiSearch /> Analyze
            </AnalyzeButton>
          </OutputContainer>
          <CopyButton onClick={handleCopyCollectionLink}>
            <FiCopy /> {copiedLink ? 'Copied!' : 'Copy Link'}
          </CopyButton>
        </CollectionLinkCard>

        <CustomerLinkCard>
          <CardTitle>
            <StepNumber>3</StepNumber>
            Customer Collection Links
          </CardTitle>
          <CustomerInputGroup>
            <CustomerInputField
              type="text"
              placeholder="Enter customer name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <CustomerInputField
              type="text"
              placeholder="Enter customer SPID"
              value={customerSpid}
              onChange={(e) => setCustomerSpid(e.target.value)}
            />
            <SaveButton onClick={handleSaveCustomerLink}>
              <FiLink /> Save Customer Link
            </SaveButton>
          </CustomerInputGroup>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <CustomerList>
            {(savedKeys || []).map(customer => (
              <CustomerLinkItem key={customer.id}>
                <CustomerInfoDisplay>
                  <CustomerName>{customer.name}</CustomerName>
                  <CustomerDetail>SPID: {customer.spid}</CustomerDetail>
                </CustomerInfoDisplay>
                <CustomerLink>{customer.link}</CustomerLink>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <CopyButton onClick={() => handleCopyCustomerLink(customer.link)}>
                    <FiCopy /> Copy Link
                  </CopyButton>
                  <AnalyzeButton onClick={() => handleAnalyze(customer.link, 'customer')}>
                    <FiSearch /> Analyze
                  </AnalyzeButton>
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
                    {(customer.individuals || []).map(individual => (
                      <IndividualItem key={individual.id}>
                        <IndividualId>{individual.id}</IndividualId>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <CopyButton 
                            onClick={() => handleCopyIndividualLink(customer.link, individual.id)}
                          >
                            <FiCopy /> Copy Individual Link
                          </CopyButton>
                          <AnalyzeButton 
                            onClick={() => handleAnalyze(getIndividualLink(customer.link, individual.id), 'individual')}
                          >
                            <FiSearch /> Analyze
                          </AnalyzeButton>
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
          </CustomerList>
        </CustomerLinkCard>
      </OutputGrid>
    </Container>
  );
};

export default KeyMaker; 
