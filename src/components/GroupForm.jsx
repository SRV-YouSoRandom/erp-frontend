import { useState, useEffect } from 'react';
import { TextInput, Textarea, Button, Select, Box, Title, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { toast } from 'react-toastify';
import cli from '../services/cli';

const GroupForm = ({ onGroupCreated }) => {
  const [addresses, setAddresses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm({
    initialValues: {
      name: '',
      description: '',
      fromAddress: '',
    },
    validate: {
      name: (value) => (value ? null : 'Group name is required'),
      description: (value) => (value ? null : 'Description is required'),
      fromAddress: (value) => (value ? null : 'From address is required'),
    },
  });

  useEffect(() => {
    const fetchAddresses = async () => {
      setIsLoading(true);
      try {
        const keysData = await cli.getKeys();
        console.log("Fetched keys:", keysData);
        
        // Check if keysData has the keys property and it's an array
        if (keysData && Array.isArray(keysData.keys)) {
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
      } catch (error) {
        toast.error('Failed to load addresses');
        console.error('Error loading addresses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      await cli.createGroup(
        values.name,
        values.description,
        values.fromAddress
      );
      toast.success('Group created successfully!');
      form.reset();
      if (onGroupCreated) onGroupCreated();
    } catch (error) {
      toast.error('Failed to create group');
      console.error('Error creating group:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box className="form-container">
      <Title order={4} mb={15}>Create New Group</Title>
      
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Group Name"
          placeholder="e.g., Assets, Liabilities"
          required
          mb={15}
          {...form.getInputProps('name')}
        />
        
        <Textarea
          label="Description"
          placeholder="A brief description of this group"
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
          <Button type="submit" loading={isSubmitting}>
            Create Group
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default GroupForm;