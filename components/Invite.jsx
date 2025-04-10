import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { FiCopy, FiCheck, FiLink, FiPlus, FiUser, FiMail, FiLoader, FiUsers, FiRefreshCw, FiX } from 'react-icons/fi';
import endpoints from '../config/endpoints.json';
import { customerService, initializeDatabase } from '../services/api';

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
  grid-template-columns: 350px 1fr;
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

const Button = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.primary};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  color: white;
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

const CustomerList = styled.div`
  margin-top: ${props => props.theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const CustomerItem = styled.div`
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.isSelected ? props.theme.colors.primaryLight : 'white'};

  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const CustomerName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const CustomerStats = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textLight};
  margin-top: ${props => props.theme.spacing.xs};
`;

const DetailCard = styled(Card)`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const DetailTitle = styled.h2`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text};
`;

const IndividualSection = styled.div`
  flex: 1;
`;

const IndividualHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const IndividualList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const IndividualItem = styled.div`
  padding: ${props => props.theme.spacing.lg};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: white;
`;

const IndividualInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const IndividualId = styled.div`
  font-family: ${props => props.theme.fonts.mono};
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textLight};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
`;

const CopyButton = styled(Button)`
  width: auto;
  background: ${props => props.theme.colors.secondary};
`;

const SendButton = styled(Button)`
  width: auto;
  background: ${props => props.theme.colors.success};
`;

const DeleteButton = styled(Button)`
  width: auto;
  background: #dc3545;
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

const AddIndividualModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled(Card)`
  width: 100%;
  max-width: 500px;
`;

const Invite = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [showAddIndividual, setShowAddIndividual] = useState(false);
  const [showSendInviteModal, setShowSendInviteModal] = useState(false);
  const [showIndividualDetails, setShowIndividualDetails] = useState(false);
  const [selectedIndividual, setSelectedIndividual] = useState(null);
  const [individualId, setIndividualId] = useState('');
  const [individualEmail, setIndividualEmail] = useState('');
  const [individualPhone, setIndividualPhone] = useState('');
  const [preferredChannel, setPreferredChannel] = useState('email');
  const [inviteCustomerId, setInviteCustomerId] = useState(null);
  const [inviteIndividualId, setInviteIndividualId] = useState(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState(endpoints.endpoints[0].id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  // Initialize database in local mode
  useEffect(() => {
    console.debug('Initializing database in local mode for Invite');
    initializeDatabase('local');
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.debug('Fetching customers...');
      const data = await customerService.getCustomers();
      console.debug('Fetched customers:', data);
      setCustomers(data || []);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Failed to load customers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch customers on mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleAddCustomer = async () => {
    if (!customerName.trim()) return;

    const newCustomer = {
      name: customerName,
      link: `${endpoints.endpoints[0].url}?key=en-EPA-DTB-R5-E3-E-P-W`,
      individuals: [],
      endpoint: endpoints.endpoints[0].name
    };

    try {
      setLoading(true);
      setError(null);
      const savedCustomer = await customerService.createCustomer(newCustomer);
      setCustomers(prev => [...prev, savedCustomer]);
      setCustomerName('');
    } catch (err) {
      console.error('Error adding customer:', err);
      setError('Failed to add customer. Please try again.');
      
      // Fallback to local state if API fails
      const fallbackCustomer = {
        id: Date.now(),
        ...newCustomer
      };
      setCustomers(prev => [...prev, fallbackCustomer]);
      setCustomerName('');
    } finally {
      setLoading(false);
    }
  };

  const handleAddIndividual = async () => {
    if (!individualId.trim() || !selectedCustomer) return;

    const individualData = {
      id: individualId,
      timestamp: Date.now(),
      status: 'pending', // pending, invited, started, in_progress, completed, expired, failed
      contactInfo: {
        email: individualEmail,
        phone: individualPhone,
        preferredChannel
      }
    };

    try {
      setLoading(true);
      setError(null);
      
      // Add individual via API
      const updatedCustomer = await customerService.addIndividual(selectedCustomer.id, individualData);
      
      // Update local state
      setCustomers(prev => prev.map(customer =>
        customer.id === selectedCustomer.id ? updatedCustomer : customer
      ));
      
      // Reset form fields
      setIndividualId('');
      setIndividualEmail('');
      setIndividualPhone('');
      setPreferredChannel('email');
      setShowAddIndividual(false);
      
      // Show success message
      setMessage(`Individual ${individualId} added successfully`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error adding individual:', err);
      setError('Failed to add individual. Please try again.');
      
      // Fallback to local state if API fails
      setCustomers(prev => prev.map(customer => {
        if (customer.id === selectedCustomer.id) {
          return {
            ...customer,
            individuals: [...customer.individuals, individualData]
          };
        }
        return customer;
      }));
      
      // Reset form fields
      setIndividualId('');
      setIndividualEmail('');
      setIndividualPhone('');
      setPreferredChannel('email');
      setShowAddIndividual(false);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSendInvite = (customerId, individualId) => {
    // Find the individual
    const customer = customers.find(c => c.id === customerId);
    if (!customer) {
      setError('Customer not found');
      return;
    }
    
    const individual = customer.individuals.find(ind => ind.id === individualId);
    if (!individual) {
      setError('Individual not found');
      return;
    }
    
    // Set the contact information from the individual
    setIndividualEmail(individual.contactInfo?.email || '');
    setIndividualPhone(individual.contactInfo?.phone || '');
    setPreferredChannel(individual.contactInfo?.preferredChannel || 'email');
    
    // Set the customer and individual IDs for the invite
    setInviteCustomerId(customerId);
    setInviteIndividualId(individualId);
    
    // Show the send invite modal
    setShowSendInviteModal(true);
  };
  
  const handleSendInviteConfirm = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Find the individual
      const customer = customers.find(c => c.id === inviteCustomerId);
      if (!customer) {
        setError('Customer not found');
        return;
      }
      
      // Create message based on channel
      let messageText = '';
      if (preferredChannel === 'email') {
        messageText = `Please complete your background check by clicking this link: ${getIndividualLink(customer.link, inviteIndividualId)}`;
      } else if (preferredChannel === 'sms') {
        messageText = `Background check required. Click to complete: ${getIndividualLink(customer.link, inviteIndividualId)}`;
      }
      
      // Send invitation
      await customerService.sendInvitation(inviteCustomerId, inviteIndividualId, preferredChannel, messageText);
      
      // Update the individual's contact info in the database
      const individual = customer.individuals.find(ind => ind.id === inviteIndividualId);
      if (individual) {
        const updatedContactInfo = {
          email: individualEmail,
          phone: individualPhone,
          preferredChannel
        };
        
        await customerService.updateIndividualContactInfo(inviteCustomerId, inviteIndividualId, updatedContactInfo);
      }
      
      // Update local state
      setCustomers(prev => prev.map(c => {
        if (c.id === inviteCustomerId) {
          return {
            ...c,
            individuals: c.individuals.map(ind => {
              if (ind.id === inviteIndividualId) {
                return {
                  ...ind,
                  status: 'invited',
                  contactInfo: {
                    email: individualEmail,
                    phone: individualPhone,
                    preferredChannel
                  }
                };
              }
              return ind;
            })
          };
        }
        return c;
      }));
      
      // Close the modal
      setShowSendInviteModal(false);
      
      // Show success message
      setMessage(`Invitation sent to ${inviteIndividualId} via ${preferredChannel}`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error sending invitation:', err);
      setError(`Failed to send invitation: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteIndividual = async (customerId, individualId) => {
    try {
      setLoading(true);
      setError(null);
      
      // Delete individual via API
      await customerService.removeIndividual(customerId, individualId);
      
      // Update local state
      setCustomers(prev => prev.map(customer => {
        if (customer.id === customerId) {
          return {
            ...customer,
            individuals: customer.individuals.filter(ind => ind.id !== individualId)
          };
        }
        return customer;
      }));
    } catch (err) {
      console.error('Error deleting individual:', err);
      setError('Failed to delete individual. Please try again.');
      
      // Still update UI even if API fails
      setCustomers(prev => prev.map(customer => {
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#6c757d'; // gray
      case 'invited':
        return '#007bff'; // blue
      case 'started':
        return '#17a2b8'; // cyan
      case 'in_progress':
        return '#ffc107'; // yellow
      case 'completed':
        return '#28a745'; // green
      case 'expired':
        return '#dc3545'; // red
      case 'failed':
        return '#dc3545'; // red
      default:
        return '#6c757d'; // gray
    }
  };

  const getIndividualLink = (customerLink, individualId) => {
    return `${customerLink}&puid=${individualId}`;
  };

  const handleCopyIndividualLink = (customerLink, individualId) => {
    const link = getIndividualLink(customerLink, individualId);
    navigator.clipboard.writeText(link)
      .catch(err => console.error('Failed to copy individual link:', err));
  };

  const handleSendInviteSimple = (customerLink, individualId) => {
    // Use the new implementation instead
    const customer = customers.find(c => c.link === customerLink);
    if (customer) {
      handleSendInvite(customer.id, individualId);
    } else {
      console.log('Customer not found for link:', customerLink);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Invite</Title>
        <Description>Manage collection invites and track completion status</Description>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {message && (
        <div style={{
          padding: '12px',
          backgroundColor: '#d4edda',
          color: '#155724',
          borderRadius: '4px',
          marginBottom: '16px'
        }}>
          {message}
        </div>
      )}
      
      <Grid>
        <Card>
          <CardTitle>
            <FiUser /> Customers
          </CardTitle>
          <CustomerInput
            type="text"
            placeholder="Enter customer name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          <Button onClick={handleAddCustomer} disabled={loading}>
            {loading ? <FiLoader /> : <FiPlus />} Add Customer
          </Button>

          {loading && !customers.length ? (
            <LoadingSpinner>
              <FiLoader size={24} /> Loading customers...
            </LoadingSpinner>
          ) : (
            <CustomerList>
              {customers.map(customer => (
                <CustomerItem
                  key={customer.id}
                  isSelected={selectedCustomer?.id === customer.id}
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <CustomerName>{customer.name}</CustomerName>
                  <CustomerStats>
                    {customer.individuals.length} individuals
                  </CustomerStats>
                </CustomerItem>
              ))}
            </CustomerList>
          )}
        </Card>

        {selectedCustomer ? (
          <DetailCard>
            <DetailHeader>
              <DetailTitle>{selectedCustomer.name}</DetailTitle>
              <Button onClick={() => setShowAddIndividual(true)}>
                <FiPlus /> Add Individual
              </Button>
            </DetailHeader>

            <IndividualSection>
              <IndividualList>
                {selectedCustomer.individuals.map(individual => (
                  <IndividualItem
                    key={individual.id}
                    onClick={() => {
                      setSelectedIndividual(individual);
                      setShowIndividualDetails(true);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <IndividualInfo>
                      <div>
                        <IndividualId>{individual.id}</IndividualId>
                        <div style={{
                          marginTop: '4px',
                          fontSize: '0.8rem',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          display: 'inline-block',
                          backgroundColor: getStatusColor(individual.status),
                          color: 'white'
                        }}>
                          {individual.status || 'pending'}
                        </div>
                        {individual.contactInfo?.email && (
                          <div style={{ fontSize: '0.8rem', marginTop: '4px', color: '#666' }}>
                            {individual.contactInfo.email}
                          </div>
                        )}
                      </div>
                      <ActionButtons>
                        <CopyButton
                          onClick={() => handleCopyIndividualLink(selectedCustomer.link, individual.id)}
                        >
                          <FiCopy /> Copy Link
                        </CopyButton>
                        <SendButton
                          onClick={() => handleSendInvite(selectedCustomer.id, individual.id)}
                        >
                          <FiMail /> Send Invite
                        </SendButton>
                        <DeleteButton
                          onClick={() => handleDeleteIndividual(selectedCustomer.id, individual.id)}
                        >
                          Delete
                        </DeleteButton>
                      </ActionButtons>
                    </IndividualInfo>
                  </IndividualItem>
                ))}
              </IndividualList>
            </IndividualSection>
          </DetailCard>
        ) : (
          <DetailCard>
            <DetailHeader>
              <DetailTitle>Select a Customer</DetailTitle>
            </DetailHeader>
            <Description style={{ textAlign: 'center' }}>
              Select a customer from the list to manage their individuals
            </Description>
          </DetailCard>
        )}
      </Grid>

      {showAddIndividual && (
        <AddIndividualModal>
          <ModalContent>
            <CardTitle>Add Individual</CardTitle>
            
            <CustomerInput
              type="text"
              placeholder="Enter individual ID (required)"
              value={individualId}
              onChange={(e) => setIndividualId(e.target.value)}
            />
            
            <CustomerInput
              type="email"
              placeholder="Email address"
              value={individualEmail}
              onChange={(e) => setIndividualEmail(e.target.value)}
            />
            
            <CustomerInput
              type="tel"
              placeholder="Phone number"
              value={individualPhone}
              onChange={(e) => setIndividualPhone(e.target.value)}
            />
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>
                Preferred Communication Channel
              </label>
              <select
                value={preferredChannel}
                onChange={(e) => setPreferredChannel(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc'
                }}
              >
                <option value="email">Email</option>
                <option value="sms">SMS</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button onClick={handleAddIndividual}>
                <FiPlus /> Add Individual
              </Button>
              <Button onClick={() => {
                setShowAddIndividual(false);
                setIndividualId('');
                setIndividualEmail('');
                setIndividualPhone('');
                setPreferredChannel('email');
              }}>
                Cancel
              </Button>
            </div>
          </ModalContent>
        </AddIndividualModal>
      )}

      {showIndividualDetails && selectedIndividual && (
        <AddIndividualModal>
          <ModalContent>
            <CardTitle>Individual Details</CardTitle>
            
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ margin: '0 0 8px 0' }}>ID</h3>
              <div style={{ fontFamily: 'monospace' }}>{selectedIndividual.id}</div>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ margin: '0 0 8px 0' }}>Status</h3>
              <div style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '16px',
                backgroundColor: getStatusColor(selectedIndividual.status),
                color: 'white'
              }}>
                {selectedIndividual.status || 'pending'}
              </div>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ margin: '0 0 8px 0' }}>Contact Information</h3>
              <div>
                <strong>Email:</strong> {selectedIndividual.contactInfo?.email || 'Not provided'}
              </div>
              <div>
                <strong>Phone:</strong> {selectedIndividual.contactInfo?.phone || 'Not provided'}
              </div>
              <div>
                <strong>Preferred Channel:</strong> {selectedIndividual.contactInfo?.preferredChannel || 'email'}
              </div>
            </div>
            
            {selectedIndividual.communications && selectedIndividual.communications.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ margin: '0 0 8px 0' }}>Communication History</h3>
                {selectedIndividual.communications.map((comm, index) => (
                  <div key={index} style={{
                    padding: '8px',
                    marginBottom: '8px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px'
                  }}>
                    <div><strong>Channel:</strong> {comm.channel}</div>
                    <div><strong>Status:</strong> {comm.status}</div>
                    <div><strong>Date:</strong> {new Date(comm.timestamp).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <Button onClick={() => handleSendInvite(selectedCustomer.id, selectedIndividual.id)}>
                <FiMail /> Send Invitation
              </Button>
              <Button onClick={() => {
                setShowIndividualDetails(false);
                setSelectedIndividual(null);
              }}>
                Close
              </Button>
            </div>
          </ModalContent>
        </AddIndividualModal>
      )}
    </Container>
  );
};

export default Invite;