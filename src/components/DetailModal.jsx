// src/components/DetailModal.jsx
import { useState, useEffect } from 'react';
import { Title, Text, Paper, Loader, Stack, Group, Button } from '@mantine/core';

const DetailModal = ({ isOpen, onClose, title, fetchData, id, renderContent }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (isOpen && id) {
        setLoading(true);
        setError(null);
        try {
          const result = await fetchData(id);
          setData(result);
        } catch (err) {
          console.error(`Error fetching data for ID ${id}:`, err);
          setError('Failed to load data. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [isOpen, id, fetchData]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => {
      // Close when clicking the overlay (outside the modal)
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="modal-content">
        <Group justify="space-between" mb={20}>
          <Title order={3}>{title}</Title>
          <Button onClick={onClose} variant="subtle">Close</Button>
        </Group>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <Loader />
          </div>
        ) : error ? (
          <Paper p="md" withBorder color="red">
            <Text color="red">{error}</Text>
          </Paper>
        ) : data ? (
          <Stack>
            {renderContent(data)}
          </Stack>
        ) : (
          <Text c="dimmed">No data available</Text>
        )}
      </div>
    </div>
  );
};

export default DetailModal;