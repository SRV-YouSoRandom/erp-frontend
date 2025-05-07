import { useState, useEffect } from 'react';
import { TextInput, NumberInput, Button, Select, Box, Title, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { toast } from 'react-toastify';
import cli from '../services/cli';
import api from '../services/api';

const SendAndRecordForm = () => {
  const [addresses, setAddresses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm({
    initialValues: {
      receiverAddress: '',
      amount: 0,
      denom: 'stake',
      debitGroupId: '',
      creditGroupId: '',
      description: '',
      fromAddress: '',
    },
    validate: {
      receiverAddress: (value) => (value ? null : 'Receiver address is required'),
      amount: (value) => (value > 0 ? null : 'Amount must be greater than 0'),
      debitGroupId: (value) => (value ? null : 'Debit Group ID is required'),
      creditGroupId: (value) => (value ? null : 'Credit Group ID is required'),
      description: (value) => (value ? null : 'Description is required'),
      fromAddress: (value) => (value ? null : 'From address is required'),
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch addresses
        const keysData = await cli.getKeys();
        if (keysData && keysData.keys) {
          const formattedAddresses = keysData.keys.map(key => ({
            value: key.address,
            label: `${key.name} (${key.address})`,
          }));
          setAddresses(formattedAddresses);
          
          if (formattedAddresses.length > 0) {
            form.setFieldValue('fromAddress', formattedAddresses[0].value);
          }
        } else {
          console.error('Invalid keys data:', keysData);
          toast.error('Failed to load addresses');
        }
        
        // Fetch groups
        const groupsData = await api.getGroups();
        if (Array.isArray(groupsData)) {
          const formattedGroups = groupsData.map(group => ({
            // Here we need the ID as the send-and-record command uses IDs
            value: group.id.toString(),
            label: `${group.id} - ${group.name} (${group.description})`,
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
      await cli.sendAndRecord(
        values.receiverAddress,
        values.amount,
        values.denom,
        values.debitGroupId,
        values.creditGroupId,
        values.description,
        values.fromAddress
      );
      toast.success('Transaction completed and recorded successfully!');
      form.reset();
    } catch (error) {
      toast.error('Failed to send and record transaction');
      console.error('Error in send and record:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box className="form-container">
      <Title order={4} mb={15}>Send Tokens & Record Transaction</Title>
      
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Receiver Address"
          placeholder="Enter receiver's address"
          required
          mb={15}
          {...form.getInputProps('receiverAddress')}
        />
        
        <NumberInput
          label="Amount"
          placeholder="Enter amount to send"
          min={1}
          required
          mb={15}
          {...form.getInputProps('amount')}
        />
        
        <TextInput
          label="Denomination"
          placeholder="e.g., stake"
          required
          mb={15}
          {...form.getInputProps('denom')}
        />
        
        <Select
          label="Debit Group ID"
          placeholder="Select debit group"
          data={groups}
          required
          mb={15}
          {...form.getInputProps('debitGroupId')}
          disabled={isLoading}
        />
        
        <Select
          label="Credit Group ID"
          placeholder="Select credit group"
          data={groups}
          required
          mb={15}
          {...form.getInputProps('creditGroupId')}
          disabled={isLoading}
        />
        
        <TextInput
          label="Description"
          placeholder="e.g., Payment for services"
          required
          mb={15}
          {...form.getInputProps('description')}
        />
        
        <Select
          label="From Address"
          placeholder="Select sender address"
          data={addresses}
          required
          mb={20}
          {...form.getInputProps('fromAddress')}
          disabled={isLoading}
        />
        
        <Group justify="flex-end">
          <Button 
            type="submit" 
            loading={isSubmitting || isLoading}
            disabled={isLoading}
          >
            Send & Record
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default SendAndRecordForm;