// src/components/GroupsList.jsx
import { useState, useEffect } from 'react';
import { Table, Title, Text, Loader, Box, Card, Button, Group } from '@mantine/core';
import { toast } from 'react-toastify';
import api from '../services/api';
import DetailModal from './DetailModal';

const GroupsList = ({ refreshTrigger }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleViewDetails = (id) => {
    setSelectedGroupId(id);
    setIsModalOpen(true);
  };

  const renderGroupDetails = (group) => (
    <>
      <Box mb={15}>
        <Title order={5}>Group ID</Title>
        <Text>{group.id}</Text>
      </Box>
      
      <Box mb={15}>
        <Title order={5}>Name</Title>
        <Text>{group.name}</Text>
      </Box>
      
      <Box mb={15}>
        <Title order={5}>Description</Title>
        <Text>{group.description}</Text>
      </Box>
      
      <Box mb={15}>
        <Title order={5}>Creator</Title>
        <Text style={{ wordBreak: 'break-all' }}>{group.creator}</Text>
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
      
      <div className="table-container">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {groups.map((group) => (
              <Table.Tr key={group.id}>
                <Table.Td>{group.id}</Table.Td>
                <Table.Td>{group.name}</Table.Td>
                <Table.Td>{group.description}</Table.Td>
                <Table.Td>
                  <Button 
                    size="xs" 
                    variant="light"
                    onClick={() => handleViewDetails(group.id)}
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
        title="Group Details"
        id={selectedGroupId}
        fetchData={api.getGroup}
        renderContent={renderGroupDetails}
      />
    </Box>
  );
};

export default GroupsList;