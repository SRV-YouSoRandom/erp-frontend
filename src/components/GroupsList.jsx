import { useState, useEffect } from 'react';
import { Table, Title, Text, Loader, Box, Card } from '@mantine/core';
import { toast } from 'react-toastify';
import api from '../services/api';

const GroupsList = ({ refreshTrigger }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      try {
        const data = await api.getGroups();
        console.log("Fetched groups:", data);
        setGroups(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error('Failed to load groups');
        console.error('Error loading groups:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: '30px' }}>
        <Loader />
      </Box>
    );
  }

  if (groups.length === 0) {
    return (
      <Card p="lg" radius="md" withBorder mb={20}>
        <Text c="dimmed" ta="center">No groups found. Create a new group to get started.</Text>
      </Card>
    );
  }

  return (
    <Box mb={30}>
      <Title order={4} mb={15}>Accounting Groups</Title>
      
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th>Creator</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {groups.map((group) => (
            <Table.Tr key={group.id}>
              <Table.Td>{group.id}</Table.Td>
              <Table.Td>{group.name}</Table.Td>
              <Table.Td>{group.description}</Table.Td>
              <Table.Td>{group.creator}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Box>
  );
};

export default GroupsList;