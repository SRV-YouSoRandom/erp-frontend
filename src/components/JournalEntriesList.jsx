// src/components/JournalEntriesList.jsx
import { useState, useEffect } from 'react';
import { Table, Title, Text, Loader, Box, Card, Button, Group } from '@mantine/core';
import { toast } from 'react-toastify';
import api from '../services/api';
import DetailModal from './DetailModal';

const JournalEntriesList = ({ refreshTrigger }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntryId, setSelectedEntryId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleViewDetails = (id) => {
    setSelectedEntryId(id);
    setIsModalOpen(true);
  };

  const renderEntryDetails = (entry) => (
    <>
      <Box mb={15}>
        <Title order={5}>Journal Entry ID</Title>
        <Text>{entry.id}</Text>
      </Box>
      
      <Box mb={15}>
        <Title order={5}>Description</Title>
        <Text>{entry.description}</Text>
      </Box>
      
      <Box mb={15}>
        <Title order={5}>Amount</Title>
        <Text>{entry.amount}</Text>
      </Box>
      
      <Box mb={15}>
        <Title order={5}>Debit Group</Title>
        <Text>{entry.debitGroup}</Text>
      </Box>
      
      <Box mb={15}>
        <Title order={5}>Credit Group</Title>
        <Text>{entry.creditGroup}</Text>
      </Box>
      
      <Box mb={15}>
        <Title order={5}>Sender</Title>
        <Text style={{ wordBreak: 'break-all' }}>{entry.sender}</Text>
      </Box>
      
      <Box mb={15}>
        <Title order={5}>Receiver</Title>
        <Text style={{ wordBreak: 'break-all' }}>{entry.receiver}</Text>
      </Box>
      
      <Box mb={15}>
        <Title order={5}>Creator</Title>
        <Text style={{ wordBreak: 'break-all' }}>{entry.creator}</Text>
      </Box>
    </>
  );

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
      
      <div className="table-container">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Amount</Table.Th>
              <Table.Th>Debit Group</Table.Th>
              <Table.Th>Credit Group</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {entries.map((entry) => (
              <Table.Tr key={entry.id}>
                <Table.Td>{entry.id}</Table.Td>
                <Table.Td>{entry.description}</Table.Td>
                <Table.Td>{entry.amount}</Table.Td>
                <Table.Td>{entry.debitGroup}</Table.Td>
                <Table.Td>{entry.creditGroup}</Table.Td>
                <Table.Td>
                  <Button 
                    size="xs" 
                    variant="light"
                    onClick={() => handleViewDetails(entry.id)}
                  >
                    View Details
                  </Button>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>

      <DetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Journal Entry Details"
        id={selectedEntryId}
        fetchData={api.getJournalEntry}
        renderContent={renderEntryDetails}
      />
    </Box>
  );
};

export default JournalEntriesList;