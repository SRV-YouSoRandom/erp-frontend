import { useState, useEffect } from 'react';
import { TextInput, NumberInput, Button, Select, Box, Title, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { toast } from 'react-toastify';
import cli from '../services/cli';
import api from '../services/api';

const JournalEntryForm = ({ onEntryCreated }) => {
  const [addresses, setAddresses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm({
    initialValues: {
      description: '',
      debitGroup: '',
      creditGroup: '',
      amount: 0,
      sender: '',      // Added sender field
      receiver: '',    // Added receiver field
      fromAddress: '',
    },
    validate: {
      description: (value) => (value ? null : 'Description is required'),
      debitGroup: (value) => (value ? null : 'Debit Group is required'),
      creditGroup: (value) => (value ? null : 'Credit Group is required'),
      amount: (value) => (value > 0 ? null : 'Amount must be greater than 0'),
      sender: (value) => (value ? null : 'Sender is required'),     // Added validation
      receiver: (value) => (value ? null : 'Receiver is required'), // Added validation
      fromAddress: (value) => (value ? null : 'From address is required'),
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch addresses
        const keysData = await cli.getKeys();
        console.log("Fetched keys in JournalEntryForm:", keysData);
        
        if (keysData && Array.isArray(keysData.keys)) {
          const formattedAddresses = keysData.keys.map(key => ({
            value: key.address,
            label: `${key.name} (${key.address})`,
          }));
          setAddresses(formattedAddresses);
          
          if (formattedAddresses.length > 0) {
            form.setFieldValue('fromAddress', formattedAddresses[0].value);
            // Set default sender and receiver to the first address
            form.setFieldValue('sender', formattedAddresses[0].value);
            form.setFieldValue('receiver', formattedAddresses[0].value);
          }
        } else {
          console.error('Invalid keys data:', keysData);
          toast.error('Failed to load addresses');
        }
        
        // Fetch groups
        const groupsData = await api.getGroups();
        console.log("Fetched groups in JournalEntryForm:", groupsData);
        
        if (Array.isArray(groupsData) && groupsData.length > 0) {
          const formattedGroups = groupsData.map(group => ({
            // Updated: using group ID instead of name for the command
            value: group.id.toString(),
            label: `${group.name} - ${group.description}`,
          }));
          setGroups(formattedGroups);
        } else {
          console.error('Invalid groups data:', groupsData);
          toast.error('Failed to load groups');
        }
      } catch (error) {
        toast.error('Failed to load data');
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting journal entry with values:", values);
      const result = await cli.createJournalEntry(
        values.description,
        values.debitGroup,
        values.creditGroup,
        values.amount,
        values.sender,       // Added sender
        values.receiver,     // Added receiver
        values.fromAddress
      );
      console.log("Journal entry response:", result);
      toast.success('Journal entry created successfully!');
      form.reset();
      if (onEntryCreated) onEntryCreated();
    } catch (error) {
      toast.error('Failed to create journal entry: ' + (error.message || 'Unknown error'));
      console.error('Error creating journal entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box className="form-container">
      <Title order={4} mb={15}>Create Journal Entry</Title>
      
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Description"
          placeholder="e.g., Initial investment, Office supplies purchase"
          required
          mb={15}
          {...form.getInputProps('description')}
        />
        
        <Select
          label="Debit Group"
          placeholder="Select debit group"
          data={groups}
          required
          mb={15}
          {...form.getInputProps('debitGroup')}
          disabled={isLoading || groups.length === 0}
        />
        
        <Select
          label="Credit Group"
          placeholder="Select credit group"
          data={groups}
          required
          mb={15}
          {...form.getInputProps('creditGroup')}
          disabled={isLoading || groups.length === 0}
        />
        
        <NumberInput
          label="Amount"
          placeholder="Enter amount"
          min={1}
          required
          mb={15}
          {...form.getInputProps('amount')}
        />

        {/* Added Sender field */}
        <Select
          label="Sender Address"
          placeholder="Select sender address"
          data={addresses}
          required
          mb={15}
          {...form.getInputProps('sender')}
          disabled={isLoading || addresses.length === 0}
        />
        
        {/* Added Receiver field */}
        <Select
          label="Receiver Address"
          placeholder="Select receiver address"
          data={addresses}
          required
          mb={15}
          {...form.getInputProps('receiver')}
          disabled={isLoading || addresses.length === 0}
        />
        
        <Select
          label="From Address (Transaction Signer)"
          placeholder="Select transaction signer address"
          data={addresses}
          required
          mb={20}
          {...form.getInputProps('fromAddress')}
          disabled={isLoading || addresses.length === 0}
        />
        
        <Group justify="flex-end">
          <Button 
            type="submit" 
            loading={isSubmitting || isLoading}
            disabled={isLoading}
          >
            Create Entry
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default JournalEntryForm;