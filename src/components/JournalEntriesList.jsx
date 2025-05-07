import { useState, useEffect } from 'react';
import { Table, Title, Text, Loader, Box, Card } from '@mantine/core';
import { toast } from 'react-toastify';
import api from '../services/api';

const JournalEntriesList = ({ refreshTrigger }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);
      try {
        const data = await api.getJournalEntries();
        console.log("Fetched journal entries:", data);
        setEntries(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error('Failed to load journal entries');
        console.error('Error loading journal entries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: '30px' }}>
        <Loader />
      </Box>
    );
  }

  if (entries.length === 0) {
    return (
      <Card p="lg" radius="md" withBorder mb={20}>
        <Text c="dimmed" ta="center">No journal entries found. Create a new entry to get started.</Text>
      </Card>
    );
  }

  return (
    <Box mb={30}>
      <Title order={4} mb={15}>Journal Entries</Title>
      
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th>Debit Group</Table.Th>
            <Table.Th>Credit Group</Table.Th>
            <Table.Th>Amount</Table.Th>
            <Table.Th>Sender</Table.Th>
            <Table.Th>Receiver</Table.Th>
            <Table.Th>Creator</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {entries.map((entry) => (
            <Table.Tr key={entry.id}>
              <Table.Td>{entry.id}</Table.Td>
              <Table.Td>{entry.description}</Table.Td>
              <Table.Td>{entry.debitGroup}</Table.Td>
              <Table.Td>{entry.creditGroup}</Table.Td>
              <Table.Td>{entry.amount}</Table.Td>
              <Table.Td>{entry.sender}</Table.Td>
              <Table.Td>{entry.receiver}</Table.Td>
              <Table.Td>{entry.creator}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Box>
  );
};

export default JournalEntriesList;