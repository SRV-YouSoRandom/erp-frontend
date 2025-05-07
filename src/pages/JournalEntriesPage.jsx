import { useState } from 'react';
import { Title, Divider } from '@mantine/core';
import JournalEntryForm from '../components/JournalEntryForm';
import JournalEntriesList from '../components/JournalEntriesList';

const JournalEntriesPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEntryCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div>
      <Title order={2} mb={20}>Journal Entries</Title>
      <JournalEntryForm onEntryCreated={handleEntryCreated} />
      <Divider my={30} />
      <JournalEntriesList refreshTrigger={refreshTrigger} />
    </div>
  );
};

export default JournalEntriesPage;