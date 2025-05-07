import { useState } from 'react';
import { Title, Divider } from '@mantine/core';
import GroupForm from '../components/GroupForm';
import GroupsList from '../components/GroupsList';

const GroupsPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleGroupCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div>
      <Title order={2} mb={20}>Accounting Groups</Title>
      <GroupForm onGroupCreated={handleGroupCreated} />
      <Divider my={30} />
      <GroupsList refreshTrigger={refreshTrigger} />
    </div>
  );
};

export default GroupsPage;