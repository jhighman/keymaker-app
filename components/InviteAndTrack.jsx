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

const InviteAndTrack = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [showAddIndividual, setShowAddIndividual] = useState(false);
  const [individualId, setIndividualId] = useState('');
  const [selectedEndpoint, setSelectedEndpoint] = useState(endpoints.endpoints[0].id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize database in local mode
  useEffect(() => {
    console.debug('Initializing database in local mode for InviteAndTrack');
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
      status: 'pending' // pending, completed, expired
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
      
      setIndividualId('');
      setShowAddIndividual(false);
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
      
      setIndividualId('');
      setShowAddIndividual(false);
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

  const getIndividualLink = (customerLink, individualId) => {
    return `${customerLink}&puid=${individualId}`;
  };

  const handleCopyIndividualLink = (customerLink, individualId) => {
    const link = getIndividualLink(customerLink, individualId);
    navigator.clipboard.writeText(link)
      .catch(err => console.error('Failed to copy individual link:', err));
  };

  const handleSendInvite = (customerLink, individualId) => {
    const link = getIndividualLink(customerLink, individualId);
    // TODO: Implement email sending functionality
    console.log('Sending invite with link:', link);
  };

  return (
    <Container>
      <Header>
        <Title>Invite and Track</Title>
        <Description>Manage collection invites and track completion status</Description>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      
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
                  <IndividualItem key={individual.id}>
                    <IndividualInfo>
                      <IndividualId>{individual.id}</IndividualId>
                      <ActionButtons>
                        <CopyButton
                          onClick={() => handleCopyIndividualLink(selectedCustomer.link, individual.id)}
                        >
                          <FiCopy /> Copy Link
                        </CopyButton>
                        <SendButton
                          onClick={() => handleSendInvite(selectedCustomer.link, individual.id)}
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
              placeholder="Enter individual ID"
              value={individualId}
              onChange={(e) => setIndividualId(e.target.value)}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button onClick={handleAddIndividual}>
                <FiPlus /> Add Individual
              </Button>
              <Button onClick={() => setShowAddIndividual(false)}>
                Cancel
              </Button>
            </div>
          </ModalContent>
        </AddIndividualModal>
      )}
    </Container>
  );
};

export default InviteAndTrack; 