import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import Invite from '../components/Invite';
import { customerService, initializeDatabase } from '../services/api';
import theme from '../theme';

// Mock the API service
vi.mock('../services/api', () => ({
  initializeDatabase: vi.fn(),
  customerService: {
    getCustomers: vi.fn(),
    createCustomer: vi.fn(),
    addIndividual: vi.fn(),
    removeIndividual: vi.fn(),
    updateIndividualStatus: vi.fn(),
    updateContactInfo: vi.fn(),
    addCommunication: vi.fn(),
    sendInvitation: vi.fn()
  }
}));

describe('Invite Component', () => {
  const mockCustomers = [
    {
      id: '1',
      name: 'Test Customer',
      link: 'https://example.com/collect?key=test',
      endpoint: 'test-endpoint',
      individuals: [
        {
          id: 'ind-1',
          status: 'pending',
          contactInfo: {
            email: 'test@example.com',
            phone: '123-456-7890',
            preferredChannel: 'email'
          }
        }
      ]
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock API responses
    customerService.getCustomers.mockResolvedValue(mockCustomers);
    customerService.createCustomer.mockImplementation(customer => Promise.resolve({
      ...customer,
      id: '2'
    }));
    customerService.addIndividual.mockImplementation((customerId, individual) => {
      const customer = mockCustomers.find(c => c.id === customerId);
      return Promise.resolve({
        ...customer,
        individuals: [...customer.individuals, individual]
      });
    });
    customerService.sendInvitation.mockResolvedValue(mockCustomers[0]);
  });

  it('renders the component with title', () => {
    render(
      <ThemeProvider theme={theme}>
        <Invite />
      </ThemeProvider>
    );
    
    expect(screen.getByText('Invite')).toBeInTheDocument();
    expect(screen.getByText('Manage collection invites and track completion status')).toBeInTheDocument();
  });

  it('initializes database in local mode', () => {
    render(
      <ThemeProvider theme={theme}>
        <Invite />
      </ThemeProvider>
    );
    
    expect(initializeDatabase).toHaveBeenCalledWith('local');
  });

  it('fetches customers on mount', async () => {
    render(
      <ThemeProvider theme={theme}>
        <Invite />
      </ThemeProvider>
    );
    
    expect(customerService.getCustomers).toHaveBeenCalled();
    
    await waitFor(() => {
      expect(screen.getByText('Test Customer')).toBeInTheDocument();
    });
  });

  it('adds a new customer', async () => {
    render(
      <ThemeProvider theme={theme}>
        <Invite />
      </ThemeProvider>
    );
    
    // Fill in customer name
    const input = screen.getByPlaceholderText('Enter customer name');
    fireEvent.change(input, { target: { value: 'New Customer' } });
    
    // Click add button
    const addButton = screen.getByText(/Add Customer/i);
    fireEvent.click(addButton);
    
    expect(customerService.createCustomer).toHaveBeenCalledWith(expect.objectContaining({
      name: 'New Customer'
    }));
  });

  it('selects a customer when clicked', async () => {
    render(
      <ThemeProvider theme={theme}>
        <Invite />
      </ThemeProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Test Customer')).toBeInTheDocument();
    });
    
    // Click on customer
    fireEvent.click(screen.getByText('Test Customer'));
    
    // Should show customer details
    expect(screen.getByText('Add Individual')).toBeInTheDocument();
  });

  it('opens add individual modal', async () => {
    render(
      <ThemeProvider theme={theme}>
        <Invite />
      </ThemeProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Test Customer')).toBeInTheDocument();
    });
    
    // Click on customer
    fireEvent.click(screen.getByText('Test Customer'));
    
    // Click add individual button
    const addButton = screen.getByText('Add Individual');
    fireEvent.click(addButton);
    
    // Modal should be open
    expect(screen.getByText('Preferred Communication Channel')).toBeInTheDocument();
  });

  it('adds a new individual', async () => {
    render(
      <ThemeProvider theme={theme}>
        <Invite />
      </ThemeProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Test Customer')).toBeInTheDocument();
    });
    
    // Click on customer
    fireEvent.click(screen.getByText('Test Customer'));
    
    // Click add individual button
    const addButton = screen.getByText('Add Individual');
    fireEvent.click(addButton);
    
    // Fill in individual details
    const idInput = screen.getByPlaceholderText('Enter individual ID (required)');
    fireEvent.change(idInput, { target: { value: 'new-individual' } });
    
    const emailInput = screen.getByPlaceholderText('Email address');
    fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
    
    const phoneInput = screen.getByPlaceholderText('Phone number');
    fireEvent.change(phoneInput, { target: { value: '987-654-3210' } });
    
    // Submit form
    const submitButton = screen.getAllByText('Add Individual')[1]; // The one in the modal
    fireEvent.click(submitButton);
    
    expect(customerService.addIndividual).toHaveBeenCalledWith('1', expect.objectContaining({
      id: 'new-individual',
      contactInfo: expect.objectContaining({
        email: 'new@example.com',
        phone: '987-654-3210'
      })
    }));
  });

  it('sends an invitation', async () => {
    render(
      <ThemeProvider theme={theme}>
        <Invite />
      </ThemeProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Test Customer')).toBeInTheDocument();
    });
    
    // Click on customer
    fireEvent.click(screen.getByText('Test Customer'));
    
    // Wait for individuals to load
    await waitFor(() => {
      expect(screen.getByText('ind-1')).toBeInTheDocument();
    });
    
    // Click send invite button
    const sendButton = screen.getByText('Send Invite');
    fireEvent.click(sendButton);
    
    expect(customerService.sendInvitation).toHaveBeenCalledWith('1', 'ind-1', expect.any(String), expect.any(String));
  });

  it('deletes an individual', async () => {
    customerService.removeIndividual.mockResolvedValue(true);
    
    render(
      <ThemeProvider theme={theme}>
        <Invite />
      </ThemeProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Test Customer')).toBeInTheDocument();
    });
    
    // Click on customer
    fireEvent.click(screen.getByText('Test Customer'));
    
    // Wait for individuals to load
    await waitFor(() => {
      expect(screen.getByText('ind-1')).toBeInTheDocument();
    });
    
    // Click delete button
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    
    expect(customerService.removeIndividual).toHaveBeenCalledWith('1', 'ind-1');
  });

  it('shows individual details when clicked', async () => {
    render(
      <ThemeProvider theme={theme}>
        <Invite />
      </ThemeProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Test Customer')).toBeInTheDocument();
    });
    
    // Click on customer
    fireEvent.click(screen.getByText('Test Customer'));
    
    // Wait for individuals to load
    await waitFor(() => {
      expect(screen.getByText('ind-1')).toBeInTheDocument();
    });
    
    // Click on individual
    const individualItem = screen.getByText('ind-1').closest('div[style*="cursor: pointer"]');
    fireEvent.click(individualItem);
    
    // Individual details should be shown
    expect(screen.getByText('Individual Details')).toBeInTheDocument();
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Contact Information')).toBeInTheDocument();
  });

  it('displays error message when API fails', async () => {
    customerService.getCustomers.mockRejectedValue(new Error('API Error'));
    
    render(
      <ThemeProvider theme={theme}>
        <Invite />
      </ThemeProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load customers. Please try again.')).toBeInTheDocument();
    });
  });
});